import React, { useEffect, useState, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiArrowLeft } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userData } = useContext(ShopContext);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders?t=${new Date().getTime()}`);
      if (response.data.success) {
        const userOrders = response.data.orders.filter(order => order.user === userData?._id);
        setOrders(userOrders);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders", error);
      setLoading(false);
    }
  }, [userData?._id]);

  useEffect(() => {
    let interval;
    if (!token) {
      navigate('/login');
    } else {
      fetchOrders();
      interval = setInterval(fetchOrders, 5000);
    }
    return () => { if (interval) clearInterval(interval); }
  }, [token, navigate, fetchOrders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FiClock className="text-amber-500" />;
      case 'Confirmed': return <FiCheckCircle className="text-emerald-400" />;
      case 'Processing': return <FiPackage className="text-blue-500" />;
      case 'Shipped': return <FiTruck className="text-cyan-500" />;
      case 'Delivered': return <FiCheckCircle className="text-emerald-500" />;
      case 'Cancelled': return <FiXCircle className="text-rose-500" />;
      default: return <FiClock className="text-gray-500" />;
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-gold font-mono tracking-widest uppercase">Syncing Manifests...</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter font-cormorant mb-2"
            >
              Order <span className="text-gold italic">History</span>
            </motion.h1>
            <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase">Deployment Logs & Acquisition Records</p>
          </div>
          <button 
            onClick={() => navigate('/all')}
            className="flex items-center gap-2 text-gold hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Depot
          </button>
        </header>

        {orders.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-white/5 rounded-[40px] bg-white/2">
            <FiPackage className="text-6xl text-gold/10 mx-auto mb-6" />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-8">No acquisition records found.</p>
            <button 
              onClick={() => navigate('/all')}
              className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white transition-all duration-500"
            >
              Initiate Acquisition
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-500 group"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                  
                  {/* Status & Info */}
                  <div className="md:w-64 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-white/5 rounded-lg text-lg">
                        {getStatusIcon(order.orderStatus)}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        order.orderStatus === 'Delivered' ? 'text-emerald-500' : 
                        order.orderStatus === 'Cancelled' ? 'text-rose-500' : 'text-gold'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Order ID</p>
                      <p className="text-xs text-white font-mono truncate">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Date</p>
                      <p className="text-xs text-white uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">Total Valuation</p>
                      <p className="text-xl font-bold text-gold font-cormorant">₹{order.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="flex-grow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.products.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => item.product?._id && navigate(`/product/${item.product._id}`)}
                          className="flex gap-4 p-3 bg-white/2 rounded-2xl border border-white/5 group-hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <div className="w-16 h-16 bg-black rounded-xl overflow-hidden flex-shrink-0">
                            <img src={item.product?.img || item.product?.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider truncate mb-1">
                              {item.product?.title || item.product?.name || 'Unknown Asset'}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-gold px-2 py-0.5 bg-gold/10 rounded">Qty: {item.quantity}</span>
                              <span className="text-[10px] font-mono text-gray-500">{item.product?.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex flex-wrap gap-3">
                       <button 
                         onClick={() => navigate(`/track-order/${order._id}`)}
                         className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold transition-all duration-300"
                       >
                          Track Shipment
                       </button>
                       <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:border-white/20 transition-all duration-300">
                          Voucher / Invoice
                       </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
