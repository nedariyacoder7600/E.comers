import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiArrowLeft, FiStar, FiShield, FiTruck, FiMinus, FiPlus, FiHeart } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(null);
  const [activeColor, setActiveColor] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        if (response.data.success) {
          const prod = response.data.product;
          setProduct(prod);
          setActiveImage(prod.img || prod.image);
          if (prod.colors && prod.colors.length > 0) {
            setActiveColor(prod.colors[0]);
            if (prod.colors[0].imageUrl) setActiveImage(prod.colors[0].imageUrl);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details", error);
        toast.error("Failed to load product details.");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full"
      />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <p className="text-xl mb-4">Product not found.</p>
      <button onClick={() => navigate('/all')} className="text-gold border border-gold px-6 py-2 rounded-full">Go Back</button>
    </div>
  );

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product._id || product.id);
    }
    toast.success(`${product.name || product.title} added to vault.`, {
      theme: "dark",
      icon: <FiShoppingCart className="text-gold" />
    });
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors mb-12 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-widest">Return to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Product Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            <div className="aspect-square bg-black rounded-[40px] overflow-hidden border border-white/5 relative">
              <img 
                src={activeImage || product.img || product.image} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                alt={product.name || product.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-8 left-8 bg-gold/10 backdrop-blur-md border border-gold/30 px-4 py-1 rounded-full">
                <span className="text-gold text-[10px] uppercase font-bold tracking-widest">{product.category}</span>
              </div>
            </div>

            {/* Micro details */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[product.img || product.image, product.img2, product.img3, product.img4].filter(Boolean).map((image, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(image)}
                  className={`aspect-square bg-white/5 rounded-2xl border ${activeImage === image ? 'border-gold' : 'border-white/5'} overflow-hidden cursor-pointer hover:border-gold/30 transition-colors`}
                >
                  <img src={image} className={`w-full h-full object-cover transition-opacity ${activeImage === image ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} alt={`Thumbnail ${i+1}`} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold font-cormorant uppercase tracking-tighter mb-4 leading-none">
                {product.name || product.title}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-gold">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < (product.rating || 5) ? "fill-gold" : ""} />
                  ))}
                </div>
                <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest border-l border-white/10 pl-4">Verified Asset</span>
              </div>
            </div>

            {/* Color Variants Section */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8 border-t border-white/5 pt-6">
                <p className="text-gray-400 mb-4 text-sm font-light">Colour: <span className="text-white font-bold">{activeColor?.colorName || ''}</span></p>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => { setActiveColor(color); if (color.imageUrl) setActiveImage(color.imageUrl); }}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${activeColor?.colorName === color.colorName ? 'border-gold scale-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'border-transparent hover:border-white/20'}`}
                    >
                      <img src={color.imageUrl} alt={color.colorName} className="w-full h-full object-cover bg-white/5" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-gray-500 text-sm mt-2 mb-8 font-light leading-relaxed">
              {product.description || "A masterfully engineered blend designed for the most discerning connoisseurs. Part of our elite sensory collection."}
            </p>

            {/* Premium Checkout Card */}
            <div className="bg-gradient-to-b from-white/[0.03] to-black border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-all duration-700"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-bold text-white font-mono tracking-tighter">₹{product.price}</span>
                    <span className="text-gray-500 line-through text-lg mb-1">₹{parseInt(product.price) + 500}</span>
                    <span className="text-rose-500 font-bold mb-1 text-sm border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 rounded">-15%</span>
                  </div>
                  <p className="text-gray-400 text-xs uppercase tracking-widest">Inclusive of all taxes</p>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-6 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold"></div>
                  <p className="text-sm text-gold font-bold mb-1 flex items-center gap-2">
                    <FiStar /> Save Extra with Vault Offers
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">Bank Offer: Get 5% cashback with Elite Cards. <span className="text-gold cursor-pointer hover:underline">Details</span></p>
                </div>

                <div className="mb-6 border-b border-white/10 pb-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gold shrink-0">
                      <FiTruck size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">FREE Ghost Delivery by</p>
                      <p className="text-white font-bold tracking-wide">Tomorrow, 10 PM</p>
                      <p className="text-xs text-gray-500 mt-1">Order within <span className="text-emerald-400 font-mono">2h 29m</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-emerald-400 font-mono tracking-wider uppercase">In The Vault</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FiShield className="text-gold" /> Secure
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm text-gray-400 uppercase tracking-widest">Quantity:</span>
                    <div className="flex items-center bg-black border border-white/20 rounded-lg overflow-hidden w-32">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 p-3 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex justify-center"><FiMinus size={14} /></button>
                      <span className="w-10 text-center font-mono text-sm">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="flex-1 p-3 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex justify-center"><FiPlus size={14} /></button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                    >
                      <FiShoppingCart size={16} />
                      Add to Cart
                    </button>

                    <button 
                      onClick={() => {
                        handleAddToCart();
                        navigate('/cart');
                      }}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
                
                <button className="w-full mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-gray-500 uppercase tracking-widest hover:text-gold transition-colors">
                  <FiHeart /> Add to Wishlist
                </button>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Tabs / More Info */}
        <div className="mt-32">
          <div className="flex gap-12 border-b border-white/5 mb-8">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative ${activeTab === tab ? 'text-gold' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            ))}
          </div>
          
          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 font-light leading-relaxed max-w-4xl">
                {product.description || "The craftsmanship behind this piece reflects a legacy of engineering excellence. Each material has been selected for its thermal properties and aesthetic resonance. Experience the peak of modern design."}
              </motion.div>
            )}
            {activeTab === 'specifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                {[
                  { label: "Material", value: "Surgical Grade Steel" },
                  { label: "Origin", value: "Laboratory Crafted" },
                  { label: "Weight", value: "1.2kg" },
                  { label: "Maintenance", value: "Minimal Effort" }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-white/5">
                    <span className="text-gray-500 text-[10px] uppercase tracking-widest">{spec.label}</span>
                    <span className="text-white text-xs font-mono">{spec.value}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
