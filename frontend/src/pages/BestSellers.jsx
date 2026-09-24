import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrendingUp, FiAward, FiStar, FiChevronRight, FiPlayCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const BestSellers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState({
    title: 'THE ELITE',
    subtitle: 'TIER',
    description: 'Our most requested and highly praised blends globally. These are the undisputed champions of flavor engineering.',
    banners: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resConfig] = await Promise.all([
            axios.get('http://localhost:5000/api/products'),
            axios.get('http://localhost:5000/api/page-config/bestsellers')
        ]);
        
        if (resProducts.data.success) {
            // Take top 3 for best sellers
            setProducts(resProducts.data.products.slice(0, 3));
        }
        if (resConfig.data.config) setConfig(resConfig.data.config);
      } catch (err) { console.warn('Bestsellers sync failed.'); }
    };
    fetchData();
  }, []);

  const addToCart = (e, productId) => {
    e.stopPropagation();
    toast.success(`Exclusive Selection: Procured.`, {
      position: 'bottom-right',
      theme: 'dark',
      icon: <FiAward className="text-gold" />
    });
  };

  return (
    <div className="w-full bg-[#030303] min-h-screen text-gray-100 font-sans pb-32 overflow-hidden selection:bg-gold selection:text-black">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gold/5 blur-[150px] opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 pt-32 pb-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-center items-center gap-3 mb-6">
            <span className="w-12 h-[1px] bg-gold" />
            <span className="text-gold text-sm uppercase tracking-[0.4em] font-bold flex items-center gap-2">
              <FiTrendingUp /> Hall of Fame
            </span>
            <span className="w-12 h-[1px] bg-gold" />
          </div>
          
          <h1 className="text-6xl md:text-[6rem] font-bold tracking-tighter text-white mb-6 font-cormorant">
            {config.title} <span className="text-gold italic">{config.subtitle}</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto font-light text-lg tracking-wide">
            {config.description}
          </p>
        </motion.div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-12">
        <div className="flex flex-col gap-12">
          {products.map((flavor, index) => (
            <motion.div
              key={flavor._id || flavor.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              onClick={() => navigate(`/product/${flavor._id || flavor.id}`)}
              className="animated-card-wrapper group cursor-pointer mb-12"
            >
              <div className="animated-card-inner !bg-[#0a0a0a] flex flex-col md:flex-row items-stretch overflow-hidden">
                <div className="w-full md:w-2/5 h-64 md:h-[500px] relative">
                   <img src={flavor.img || flavor.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" alt={flavor.name || flavor.title} />
                   <div className="absolute top-0 left-0 bg-gold text-black font-black p-6 text-4xl font-cormorant z-20 shadow-2xl">#{index + 1}</div>
                   <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />
                </div>
                <div className="w-full md:w-3/5 p-8 md:p-12">
                   <h3 className="text-4xl font-cormorant font-bold mb-4">{flavor.name || flavor.title}</h3>
                   <p className="text-gray-400 mb-8 font-light italic">{flavor.tagline || 'Exclusive precision-engineered blend.'}</p>
                   <div className="flex gap-10 border-y border-white/5 py-6 mb-8">
                      <div>
                         <span className="text-[10px] text-gray-600 block mb-1">Rating</span>
                         <span className="text-xl font-mono text-gold flex items-center gap-2"><FiStar className="fill-gold" /> {flavor.rating || 5.0}</span>
                      </div>
                      <div>
                         <span className="text-[10px] text-gray-600 block mb-1">Price</span>
                         <span className="text-xl font-mono">₹{flavor.price}</span>
                      </div>
                   </div>
                   <button onClick={(e) => addToCart(e, flavor._id || flavor.id)} className="w-full bg-white text-black py-4 uppercase font-black tracking-widest text-xs hover:bg-gold transition-all">Acquire System Selection</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
