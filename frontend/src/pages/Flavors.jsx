import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiSearch, FiSliders, FiStar, FiHexagon } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import FlavorSidebar from '../components/FlavorSidebar';

// 2030 Hyper-Premium Mock Data
const allFlavors = [
  { id: 1, name: 'Quantum Mint', price: '$34.99', category: 'Mint', rating: 4.9, img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600&auto=format&fit=crop', color: 'from-cyan-500/20 to-blue-600/20' },
  { id: 2, name: 'Nebula Grape', price: '$39.99', category: 'Fruity', rating: 5.0, img: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=600&auto=format&fit=crop', color: 'from-purple-500/20 to-fuchsia-600/20' },
  { id: 3, name: 'Solar Peach', price: '$32.99', category: 'Fruity', rating: 4.8, img: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=600&auto=format&fit=crop', color: 'from-orange-500/20 to-amber-600/20' },
  { id: 4, name: 'Cyber Apple', price: '$31.99', category: 'Classic', rating: 4.9, img: 'https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?auto=format&fit=crop&q=80&w=600', color: 'from-green-500/20 to-emerald-600/20' },
  { id: 5, name: 'Holo Vanilla', price: '$35.99', category: 'Creamy', rating: 4.7, img: 'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?auto=format&fit=crop&q=80&w=600', color: 'from-zinc-400/20 to-neutral-500/20' },
  { id: 6, name: 'Neon Berry', price: '$37.99', category: 'Tangy', rating: 4.8, img: 'https://images.unsplash.com/photo-1515276495116-2fd19875f5b2?auto=format&fit=crop&q=80&w=600', color: 'from-pink-500/20 to-rose-600/20' },
];

const categories = ['All', 'Fruity', 'Mint', 'Creamy', 'Tangy', 'Zesty', 'Classic'];
const flavorBrands = ['Afzal', 'Maya', 'Al Fakher', 'Starbuzz'];
const allFlavorCategories = ['Fruity', 'Mint', 'Creamy', 'Tangy', 'Zesty', 'Classic', ...flavorBrands, 'Flavor'];

const Flavors = () => {
  const { search, setSearch, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentHero, setCurrentHero] = useState(0);
  const [products, setProducts] = useState([]);
  const [config, setConfig] = useState({
    title: 'FLAVOR',
    subtitle: 'MESH',
    banners: [
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=1200'
    ]
  });

  const { scrollY } = useScroll();
  const yBackground = useTransform(scrollY, [0, 1000], [0, 300]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resConfig] = await Promise.all([
            axios.get('http://localhost:5000/api/products'),
            axios.get('http://localhost:5000/api/page-config/flavors')
        ]);

        if (resProducts.data.success) {
            setProducts(resProducts.data.products);
        }
        if (resConfig.data.config) {
            setConfig(resConfig.data.config);
        }
      } catch (err) { console.warn('Flavor sync failed.'); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (config.banners && config.banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentHero((prev) => (prev + 1) % config.banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [config.banners]);

  const filteredFlavors = products.filter(flavor => {
    const pName = (flavor.name || flavor.title || '').toLowerCase();
    const pCat = (flavor.category || '');
    
    // Strict Filter: Only show flavors, exclude pots, coals, etc.
    if (!allFlavorCategories.includes(pCat) && pCat !== 'Flavor') return false;

    const matchesCategory = activeCategory === 'All' || pCat === activeCategory;
    const matchesSearch = pName.includes(search.toLowerCase());
    const matchesBrand = activeBrand === '' || pName.includes(activeBrand.toLowerCase()) || pCat === activeBrand;
    
    return matchesCategory && matchesSearch && matchesBrand;
  });

  const handleAddToCart = (e, productId) => {
    e.stopPropagation();
    addToCart(productId);
  };

  return (
    <div className="w-full bg-[#020202] min-h-screen text-gray-100 font-sans pb-32 overflow-hidden selection:bg-gold selection:text-black">
      
      {/* 2030 Futuristic Environment Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.08)_0%,transparent_50%)]"
        />
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      </div>

      <motion.div style={{ y: yBackground }} className="relative z-10 pt-20 pb-12 text-center">
        <div className="relative w-full h-[350px] md:h-[450px] mb-12 overflow-hidden border-b border-white/5">
          <AnimatePresence mode="wait">
            {config.banners && config.banners.length > 0 && (
              <motion.div
                key={currentHero}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <img src={config.banners[currentHero]} className="w-full h-full object-cover brightness-[0.7]" alt="Hero" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent " />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <h1 
                     onMouseEnter={() => setIsSidebarOpen(true)}
                     className="text-5xl md:text-8xl font-bold font-cormorant uppercase tracking-tighter text-white cursor-pointer hover:text-gold transition-colors"
                   >
                      {config.title} <span className="text-gold italic">{config.subtitle}</span>
                   </h1>
                   <motion.div animate={{ width: "60px" }} className="h-0.5 bg-gold mt-6 shadow-[0_0_15px_rgba(212,175,55,1)]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="relative z-20 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="sticky top-24 z-50 mb-16">
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-2xl">
            <div className="flex overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 gap-2 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-500 ${
                    activeCategory === cat ? 'text-black bg-gold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onMouseEnter={() => setIsSidebarOpen(true)}
                onClick={() => setIsSidebarOpen(true)}
                className={`relative px-6 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-500 ${
                  activeBrand ? 'text-black bg-gold' : 'text-gold border border-gold/50 hover:bg-gold/10'
                }`}
              >
                {activeBrand ? `Brand: ${activeBrand}` : 'Select Brand'}
              </button>
            </div>
            <div className="relative w-full lg:w-96">
              <input 
                type="text" 
                placeholder="Initiate flavor scan..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 px-12 text-sm font-mono focus:border-gold outline-none"
              />
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {filteredFlavors.map((flavor) => (
              <motion.div 
                key={flavor._id || flavor.id} 
                layout 
                onClick={() => navigate(`/product/${flavor._id || flavor.id}`)}
                className="animated-card-wrapper !rounded-3xl overflow-hidden group cursor-pointer"
              >
                <div className="animated-card-inner !bg-[#050505] p-4">
                   <div className="h-48 overflow-hidden rounded-2xl mb-4 relative">
                     <img src={flavor.img || flavor.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                   </div>
                   <h3 className="text-sm font-bold text-center group-hover:text-gold uppercase tracking-widest truncate">{flavor.name || flavor.title}</h3>
                   <div className="flex justify-between items-center mt-6">
                      <span className="text-lg font-bold text-white font-mono">₹{flavor.price}</span>
                      <button onClick={(e) => handleAddToCart(e, flavor._id || flavor.id)} className="bg-gold text-black px-6 py-2 rounded-xl text-[10px] uppercase font-black hover:bg-white transition-colors">Add</button>
                   </div>
                </div>
              </motion.div>
          ))}
        </div>

        <FlavorSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          activeBrand={activeBrand}
          onSelectBrand={(brand) => setActiveBrand(brand)}
        />
      </div>
    </div>
  );
};

export default Flavors;
