import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiLogOut, FiBox, FiList, FiPlus, FiChevronDown } from 'react-icons/fi';
import { GiSmokingPipe } from 'react-icons/gi';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const { search, setSearch, showSearch, setShowSearch, getCartCount, token, setToken } = useContext(ShopContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Real data from Context
  const cartCount = getCartCount();
  const wishlistCount = 1; // Keeping wishlist mock for now as it's not requested
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All', path: '/all' },
    { name: 'Flavors', path: '/flavors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 border-b ${isScrolled
        ? 'bg-black/90 backdrop-blur-md border-gold/20 shadow-[0_4px_30px_rgba(212,175,55,0.15)] py-0'
        : 'bg-gradient-to-b from-black/80 to-transparent border-transparent py-2'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 transition-all duration-300">

          {/* Left Side: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: -15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <GiSmokingPipe className="text-4xl text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-cormorant text-2xl font-bold tracking-widest text-white uppercase group-hover:text-gold transition-colors duration-300">
                  Luxe <span className="text-gold group-hover:text-white transition-colors duration-300">Hookah</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-gold/70 transition-colors">Luxury Flavors</span>
              </div>
            </Link>
          </div>

          {/* Center Menu Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-gray-300 hover:text-white text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-300 group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center space-x-6">

            {/* Search */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden absolute right-8"
                  >
                    <input
                      type="text"
                      placeholder="Search flavors..."
                      className="w-full bg-black/60 backdrop-blur-md border border-gold/40 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-gold px-4 py-1.5 text-sm shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (!isSearchOpen && location.pathname !== '/flavors' && location.pathname !== '/all') {
                    navigate('/all');
                  }
                }}
                className="text-gray-300 hover:text-gold transition-colors duration-300 p-2 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              >
                <FiSearch className="text-xl" />
              </button>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative text-gray-300 hover:text-gold transition-colors duration-300 p-2 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)] group">
              <motion.div whileHover={{ scale: 1.1 }}>
                <FiHeart className="text-xl" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gold text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-black group-hover:bg-white group-hover:text-gold transition-colors shadow-[0_0_8px_rgba(212,175,55,0.8)]">
                    {wishlistCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-gray-300 hover:text-gold transition-colors duration-300 p-2 flex items-center gap-2 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              >
                <FiUser className="text-xl" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-56 bg-[#0a0a0a]/95 backdrop-blur-xl border border-gold/30 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden py-2 z-50 ring-1 ring-gold/10"
                  >
                    {!isAuthenticated ? (
                      <>
                        <Link to="/login" className="px-5 py-3 hover:bg-gold/10 hover:text-gold flex items-center gap-3 text-sm text-gray-300 transition-all duration-300">
                          <FiUser /> <span className="tracking-wider">Sign In</span>
                        </Link>
                        <Link to="/register" className="px-5 py-3 hover:bg-gold/10 hover:text-gold flex items-center gap-3 text-sm text-gray-300 transition-all duration-300">
                          <FiList /> <span className="tracking-wider">Create Account</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="px-5 py-3 border-b border-gold/20 mb-1">
                          <p className="text-xs text-gray-400 tracking-wider uppercase">Welcome</p>
                          <p className="text-sm text-white font-medium truncate">VIP Client</p>
                        </div>
                        <Link to="/profile" className="px-5 py-2.5 hover:bg-gold/10 hover:text-gold flex items-center gap-3 text-sm text-gray-300 transition-all duration-300">
                          <FiUser /> <span className="tracking-wider">My Profile</span>
                        </Link>
                        <Link to="/orders" className="px-5 py-2.5 hover:bg-gold/10 hover:text-gold flex items-center gap-3 text-sm text-gray-300 transition-all duration-300">
                          <FiBox /> <span className="tracking-wider">Orders</span>
                        </Link>
                        <div className="h-px bg-gold/20 my-1 w-full relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="px-5 py-2.5 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3 text-sm text-gray-300 transition-all duration-300 w-full text-left"
                        >
                          <FiLogOut /> <span className="tracking-wider">Sign Out</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Header Icon */}
            <Link to="/cart" className="relative flex items-center justify-center w-10 h-10 bg-gold/10 rounded-full border border-gold/30 hover:bg-gold hover:text-black hover:border-gold text-gold transition-all duration-500 group shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]">
              <motion.div whileHover={{ scale: 1.1 }}>
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-gold text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-gold shadow-lg group-hover:bg-black group-hover:text-gold transition-colors">
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-5">
            <Link to="/cart" className="relative text-gold transition-colors p-1">
              <FiShoppingCart className="text-2xl drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gold text-black text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-gold p-1 transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? <FiX className="text-3xl" /> : <FiMenu className="text-3xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="lg:hidden bg-[#050505] overflow-y-auto fixed top-[80px] left-0 w-full z-40 border-t border-gold/20"
          >
            <div className="px-6 py-8 space-y-6 min-h-screen pb-32">

              {/* Mobile Search */}
              <div className="relative flex items-center w-full mb-8">
                <FiSearch className="absolute left-4 text-gold text-lg" />
                <input
                  type="text"
                  placeholder="Search flavors..."
                  className="w-full bg-[#111] border border-gold/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold py-3 pl-12 pr-4 text-sm shadow-inner transition-all"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (location.pathname !== '/flavors' && location.pathname !== '/all') {
                      navigate('/all');
                    }
                  }}
                />
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="block text-gray-300 hover:text-gold text-lg font-medium uppercase tracking-[0.2em] transition-colors py-3 border-b border-gray-800/50"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent w-full my-8" />

              {/* Mobile Bottom Actions */}
              <div className="flex flex-col space-y-1">
                <Link to="/wishlist" className="flex items-center gap-4 text-gray-400 hover:text-gold py-3 px-2 rounded-lg hover:bg-gold/5 transition-all">
                  <FiHeart className="text-xl" />
                  <span className="tracking-wider uppercase text-sm">Wishlist ({wishlistCount})</span>
                </Link>

                {!isAuthenticated ? (
                  <>
                    <Link to="/login" className="flex items-center gap-4 text-gray-400 hover:text-gold py-3 px-2 rounded-lg hover:bg-gold/5 transition-all">
                      <FiUser className="text-xl" />
                      <span className="tracking-wider uppercase text-sm">Sign In</span>
                    </Link>
                    <Link to="/register" className="flex items-center gap-4 text-gray-400 hover:text-gold py-3 px-2 rounded-lg hover:bg-gold/5 transition-all">
                      <FiList className="text-xl" />
                      <span className="tracking-wider uppercase text-sm">Create Account</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="flex items-center gap-4 text-gray-400 hover:text-gold py-3 px-2 rounded-lg hover:bg-gold/5 transition-all">
                      <FiUser className="text-xl" />
                      <span className="tracking-wider uppercase text-sm">My Profile</span>
                    </Link>
                    <Link to="/orders" className="flex items-center gap-4 text-gray-400 hover:text-gold py-3 px-2 rounded-lg hover:bg-gold/5 transition-all">
                      <FiBox className="text-xl" />
                      <span className="tracking-wider uppercase text-sm">Order History</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-4 text-red-500/80 hover:text-red-400 py-3 px-2 rounded-lg hover:bg-red-500/5 transition-all w-full text-left mt-4 border border-red-500/20"
                    >
                      <FiLogOut className="text-xl" />
                      <span className="tracking-wider uppercase text-sm">Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
