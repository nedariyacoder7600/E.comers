import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHexagon, FiFilter } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import FlavorSidebar from '../components/FlavorSidebar';

const All = () => {
  const { search, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState('All');
  const [activeBrand, setActiveBrand] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    title: 'COLLECTION',
    subtitle: 'HUB',
    banners: [
      'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=2000&auto=format&fit=crop'
    ]
  });

  const fetchData = async () => {
    try {
      const [resProducts, resConfig] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/page-config/all')
      ]);
      
      if (resProducts.data.success) {
        setProducts(resProducts.data.products);
      }
      if (resConfig.data.config) {
        setConfig(resConfig.data.config);
      }
      setLoading(false);
    } catch (error) {
      console.error('Core sync error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setFilter(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (config.banners && config.banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % config.banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [config.banners]);

  const categories = ['All', 'Hookah Pot', 'Chillum', 'Pipe', 'Mouthpiece', 'Flavor', 'Coal', 'Tongs', 'Foil', 'Grommets'];
  const flavorBrands = ['Afzal', 'Maya', 'Al Fakher', 'Starbuzz'];
  const flavorTypes = ['Fruity', 'Mint', 'Creamy', 'Classic', 'Tangy'];
  const allFlavorCategories = ['Flavor', ...flavorBrands, ...flavorTypes];

  const filteredProducts = products.filter(p => {
    const isFlavorCategory = allFlavorCategories.includes(p.category);
    const matchCategory = filter === 'All' || p.category === filter || (filter === 'Flavor' && isFlavorCategory);
    
    const pName = (p.name || p.title || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    
    const matchSearch = pName.includes(search.toLowerCase());
    const matchBrand = activeBrand === '' || pName.includes(activeBrand.toLowerCase()) || pCat === activeBrand.toLowerCase();
    
    return matchCategory && matchSearch && matchBrand;
  });

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans pb-20 pt-24">
      
      <div className="w-full mb-12">
        {/* 🌟 Premium Luxury Gold Hero Banner */}
        <div className="bg-gradient-to-r from-[#2c140d] via-[#1f0e09] to-[#120704] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between min-h-[60vh] md:min-h-[70vh] border-b border-[#d4af37]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          {/* Background Slider Image with Fade */}
          <div className="absolute top-0 left-0 w-full lg:w-2/3 h-full z-0 pointer-events-none">
            <AnimatePresence mode="wait">
              {config.banners && config.banners.length > 0 && (
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cover bg-top"
                  style={{ backgroundImage: `url('${config.banners[currentImageIndex]}')` }}
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1f0e09]/80 to-[#120704]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2c140d] via-transparent to-transparent opacity-80"></div>
          </div>

          {/* Center/Left Text Content */}
          <div className="relative z-10 w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center h-full pt-20 lg:pt-0">
            <div className="flex items-center gap-3 mb-2 drop-shadow-xl">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#d4af37]">
                  <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="currentColor"/>
               </svg>
               <h1 className="text-6xl md:text-8xl font-black text-[#d4af37] font-cormorant tracking-tight leading-none uppercase">
                  {config.title || 'Gold'}
               </h1>
            </div>
            <p className="text-[#d4af37] font-cormorant text-2xl md:text-3xl italic font-medium mb-10 pl-2">
               Products you Love. Quality we Trust.
            </p>
            <div className="pl-2">
               <button className="bg-transparent border border-[#d4af37] text-[#d4af37] font-bold py-3 px-10 rounded uppercase tracking-widest text-sm hover:bg-[#d4af37] hover:text-[#2c140d] transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  Explore Now
               </button>
            </div>
          </div>

          {/* Right Side - Category Arches */}
          <div className="relative z-10 w-full lg:w-1/2 p-8 md:p-16 flex items-center justify-center lg:justify-end">
            <div className="grid grid-cols-2 gap-6 md:gap-10">
              {(config.categories && config.categories.length > 0 ? config.categories : [
                { name: 'Hookah Pots', img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=200&auto=format&fit=crop' },
                { name: 'Flavors', img: 'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=200&auto=format&fit=crop' },
                { name: 'Magic Coal', img: 'https://images.unsplash.com/photo-1550966841-3ee922bc968c?q=80&w=200&auto=format&fit=crop' },
                { name: 'Silver Foil', img: 'https://images.unsplash.com/photo-1620078864936-7c0b624f15d7?q=80&w=200&auto=format&fit=crop' }
              ]).slice(0, 4).map((cat, i) => (
                <div key={i} className="flex flex-col items-center group cursor-pointer" onClick={() => setFilter(cat.name)}>
                  <div className="w-28 h-36 md:w-40 md:h-52 rounded-t-full rounded-b-xl border border-[#d4af37] p-1.5 overflow-hidden relative group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-shadow duration-300">
                    <div className="w-full h-full rounded-t-full rounded-b-lg overflow-hidden bg-[#2c140d] relative">
                       <img src={cat.img} alt={cat.name} className="w-full h-[80%] object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2 md:pb-3">
                          <span className="text-[#d4af37] font-bold text-xs md:text-sm tracking-wide text-center px-1 font-sans uppercase">{cat.name}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-8">
        {/* Filters */}
        <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-200 mb-8 sticky top-20 z-40">
          <div className="p-3 text-[#f43397] border-r border-gray-200 hidden md:flex items-center gap-2">
             <FiFilter /> <span className="font-bold text-sm uppercase">Filter</span>
          </div>
          <div className="flex space-x-3 overflow-x-auto w-full pb-1 scrollbar-hide">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => {
                  setFilter(c);
                  if (c !== 'Flavor') setActiveBrand('');
                }}
                onMouseEnter={() => c === 'Flavor' && setIsSidebarOpen(true)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  filter === c 
                    ? 'bg-[#f43397] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c === 'Flavor' && activeBrand ? `Flavor: ${activeBrand}` : c}
              </button>
            ))}
          </div>
        </div>

        <FlavorSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          activeBrand={activeBrand}
          onSelectBrand={(brand) => {
            setFilter('Flavor');
            setActiveBrand(brand);
          }}
        />

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={product._id || product.id}
                onClick={() => navigate(`/product/${product._id || product.id}`)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="h-48 md:h-56 bg-[#f8f8f8] flex items-center justify-center p-4 relative group">
                    <img 
                      src={product.img || product.image || 'https://via.placeholder.com/400'} 
                      alt={product.title || product.name} 
                      className={`max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ${!product.inStock ? 'opacity-40 grayscale' : ''}`} 
                    />
                    
                    {!product.inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-10">
                         <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transform -rotate-12 border-2 border-white/20">
                            {product.stockLabel || 'Out of Stock'}
                         </div>
                      </div>
                    )}

                    <div className="absolute top-2 left-0 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-r-full text-black z-20">
                       {product.category || 'TRENDING'}
                    </div>
                    
                    {product.originalPrice && product.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-500 px-2 py-1 rounded text-[10px] font-black z-20">
                        -{Math.round(((Number(String(product.originalPrice).replace(/[^0-9.]/g, '')) - Number(String(product.price).replace(/[^0-9.]/g, ''))) / Number(String(product.originalPrice).replace(/[^0-9.]/g, ''))) * 100)}%
                      </div>
                    )}

                    {product.inStock && (
                      <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           addToCart(product._id || product.id);
                         }}
                         className="absolute bottom-2 right-2 bg-white text-[#f43397] p-2 rounded-full shadow-md border border-gray-100 hover:bg-[#f43397] hover:text-white transition-colors z-20"
                      >
                         <FiShoppingCart size={16} />
                      </button>
                    )}
                 </div>
                
                <div className="p-3 md:p-4 flex flex-col flex-grow">
                   <h3 className="text-sm font-semibold text-gray-600 line-clamp-1 mb-1">{product.title || product.name}</h3>
                   <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xl font-bold text-gray-900">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                      {product.originalPrice && (
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Special Deal</span>
                      )}
                   </div>
                   
                   <div className="flex items-center w-fit gap-1 bg-gray-100 rounded-full px-2 py-1 mb-3">
                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500" height="12" width="12" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                      <span className="text-[10px] font-bold text-gray-600 uppercase">Free Delivery</span>
                   </div>
                   
                   <div className="flex items-center gap-2 mt-auto">
                      <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
                         4.2 <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="10" width="10" xmlns="http://www.w3.org/2000/svg"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">854 Reviews</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm mt-8">
            <FiHexagon className="text-6xl text-gray-300 mx-auto mb-4 animate-spin-slow" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Products Found</h3>
            <p className="text-gray-500 text-sm">Please try a different category or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default All;
