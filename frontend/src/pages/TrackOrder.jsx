import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiTruck, FiPackage, FiMapPin, FiBox, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import axios from 'axios';

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders?t=${new Date().getTime()}`);
        if (response.data.success) {
          const found = response.data.orders.find(o => o._id === id);
          setOrder(found);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const steps = [
    { name: 'Pending', icon: <FiClock />, label: 'Initial Request', gradient: 'from-blue-600 to-cyan-400', shadow: 'rgba(34,211,238,0.5)', glow: 'shadow-cyan-500/50' },
    { name: 'Confirmed', icon: <FiCheckCircle />, label: 'Manifest Secured', gradient: 'from-emerald-600 to-teal-400', shadow: 'rgba(45,212,191,0.5)', glow: 'shadow-teal-500/50' },
    { name: 'Processing', icon: <FiPackage />, label: 'Neural Packaging', gradient: 'from-purple-600 to-fuchsia-500', shadow: 'rgba(217,70,239,0.5)', glow: 'shadow-fuchsia-500/50' },
    { name: 'Shipped', icon: <FiTruck />, label: 'Ghost Transport', gradient: 'from-orange-500 to-amber-400', shadow: 'rgba(251,191,36,0.5)', glow: 'shadow-amber-500/50' },
    { name: 'Delivered', icon: <FiCheck />, label: 'Nexus Reached', gradient: 'from-yellow-500 to-[#d4af37]', shadow: 'rgba(212,175,55,0.5)', glow: 'shadow-[#d4af37]/50' },
  ];

  const isCancelled = order?.orderStatus === 'Cancelled';
  const currentStepIndex = isCancelled ? -1 : steps.findIndex(s => s.name === order?.orderStatus);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-gold font-mono tracking-widest uppercase">Syncing Neural Grid...</div>;
  if (!order) return <div className="min-h-screen bg-black flex items-center justify-center text-rose-500 uppercase tracking-widest font-bold">Transmission Lost. Order not found.</div>;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-[#030303] selection:bg-gold/30">
      <div className="max-w-5xl mx-auto px-6">
        
        <header className="mb-12 flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter font-cormorant mb-1"
            >
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-200 italic">Tracking</span>
            </motion.h1>
            <p className="text-gray-500 font-mono text-[10px] tracking-[0.3em] uppercase">Manifest ID: #{id.slice(-8).toUpperCase()}</p>
          </div>
          <button onClick={() => navigate('/orders')} className="text-gold flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors group">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Logs
          </button>
        </header>

        {isCancelled ? (
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="bg-gradient-to-br from-rose-950/40 to-black border border-rose-500/20 rounded-[40px] p-12 shadow-[0_0_50px_rgba(244,63,94,0.1)] text-center relative overflow-hidden"
          >
             <FiXCircle className="text-7xl text-rose-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
             <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Transmission Terminated</h2>
             <p className="text-rose-400 font-mono text-xs uppercase tracking-widest">This order has been cancelled.</p>
          </motion.div>
        ) : (
          <div className="bg-black/60 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Animated Background Line */}
            <div className="absolute top-[120px] md:top-[140px] left-[10%] right-[10%] h-1 bg-white/5 hidden md:block rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-gold shadow-[0_0_20px_rgba(212,175,55,0.8)] relative"
               >
                 <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white opacity-50 blur-sm" />
               </motion.div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isActive = index === currentStepIndex;
                const isNext = index === currentStepIndex + 1;

                return (
                  <div key={step.name} className="flex flex-col items-center group">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-[20px] flex items-center justify-center text-2xl transition-all duration-700 relative ${
                        isCompleted 
                          ? `bg-gradient-to-br ${step.gradient} text-white shadow-lg ${step.glow} border-none` 
                          : 'bg-[#111] text-gray-600 border border-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${step.gradient} blur-xl opacity-40`}
                        />
                      )}
                      <span className="relative z-10">{step.icon}</span>
                    </motion.div>
                    
                    <div className="mt-5 text-center">
                      <p className={`text-xs md:text-sm font-black uppercase tracking-widest transition-colors duration-500 ${
                        isActive ? 'text-transparent bg-clip-text bg-gradient-to-r ' + step.gradient :
                        isCompleted ? 'text-white' : 'text-gray-600'
                      }`}>
                        {step.name}
                      </p>
                      <p className={`text-[9px] md:text-[10px] font-mono mt-1.5 uppercase tracking-widest transition-colors duration-500 ${
                        isActive ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-gold text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-3">
                  <span className="p-2 bg-gold/10 rounded-lg"><FiMapPin /></span> Destiny Point
                </h3>
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                  <p className="text-white font-bold text-lg">{order.shippingAddress?.street}</p>
                  <p className="text-gray-400 text-sm mt-2">{order.shippingAddress?.city}, {order.shippingAddress?.zipCode}</p>
                  <p className="text-gold/50 text-[10px] mt-5 font-mono uppercase tracking-[0.3em]">{order.shippingAddress?.country}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5 flex items-center gap-3">
                  <span className="p-2 bg-white/10 rounded-lg"><FiBox /></span> Manifest Content
                </h3>
                <div className="space-y-3">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.05] p-4 rounded-2xl border border-white/5 transition-colors">
                      <span className="text-gray-300 text-xs font-bold uppercase tracking-wider">{item.product?.name || item.product?.title}</span>
                      <span className="text-gold font-black bg-gold/10 px-3 py-1 rounded-lg font-mono text-[10px]">QTY {item.quantity}</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">Total Valuation</span>
                    <span className="text-xl font-black text-white font-cormorant">₹{order.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
           <p className="text-gray-600 font-mono text-[10px] uppercase tracking-widest animate-pulse">
             {isCancelled ? "Connection severed." : "Scanning Nexus Nodes for real-time telemetry..."}
           </p>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;
