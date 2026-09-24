import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiTruck, FiChevronRight, FiChevronLeft, FiClock, FiZap, FiShield, FiTrendingUp, FiShoppingBag, FiTag, FiPercent } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const dealScrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [config, setConfig] = useState({
    title: 'Lowest Prices & Best Quality Deals',
    banners: [
      { img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=600&auto=format&fit=crop', title: 'Luxury Hookah Pots', subtitle: 'Up to 50% Off On Premium Sets' },
      { img: 'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=600&auto=format&fit=crop', title: 'Exotic Premium Flavors', subtitle: 'Starting @ Only ₹199' },
      { img: 'https://images.unsplash.com/photo-1550966841-3ee922bc968c?q=80&w=600&auto=format&fit=crop', title: 'Quick-Ignite Magic Coal', subtitle: 'Long-Lasting Smoke Experience' }
    ],
    categories: [
      { name: 'Hookah Pots', img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=300&auto=format&fit=crop' },
      { name: 'Flavors', img: 'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=300&auto=format&fit=crop' },
      { name: 'Magic Coal', img: 'https://images.unsplash.com/photo-1550966841-3ee922bc968c?q=80&w=300&auto=format&fit=crop' },
      { name: 'Silver Foil', img: 'https://images.unsplash.com/photo-1620078864936-7c0b624f15d7?q=80&w=300&auto=format&fit=crop' },
      { name: 'Pipes', img: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=300&auto=format&fit=crop' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 18, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 4, minutes: 18, seconds: 45 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!config.banners || config.banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % config.banners.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [config.banners]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resConfig] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/page-config/home')
        ]);

        if (resProducts.data.success) {
          setProducts(resProducts.data.products);
        }

        if (resConfig.data.success && resConfig.data.config) {
          const fetchedConfig = resConfig.data.config;
          setConfig(prev => ({
            title: (fetchedConfig.title !== undefined && fetchedConfig.title !== '') ? fetchedConfig.title : prev.title,
            banners: fetchedConfig.banners?.length > 0 ? fetchedConfig.banners : prev.banners,
            categories: fetchedConfig.categories?.length > 0 ? fetchedConfig.categories : prev.categories
          }));
        }

        setLoading(false);
      } catch (error) {
        console.error('Data fetch error:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollDeals = (direction) => {
    if (dealScrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      dealScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentBanner = config.banners && config.banners.length > 0 ? config.banners[currentBannerIndex] : null;
  const currentBannerTitle = currentBanner
    ? (typeof currentBanner === 'string' ? config.title : (currentBanner.title || config.title))
    : config.title;
  const currentBannerSubtitle = currentBanner && typeof currentBanner !== 'string' ? currentBanner.subtitle : 'Exclusive Store Offers Available Now';

  // Filter products by tab
  const filteredProducts = products.filter(p => {
    if (activeTab === 'featured') return p.isFeatured;
    if (activeTab === 'deals') return p.originalPrice;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans pb-24 selection:bg-rose-500 selection:text-white">
      
      {/* 🚀 TOP PROMO TICKER STRIP */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-[#00897b] text-white text-xs font-bold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-3 shadow-sm">
        <span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold animate-pulse">
          ⚡ MEGA BAZAAR SALE
        </span>
        <span>Get up to 60% Instant Cashback + Free Express Delivery on orders over ₹499!</span>
      </div>

      {/* 🌟 JAKKAAS HERO BANNER */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-4 mb-8">
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-rose-950 border border-white/10 rounded-3xl flex flex-col md:flex-row items-center justify-between p-6 md:p-12 overflow-hidden relative shadow-2xl">
          
          {/* Background Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-rose-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Left Hero Content */}
          <div className="z-10 text-white max-w-xl mb-8 md:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-yellow-300 text-xs font-semibold uppercase tracking-wider mb-4 backdrop-blur-md">
              <FiZap className="text-yellow-400 animate-bounce" /> Limited Time Deals
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentBannerIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-4xl md:text-6xl font-black mb-3 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-rose-200 to-white font-cormorant capitalize">
                  {currentBannerTitle}
                </h1>
                <p className="text-gray-300 text-base md:text-lg mb-6 font-light">
                  {currentBannerSubtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-4 bg-white/5 backdrop-blur-md p-3.5 rounded-2xl w-fit border border-white/10 mb-6">
              <div className="flex items-center gap-2 px-3 border-r border-white/20">
                <FiTruck className="text-emerald-400 text-lg" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">FREE</span>
                  <span className="text-[9px] text-gray-300 uppercase tracking-widest">Delivery</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 border-r border-white/20">
                <FiShield className="text-purple-300 text-lg" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">COD</span>
                  <span className="text-[9px] text-gray-300 uppercase tracking-widest">Available</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3">
                <FiTag className="text-amber-400 text-lg" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">EASY</span>
                  <span className="text-[9px] text-gray-300 uppercase tracking-widest">7 Days Return</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/all')}
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 text-slate-900 font-extrabold py-3.5 px-8 rounded-xl text-sm md:text-base hover:shadow-lg hover:shadow-yellow-400/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>Explore Collection</span>
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Hero Image Slider */}
          <div className="relative z-10 w-full md:w-1/2 h-64 md:h-80 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {config.banners.length > 0 && (() => {
                const currentBanner = config.banners[currentBannerIndex];
                const bannerImg = typeof currentBanner === 'string' ? currentBanner : currentBanner.img;

                return (
                  <motion.div
                    key={currentBannerIndex}
                    initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.85, rotate: 3 }}
                    transition={{ duration: 0.6 }}
                    className="relative flex items-center justify-center"
                  >
                    <img
                      src={bannerImg}
                      className="w-56 md:w-80 h-56 md:h-80 object-cover rounded-3xl border-4 border-white/20 shadow-2xl shadow-purple-950/80"
                      alt={`Banner ${currentBannerIndex + 1}`}
                    />
                    <div className="absolute -bottom-4 right-2 bg-rose-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg border border-white/30 tracking-wider">
                      HOT DEAL 🔥
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* 🏷️ AMAZON / BAZAAR DEALS MULTI-CARD CAROUSEL (AS IN SCREENSHOT) */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-7 bg-red-600 rounded-sm" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Super Deals & Bargains Hub
            </h2>
          </div>

          {/* Scroll Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollDeals('left')}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-100 flex items-center justify-center transition-all cursor-pointer"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollDeals('right')}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-100 flex items-center justify-center transition-all cursor-pointer"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Cards Grid */}
        <div
          ref={dealScrollRef}
          className="flex overflow-x-auto gap-5 pb-4 no-scrollbar scroll-smooth snap-x"
        >

          {/* CARD 1: CASHBACK OFFER TILE GRID */}
          <div className="snap-start flex-shrink-0 w-[290px] md:w-[320px] bg-gradient-to-b from-red-600 to-rose-700 rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="inline-block bg-yellow-400 text-black font-extrabold text-[10px] uppercase px-2 py-0.5 rounded mb-2">
                MEGA CASHBACK
              </div>
              <h3 className="text-2xl font-black leading-tight mb-1">
                Get up to <br /><span className="text-yellow-300">₹150 cashback*</span>
              </h3>
              <p className="text-xs text-red-100 mb-4">Lowest prices guaranteed on top items</p>
            </div>

            {/* 3x2 Mini Image Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=150&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=150&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1550966841-3ee922bc968c?q=80&w=150&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1620078864936-7c0b624f15d7?q=80&w=150&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=150&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=150&auto=format&fit=crop'
              ].map((img, idx) => (
                <div key={idx} className="bg-white rounded-lg p-1 h-18 overflow-hidden flex items-center justify-center shadow-inner">
                  <img src={img} className="max-h-full object-cover rounded" alt="Item" />
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/all')}
              className="w-full bg-white text-red-700 font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Shop Bazaar Specials →
            </button>
          </div>

          {/* CARD 2: SHOP POPULAR DEALS (2x2 GRID CARD AS IN SCREENSHOT) */}
          <div className="snap-start flex-shrink-0 w-[290px] md:w-[320px] bg-gradient-to-b from-amber-900 to-red-950 rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-extrabold mb-3">Shop Popular Deals</h3>

              {/* 2x2 Mini Product Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {products.slice(0, 4).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="bg-white text-gray-900 p-2 rounded-xl cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-1">
                      <img src={item.img} className="max-h-full object-contain" alt={item.name} />
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold">{item.price}</span>
                      </div>
                      <span className="inline-block bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        35% OFF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate('/all')}
              className="w-full bg-amber-400 text-gray-900 font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-amber-300 transition-colors"
            >
              See All Deals →
            </button>
          </div>

          {/* CARD 3: STARTING @ ₹49 BUDGET DEALS */}
          <div className="snap-start flex-shrink-0 w-[290px] md:w-[320px] bg-white border border-gray-200 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="text-2xl font-black text-gray-900 tracking-tight mb-0.5">
                Starting <span className="text-[#00897b]">₹49</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-3">Home essentials & accessories</p>

              <div className="h-44 rounded-xl overflow-hidden mb-3 relative group">
                <img
                  src="https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=400&auto=format&fit=crop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Decor"
                />
                <div className="absolute top-2 left-2 bg-[#00897b] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  TOP PICK
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-center">
                <span className="text-[11px] font-semibold text-emerald-800">
                  🎁 Extra 10% Off with ICICI / HDFC Cards
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/all')}
              className="w-full mt-3 bg-gray-900 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              Explore Budget Picks →
            </button>
          </div>

          {/* CARD 4: UNDER ₹399 - POPULAR CATEGORIES */}
          <div className="snap-start flex-shrink-0 w-[290px] md:w-[320px] bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="text-2xl font-black text-yellow-300 tracking-tight mb-0.5">
                Under ₹399
              </div>
              <p className="text-xs text-gray-300 mb-3">Premium Flavors & Shisha Coal</p>

              <div className="h-44 rounded-xl overflow-hidden mb-3 relative group">
                <img
                  src="https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=400&auto=format&fit=crop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Flavors"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-lg text-xs font-bold text-center">
                  🔥 Best-Selling Aromas
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/all?category=Flavors')}
              className="w-full bg-yellow-400 text-slate-900 font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-yellow-300 transition-colors"
            >
              Shop Flavors →
            </button>
          </div>

          {/* CARD 5: UNDER ₹799 - LUXURY HOOKAH POTS */}
          <div className="snap-start flex-shrink-0 w-[290px] md:w-[320px] bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="text-2xl font-black text-cyan-300 tracking-tight mb-0.5">
                Under ₹799
              </div>
              <p className="text-xs text-blue-200 mb-3">Bespoke Hookah Pots & Accessories</p>

              <div className="h-44 rounded-xl overflow-hidden mb-3 relative group">
                <img
                  src="https://images.unsplash.com/photo-1550966841-3ee922bc968c?q=80&w=400&auto=format&fit=crop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Pots"
                />
              </div>
            </div>

            <button
              onClick={() => navigate('/all?category=Hookah%20Pots')}
              className="w-full bg-cyan-400 text-slate-900 font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider hover:bg-cyan-300 transition-colors"
            >
              View Pot Collection →
            </button>
          </div>

        </div>
      </div>

      {/* 🚀 CIRCULAR CATEGORY HUB */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-7 bg-[#00897b] rounded-sm" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Top Categories to Explore
            </h2>
          </div>
          <Link to="/all" className="text-xs font-bold text-[#00897b] hover:underline flex items-center gap-1">
            <span>View All</span>
            <FiChevronRight />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-6 md:gap-8 no-scrollbar snap-x">
          {config.categories.map((cat, i) => (
            <Link
              to={`/all?category=${encodeURIComponent(cat.name)}`}
              key={i}
              className="flex-shrink-0 flex flex-col items-center gap-3 snap-center group"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-rose-500 via-amber-400 to-[#00897b] group-hover:scale-105 transition-transform duration-300 shadow-md">
                <img
                  src={cat.img}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                  alt={cat.name}
                />
              </div>
              <span className="text-xs md:text-sm font-bold text-gray-800 text-center group-hover:text-[#00897b] transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ⚡ FLASH SALE COUNTDOWN BANNER */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        <div className="bg-gradient-to-r from-amber-500 via-rose-600 to-purple-700 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
              ⚡
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-yellow-300">
                LIMITED HOUR DEAL
              </span>
              <h3 className="text-2xl md:text-3xl font-black">Flash Sale Is Live Now!</h3>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
              <span className="text-xl font-black text-yellow-300 font-mono">0{timeLeft.hours}</span>
              <span className="block text-[9px] uppercase tracking-widest text-gray-300">Hours</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
              <span className="text-xl font-black text-yellow-300 font-mono">
                {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-gray-300">Mins</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
              <span className="text-xl font-black text-yellow-300 font-mono">
                {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-gray-300">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🛍️ PRODUCTS FOR YOU MEGA GRID */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-7 bg-rose-600 rounded-sm" />
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              Products For You
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'featured', label: '🔥 Trending' },
              { id: 'deals', label: '🏷️ Best Deals' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-rose-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Section */}
                <div className="h-52 md:h-60 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
                  <img
                    src={product.img}
                    alt={product.name}
                    className={`max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ${
                      !product.inStock ? 'opacity-40 grayscale' : ''
                    }`}
                  />

                  {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-10">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {product.stockLabel || 'Out of Stock'}
                      </div>
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-amber-400 text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-gray-900 shadow-sm z-20">
                    {product.isFeatured ? 'TRENDING' : (product.category || 'NEW')}
                  </div>

                  {product.originalPrice && product.inStock && (
                    <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm z-20">
                      SAVE BIG
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1 mb-2 group-hover:text-rose-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-black text-gray-900">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                      )}
                    </div>

                    {/* Free Delivery Tag */}
                    <div className="flex items-center w-fit gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md px-2 py-0.5 mb-3">
                      <FiTruck size={12} />
                      <span className="text-[10px] font-bold uppercase">Free Delivery</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold text-[11px]">
                      4.8 <FiStar size={10} className="fill-current" />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">1.2k+ sold</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🛡️ TRUST BADGES STRIP */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl mb-2">
              <FiTruck />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Fast Express Shipping</h4>
            <p className="text-xs text-gray-500">Free delivery on orders above ₹499</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-2">
              <FiShield />
            </div>
            <h4 className="text-sm font-bold text-gray-900">100% Genuine Quality</h4>
            <p className="text-xs text-gray-500">Verified products & safe packaging</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl mb-2">
              <FiPercent />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Best Price Guarantee</h4>
            <p className="text-xs text-gray-500">Direct factory prices & cashback</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-2">
              <FiShoppingBag />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Cash On Delivery</h4>
            <p className="text-xs text-gray-500">Pay conveniently at your doorstep</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;