import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPieChart, FiShoppingBag, FiBox, 
  FiSearch, FiLogOut, 
  FiLayout, FiChevronDown, FiTrash2,
  FiEye, FiRefreshCw, FiClock, FiTruck, FiCheckCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders", error);
      toast.error("Failed to sync logistics.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, { orderStatus: newStatus });
      if (response.data.success) {
        setOrders(prev => prev.map(order => order._id === orderId ? { ...order, orderStatus: newStatus } : order));
        toast.success(`Status: ${newStatus}`, { theme: "dark" });
      }
    } catch (error) {
       console.error(error);
       toast.error("Status update failed.");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Purge this transmission?")) return;
    try {
      const response = await axios.delete(`/api/orders/${orderId}`);
      if (response.data.success) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
        toast.success("Order deleted.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed.");
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.shippingAddress?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col transition-all duration-500">
        <div className="p-4 lg:p-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] flex-shrink-0">
            <FiLayout className="text-black text-xl" />
          </div>
          <span className="hidden lg:block text-xl font-bold tracking-tighter uppercase font-cormorant">Admin <span className="text-gold">OS</span></span>
        </div>

        <nav className="flex-grow px-2 lg:px-4 mt-8 space-y-4 lg:space-y-4">
          {[
            { name: 'Dashboard', icon: <FiPieChart />, path: '/admin/dashboard' },
            { name: 'Products', icon: <FiBox />, path: '/admin/products' },
            { name: 'Orders', icon: <FiShoppingBag />, path: '/admin/orders' },
            { name: 'Config', icon: <FiLayout />, path: '/admin/appearance' },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-center lg:justify-start gap-4 p-3 lg:px-4 lg:py-4 rounded-2xl transition-all duration-500 ${
                window.location.pathname === item.path ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl lg:text-xl">{item.icon}</span>
              <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 lg:p-6 border-t border-white/5">
          <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center lg:justify-start gap-4 p-3 lg:px-4 lg:py-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-colors">
            <FiLogOut className="text-xl lg:text-xl" />
            <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-20 lg:ml-64 p-4 lg:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2 uppercase font-cormorant">Logistics <span className="text-gold">Command</span></h1>
              <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">Classic View • Optimized Flux Data</p>
            </div>
            
            <button onClick={fetchOrders} className="p-4 rounded-xl bg-white/5 border border-white/10 text-gold hover:bg-gold hover:text-black transition-all">
                <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </header>

          <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[32px] shadow-2xl overflow-hidden p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="relative w-full md:w-96">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Find transmission ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-gold outline-none transition-all font-mono uppercase tracking-widest"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em]">
                    <th className="pb-4 px-4">Transmission ID</th>
                    <th className="pb-4 px-4">Client Entity</th>
                    <th className="pb-4 px-4">Assets</th>
                    <th className="pb-4 px-4">Value</th>
                    <th className="pb-4 px-4">Current Flux</th>
                    <th className="pb-4 px-4 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <AnimatePresence>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-20 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">
                           No active transmissions.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order, i) => (
                        <motion.tr 
                          key={order._id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="py-6 px-4 font-mono text-gold text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="py-6 px-4">
                            <div className="flex flex-col">
                               <span className="font-bold text-white tracking-wide">VIP Client</span>
                               <span className="text-[10px] text-gray-500 font-mono uppercase">
                                 {order.shippingAddress?.city} • {order.shippingAddress?.zipCode}
                               </span>
                            </div>
                          </td>
                          <td className="py-6 px-4 text-gray-400">
                             {order.products.length} Units
                          </td>
                          <td className="py-6 px-4 font-bold text-white">₹{order.totalPrice.toLocaleString()}</td>
                          <td className="py-6 px-4">
                             <div className="relative inline-block text-left group/status">
                                <button className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                   order.orderStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                   order.orderStatus === 'Cancelled' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                   'bg-gold/10 text-gold border-gold/20'
                                }`}>
                                   {order.orderStatus}
                                   <FiChevronDown />
                                </button>
                                
                                <div className="absolute left-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 py-2">
                                   {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                                      <button 
                                        key={status}
                                        onClick={() => updateOrderStatus(order._id, status)}
                                        className="w-full text-left px-4 py-2 hover:bg-gold/10 hover:text-gold text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                                      >
                                        {status === 'Pending' && <FiClock />}
                                        {status === 'Confirmed' && <FiCheckCircle />}
                                        {status === 'Shipped' && <FiTruck />}
                                        {status}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </td>
                          <td className="py-6 px-4 text-right">
                             <div className="flex justify-end gap-2 pr-2">
                                {order.orderStatus === 'Pending' && (
                                   <button 
                                     onClick={() => updateOrderStatus(order._id, 'Confirmed')}
                                     className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest"
                                   >
                                      Confirm
                                   </button>
                                )}
                                <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-500 hover:text-gold transition-all">
                                   <FiEye />
                                </button>
                                <button 
                                  onClick={() => deleteOrder(order._id)}
                                  className="flex items-center gap-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold group/del"
                                >
                                   <FiTrash2 />
                                   <span className="hidden group-hover/del:block text-[8px] uppercase tracking-widest">Purge</span>
                                </button>
                             </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminOrders;
