import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPackage, FiClock, FiStar
} from 'react-icons/fi';
import { GiSmokingPipe } from 'react-icons/gi';
import { ShopContext } from '../context/ShopContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { userData, token, setToken, setUserData } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setOrders(response.data.orders);
        }
        setLoading(false);
      } catch (error) {
        console.error("Profile order fetch error", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken('');
    setUserData(null);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const memberSinceDate = userData?.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Member';

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: <FiPackage className="text-gold" /> },
    { label: 'Member Since', value: memberSinceDate, icon: <FiClock className="text-purple-400" /> },
    { label: 'Tier Status', value: userData?.role === 'admin' ? 'Master Admin' : 'VIP Client', icon: <FiStar className="text-pink-400" /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold/10 rounded-full blur-[150px] animate-pulse" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold/5 rounded-full blur-[150px]" />
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card & Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[50px] p-10 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform duration-700">
                 <GiSmokingPipe />
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-40 h-40 rounded-[40px] p-1 bg-gradient-to-tr from-gold via-gold/20 to-gold shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                    <div className="w-full h-full rounded-[38px] overflow-hidden bg-black">
                      <img src={`https://ui-avatars.com/api/?name=${userData?.name || 'User'}&background=000&color=d4af37&size=256&font-size=0.35&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-black shadow-lg" 
                  />
                </div>

                <h2 className="text-3xl font-bold font-cormorant text-white uppercase tracking-tighter mb-1">
                  {userData?.name}
                </h2>
                <p className="text-gold font-mono text-[9px] uppercase tracking-[0.4em] mb-6">Level: {userData?.role === 'admin' ? 'Architect' : 'Elite Member'}</p>
                
                <div className="w-full space-y-3 mb-10">
                   <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">Status</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Synchronized
                      </span>
                   </div>
                   <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">Auth_Node</span>
                      <span className="text-[10px] text-gray-300 font-mono tracking-tighter">{userData?._id?.slice(-8).toUpperCase()}</span>
                   </div>
                </div>

                <div className="flex gap-3 w-full">
                   <button onClick={handleLogout} className="flex-1 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                      Terminate_Session
                   </button>
                   <Link to="/admin/dashboard" className={`flex-1 py-4 bg-gold text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all text-center ${userData?.role === 'admin' ? 'block' : 'hidden'}`}>
                      Core_Access
                   </Link>
                </div>
              </div>
            </motion.div>

            {/* Loyalty/Rewards Section */}
            <div className="bg-gradient-to-br from-gold/20 to-transparent border border-gold/30 rounded-[50px] p-10 relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm mb-2 font-cormorant italic">Luxe Gold Rewards</h3>
                  <div className="flex items-end gap-2 mb-6">
                     <span className="text-4xl font-bold text-gold">2,450</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-black">Points</span>
                  </div>
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5 mb-4">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '75%' }}
                       transition={{ duration: 1, delay: 0.5 }}
                       className="h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]" 
                     />
                  </div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">Next Tier: <span className="text-gold">Platinum Vault</span> (550 pts left)</p>
               </div>
            </div>
          </div>

          {/* Right Column: Content Grid */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {stats.concat({ label: 'Vault Credit', value: '₹12,400', icon: <FiStar className="text-gold" /> }).map((stat) => (
                 <motion.div 
                   key={stat.label}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl group hover:border-gold/30 transition-all"
                 >
                   <div className="text-xl mb-3 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                   <p className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                   <h4 className="text-sm font-bold text-white tracking-tight">{stat.value}</h4>
                 </motion.div>
               ))}
            </div>

            {/* Orders Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold font-cormorant text-white uppercase tracking-tighter italic">Recent <span className="text-gold">Pipeline</span></h2>
                 <Link to="/orders" className="bg-white/5 border border-white/10 text-gray-500 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:text-gold hover:border-gold transition-all">Full History</Link>
              </div>

              {orders.length === 0 ? (
                <div className="bg-black/40 backdrop-blur-3xl border border-white/5 p-20 rounded-[50px] text-center">
                   <FiPackage className="text-5xl text-gray-800 mx-auto mb-6 opacity-20" />
                   <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest italic">No active data transmissions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.slice(0, 4).map((order) => (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      key={order._id} 
                      className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-[35px] group hover:border-gold/20 transition-all cursor-pointer relative overflow-hidden"
                      onClick={() => navigate('/orders')}
                    >
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <FiPackage size={40} />
                       </div>
                       <div className="flex flex-col h-full justify-between">
                          <div>
                             <div className="flex items-center gap-3 mb-4">
                                <span className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gold font-mono text-[10px] border border-white/5">#{order._id.slice(-4).toUpperCase()}</span>
                                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em]">{new Date(order.createdAt).toLocaleDateString()}</span>
                             </div>
                             <h4 className="text-sm font-bold text-white mb-6 group-hover:text-gold transition-colors">{order.products?.[0]?.product?.name || 'Asset Bundle'}</h4>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                             <span className="text-lg font-bold text-white tracking-tight">₹{order.totalPrice.toLocaleString()}</span>
                             <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                               order.orderStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-gold/10 text-gold border-gold/20'
                             }`}>
                               {order.orderStatus}
                             </span>
                          </div>
                       </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
