import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { GiSmokingPipe } from 'react-icons/gi';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Login = () => {
  const { setToken, setUserData } = useContext(ShopContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        setToken(response.data.token);
        setUserData(response.data.user);
        
        toast.success('Access Granted. Syncing your sensory profile...');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Matrix connection failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-10 shadow-2xl"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group justify-center">
            <GiSmokingPipe className="text-4xl text-gold" />
            <span className="font-cormorant text-2xl font-bold tracking-widest text-white uppercase italic">LUXE <span className="text-gold">OS</span></span>
          </Link>
          <h2 className="text-3xl font-bold text-white uppercase tracking-tighter font-cormorant mb-2">Member <span className="text-gold">Auth</span></h2>
          <p className="text-gray-500 text-xs tracking-[0.2em] font-mono">INITIATE SECURE SESSION</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-gold transition-colors" />
              <input 
                type="email" 
                required
                placeholder="EMAIL_ADDRESS"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gold transition-all"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-gold transition-colors" />
              <input 
                type="password" 
                required
                placeholder="QUANTUM_KEY"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-gold transition-all"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-between items-center px-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-gold transition-all" />
              <span className="text-[10px] text-gray-500 uppercase tracking-widest group-hover:text-gray-300">Keep Sync Active</span>
            </label>
            <button type="button" className="text-[10px] text-gold uppercase tracking-widest hover:text-white transition-colors">Recover Key</button>
          </div>

          <button type="submit" className="w-full py-4 rounded-2xl bg-gold text-black font-bold uppercase tracking-[0.3em] text-xs hover:bg-white transition-all duration-500 shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
            Establish Link <FiArrowRight className="inline-block ml-2" />
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-4">New Entity?</p>
          <Link to="/register" className="text-white hover:text-gold transition-colors text-xs font-bold uppercase tracking-[0.2em] border-b border-gold/30 pb-1">
            Create Neural Profile
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
