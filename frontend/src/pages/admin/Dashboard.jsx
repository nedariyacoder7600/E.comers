import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPieChart, FiShoppingBag, FiUsers, FiBox, 
  FiTrendingUp, FiArrowUpRight, 
  FiSearch, FiBell, FiSettings,
  FiLogOut, FiLayout, FiTrash2
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 67000 },
  { name: 'Jul', revenue: 72000 },
];

const categoryData = [
  { name: 'Fruity', value: 400 },
  { name: 'Mint', value: 300 },
  { name: 'Creamy', value: 200 },
  { name: 'Classic', value: 100 },
];

const COLORS = ['#d4af37', '#8b5cf6', '#ec4899', '#06b6d4'];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [resOrders, resProducts] = await Promise.all([
        axios.get('/api/orders'),
        axios.get('/api/products')
      ]);
      if (resOrders.data.success) setOrders(resOrders.data.orders);
      if (resProducts.data.success) setProducts(resProducts.data.products);
    } catch (error) {
      console.error("Dashboard error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Purge this transmission from the matrix?")) return;
    try {
      const response = await axios.delete(`/api/orders/${orderId}`);
      if (response.data.success) {
        setOrders(prev => prev.filter(order => order._id !== orderId));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const activeOrders = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

  const stats = [
    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, change: '+12.5%', icon: <FiTrendingUp />, color: 'text-gold' },
    { title: 'Active Orders', value: activeOrders.toString(), change: '+8.2%', icon: <FiShoppingBag />, color: 'text-purple-500' },
    { title: 'Total Users', value: '15,692', change: '+24.1%', icon: <FiUsers />, color: 'text-pink-500' },
    { title: 'Inventory', value: `${products.length} Items`, change: '-3.4%', icon: <FiBox />, color: 'text-cyan-500' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-gray-100 font-sans">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col transition-all duration-500">
        <div className="p-4 lg:p-8 flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold to-gold-light flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] flex-shrink-0">
            <FiLayout className="text-black text-xl" />
          </div>
          <span className="hidden lg:block text-xl font-bold tracking-tighter uppercase font-cormorant">Admin <span className="text-gold">OS</span></span>
        </div>

        <nav className="flex-grow px-2 lg:px-4 mt-6 space-y-3">
          {['Dashboard', 'Products', 'Orders', 'Appearance', 'Analytics', 'Settings'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveTab(item);
                if(item === 'Products') navigate('/admin/products');
                if(item === 'Appearance') navigate('/admin/appearance');
                if(item === 'Orders') navigate('/admin/orders');
              }}
              className={`w-full flex items-center justify-center lg:justify-start gap-4 p-3 lg:px-4 lg:py-3 rounded-xl transition-all duration-300 ${
                activeTab === item ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl lg:text-lg">
                {item === 'Dashboard' && <FiPieChart />}
                {item === 'Products' && <FiBox />}
                {item === 'Orders' && <FiShoppingBag />}
                {item === 'Appearance' && <FiLayout />}
                {item === 'Analytics' && <FiTrendingUp />}
                {item === 'Settings' && <FiSettings />}
              </span>
              <span className="hidden lg:block text-sm font-semibold tracking-wide uppercase">{item}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 lg:p-6 border-t border-white/5">
          <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center lg:justify-start gap-4 p-3 lg:px-4 lg:py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
            <FiLogOut className="text-xl lg:text-base" />
            <span className="hidden lg:block text-sm font-semibold uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-20 lg:ml-64 p-4 lg:p-6 h-screen overflow-hidden flex flex-col">
        
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-cormorant">Operational <span className="text-gold">Intelligence</span></h1>
            <p className="text-gray-500 text-[10px] font-mono tracking-widest mt-1">SYSTEM STATUS: OPTIMIZED | NEURAL CORE ACTIVE</p>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-grow lg:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all relative">
              <FiBell />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 p-0.5 overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=Admin&background=d4af37&color=000" className="w-full h-full object-cover rounded-[10px]" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 flex-shrink-0">
          {stats.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.title}
              className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl shadow-2xl relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-3 opacity-10 text-5xl transform translate-x-4 -translate-y-4 group-hover:translate-x-2 transition-transform duration-500">
                {stat.icon}
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-2xl bg-white/5 ${stat.color} text-lg shadow-[inset_0_0_10px_rgba(255,255,255,0.02)]`}>
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded-full">
                  <FiArrowUpRight /> {stat.change}
                </div>
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{stat.title}</p>
              <h3 className="text-xl font-bold text-white tracking-tighter">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 flex-shrink-0 h-[220px]">
          {/* Main Revenue Chart */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/5 p-5 rounded-3xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide uppercase font-cormorant">Revenue Forecast</h3>
              </div>
              <select className="bg-black border border-white/10 rounded-lg text-[10px] py-1 px-2 focus:outline-none text-gray-400">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
            </div>
            <div className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff20" fontSize={9} axisLine={false} tickLine={false} dy={5} />
                  <YAxis stroke="#ffffff20" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                    itemStyle={{ color: '#d4af37' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-5 rounded-3xl shadow-2xl flex flex-col justify-between">
            <div className="mb-2 text-center">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase font-cormorant">Category Split</h3>
            </div>
            <div className="flex-grow w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {categoryData.slice(0,2).map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-[10px]">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                     <span className="text-gray-400 font-bold uppercase tracking-widest">{item.name}</span>
                   </div>
                   <span className="text-white font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - Activity Table */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl flex flex-col flex-grow overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-white/5 flex-shrink-0">
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-cormorant">Recent <span className="text-gold">Pipeline</span></h3>
            <button onClick={() => navigate('/admin/orders')} className="text-[9px] font-bold text-gold uppercase tracking-[0.2em] bg-gold/10 px-3 py-1.5 rounded-lg border border-gold/20 hover:bg-gold hover:text-black transition-all">
              View All
            </button>
          </div>
          <div className="overflow-y-auto flex-grow p-5 custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-[9px] uppercase font-bold tracking-[0.3em]">
                  <th className="pb-3 px-3 whitespace-nowrap">Order ID</th>
                  <th className="pb-3 px-3 whitespace-nowrap hidden sm:table-cell">Client Entity</th>
                  <th className="pb-3 px-3 whitespace-nowrap">Asset</th>
                  <th className="pb-3 px-3 whitespace-nowrap">Status</th>
                  <th className="pb-3 px-3 whitespace-nowrap text-right">Value</th>
                  <th className="pb-3 px-3 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-gray-600 font-mono text-[10px] uppercase tracking-widest">
                       Waiting for incoming transmissions...
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 10).map((order) => (
                    <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => navigate('/admin/orders')}>
                      <td className="py-3 px-3 font-mono text-gold text-[10px]">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-3 font-bold tracking-wide text-[11px] hidden sm:table-cell text-gray-300">VIP Client</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[120px] text-[11px] text-gray-300">
                             {order.products?.[0]?.product?.name || order.products?.[0]?.product?.title || 'Unknown Asset'}
                             {order.products.length > 1 && ` +${order.products.length - 1}`}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                          order.orderStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                          order.orderStatus === 'Cancelled' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                          order.orderStatus === 'Confirmed' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' :
                          'bg-gold/10 text-gold border-gold/20'
                        }`}>
                           {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white text-right text-[11px]">₹{order.totalPrice.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOrder(order._id);
                            }}
                            className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors rounded-lg"
                          >
                            <FiTrash2 size={14} />
                          </button>
                       </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
