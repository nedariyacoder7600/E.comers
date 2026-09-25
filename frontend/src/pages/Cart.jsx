import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiLock } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, updateQuantity, getCartAmount, token, userData, clearCart } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      if (response.data.success) {
        setProducts(response.data.products);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const cartData = Object.entries(cartItems)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = products.find(p => p._id === id || p.id === id);
      return product ? { ...product, quantity: qty } : null;
    })
    .filter(item => item !== null);

  const [shippingInfo, setShippingInfo] = useState({
    street: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!token) {
      toast.info("Authentication Required. Please sign in to finalize your booking.", {
        theme: "dark",
        style: { border: '1px solid #D4AF37', color: '#D4AF37' }
      });
      navigate('/login');
      return;
    }

    if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.zipCode) {
      toast.warning("Please provide complete shipping manifest details (Street, City, Zip).", {
        theme: "dark",
        style: { border: '1px solid #ff4d4d', color: '#ff4d4d' }
      });
      return;
    }

    try {
      const totalAmount = getCartAmount(products);
      
      const orderData = {
        user: userData?._id,
        products: cartData.map(item => ({ product: item._id || item.id, quantity: item.quantity })),
        totalPrice: totalAmount,
        shippingAddress: shippingInfo,
        paymentMethod: 'Razorpay',
        paymentStatus: 'Pending'
      };

      const orderResponse = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!orderResponse.data.success) {
        throw new Error("Failed to create local order record.");
      }

      const localOrderId = orderResponse.data.order._id;

      const rzpResponse = await axios.post('/api/orders/razorpay', { amount: totalAmount }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!rzpResponse.data.success) {
        throw new Error("Failed to initialize payment gateway.");
      }

      const rzpOrder = rzpResponse.data.order;

      const options = {
        key: "rzp_test_Sq7Q13RMFEZr5f",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Luxe Sensory Vault",
        description: "Premium Order Payment",
        image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        order_id: rzpOrder.id,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: localOrderId
            };

            const verifyRes = await axios.post('/api/orders/verify', verifyData, {
              headers: { Authorization: `Bearer ${token}` }
            });

            if (verifyRes.data.success) {
              clearCart();
              toast.success("Payment Successful! Order Confirmed.", {
                icon: <FiLock className="text-gold" />,
                theme: "dark"
              });
              navigate('/orders');
            }
          } catch (err) {
            console.error("Verification failed", err);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: userData?.name || "Customer",
          email: userData?.email || "customer@example.com",
          contact: ""
        },
        notes: {
          address: `${shippingInfo.street}, ${shippingInfo.city}`
        },
        theme: {
          color: "#D4AF37",
          backdrop_color: "#000000"
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / QR",
                instruments: [
                  {
                    method: "upi"
                  }
                ]
              }
            },
            sequence: ["block.upi", "method.card", "method.netbanking"],
            preferences: {
              show_default_blocks: true
            }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
          toast.error("Payment Failed: " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error("Order failed", error);
      const errMessage = error.response?.data?.message || error.message || "Matrix Connection Interrupted.";
      toast.error(`Booking Error: ${errMessage}`);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-gold font-mono tracking-widest uppercase">Initializing Vault...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#050505]">
      <div className="max-w-6xl mx-auto px-6">
        
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter font-cormorant mb-2"
          >
            Your <span className="text-gold italic">Sensory Vault</span>
          </motion.h1>
          <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase">Private Selection & Logistics</p>
        </header>

        {cartData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-dashed border-white/5 rounded-[40px] bg-white/2"
          >
            <FiShoppingBag className="text-6xl text-gold/10 mx-auto mb-6" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-8">Vault is currently empty.</p>
            <button 
              onClick={() => navigate('/all')}
              className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white transition-all duration-500"
            >
              Access Collection
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Cart Items & Shipping Form */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Shipping Form */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-8 rounded-[40px] shadow-2xl">
                <h2 className="text-xl font-bold text-white uppercase tracking-widest font-cormorant mb-6 border-b border-white/5 pb-4">Shipping <span className="text-gold italic">Manifest</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">Ghost Address (Street)</label>
                    <input 
                      type="text" name="street" value={shippingInfo.street} onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-gold outline-none transition-all"
                      placeholder="e.g. 74th Sector, Neon Plaza"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">Nexus Point (City)</label>
                    <input 
                      type="text" name="city" value={shippingInfo.city} onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-gold outline-none transition-all"
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">Neural Code (Zip)</label>
                    <input 
                      type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white focus:border-gold outline-none transition-all"
                      placeholder="e.g. 400001"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-widest font-cormorant mb-2">Vault <span className="text-gold italic">Inventory</span></h2>
                <AnimatePresence>
                {cartData.map((item) => (
                  <motion.div 
                    key={item._id || item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => navigate(`/product/${item._id || item.id}`)}
                    className="flex items-center gap-6 bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl group hover:border-gold/30 transition-all duration-500 cursor-pointer"
                  >
                    <div className="w-24 h-24 bg-black rounded-2xl overflow-hidden border border-white/5 flex-shrink-0">
                      <img src={item.img || item.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-gold transition-colors">{item.title || item.name}</h3>
                          <p className="text-[10px] text-gray-500 font-mono tracking-widest mt-1 uppercase">{item.flavor || 'Selected Asset'}</p>
                        </div>
                        <p className="text-sm font-bold text-gold font-mono">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden shadow-inner">
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item._id || item.id, (item.quantity || 1) - 1); }}
                            className="p-2 hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white font-mono">{item.quantity}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item._id || item.id, (item.quantity || 1) + 1); }}
                            className="p-2 hover:bg-gold/10 text-gray-400 hover:text-gold transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); updateQuantity(item._id || item.id, 0); }}
                          className="text-gray-500 hover:text-red-500 transition-colors p-2"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              </div>
            </div>
            
            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[40px] sticky top-32 shadow-2xl">
                <h2 className="text-xl font-bold text-white uppercase tracking-widest font-cormorant mb-8 border-b border-white/5 pb-4">Manifest</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500 uppercase tracking-widest">Subtotal</span>
                    <span className="text-white">₹{getCartAmount(products).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-500 uppercase tracking-widest">Logistics</span>
                    <span className="text-white">Gratis</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-4 border-t border-white/5">
                    <span className="text-gold uppercase tracking-[0.2em]">Total Amount</span>
                    <span className="text-white">₹{getCartAmount(products).toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white transition-all duration-500 shadow-[0_10px_30px_rgba(212,175,55,0.1)] flex items-center justify-center gap-2 group"
                >
                  Confirm Booking <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-8 flex items-center gap-3 justify-center text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                  <FiLock className="text-gold" /> Secure Neural Encryption
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
