import React from 'react';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUpRight, FiCheck, FiSearch, FiX } from 'react-icons/fi';

const brands = [
  { name: 'Afzal', label: 'The timeless classic', img: 'https://images.unsplash.com/photo-1510693539077-4c7fa43fcf83?q=80&w=500' },
  { name: 'Maya', label: 'Bright and botanical', img: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=500' },
  { name: 'Al Fakher', label: 'A modern icon', img: 'https://images.unsplash.com/photo-1550966841-3ee922bc968c?q=80&w=500' },
  { name: 'Starbuzz', label: 'Bold after dark', img: 'https://images.unsplash.com/photo-1620078864936-7c0b624f15d7?q=80&w=500' }
];

const FlavorSidebar = ({ isOpen, onClose, onSelectBrand, activeBrand }) => {
  const [query, setQuery] = useState('');
  const filteredBrands = useMemo(
    () => brands.filter((brand) => brand.name.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const selectBrand = (brand) => {
    onSelectBrand(brand);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[390px] bg-[#090909] border-l border-white/10 shadow-[-20px_0_80px_rgba(0,0,0,0.6)] z-[101] flex flex-col"
          >
            <div className="relative overflow-hidden border-b border-white/10 px-6 pb-6 pt-7 sm:px-8">
              <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-gold/80">The flavor edit</p>
                  <h2 className="font-cormorant text-4xl font-semibold leading-none text-white">Find your <span className="italic text-gold">note.</span></h2>
                  <p className="mt-3 max-w-[230px] text-xs leading-5 text-white/45">Curated blends for slow evenings and bright beginnings.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close flavor brands"
                  className="rounded-full border border-white/10 p-2.5 text-white/60 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  <FiX size={19} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">Curated houses</p>
                  <p className="mt-1 text-sm text-white/80">{brands.length} signature collections</p>
                </div>
                {activeBrand && (
                  <button type="button" onClick={() => selectBrand('')} className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-white">
                    Clear selection
                  </button>
                )}
              </div>

              <div className="relative mb-5">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" size={16} />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search a brand..."
                  aria-label="Search flavor brands"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-gold/60"
                />
              </div>

              <div className="space-y-3">
              {filteredBrands.map((brand, index) => (
                <motion.button
                  type="button"
                  key={brand.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ scale: 1.02, x: -5 }}
                  onClick={() => selectBrand(brand.name)}
                  className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                    activeBrand === brand.name 
                      ? 'border-gold bg-gold text-black shadow-[0_10px_30px_rgba(212,175,55,0.15)]' 
                      : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-gold/50 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <img src={brand.img} className="w-full h-full object-cover" alt={brand.name} />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <span className="block truncate text-sm font-bold uppercase tracking-[0.16em]">{brand.name}</span>
                    <p className={`mt-1 truncate text-[10px] ${activeBrand === brand.name ? 'text-black/70' : 'text-white/40'}`}>{brand.label}</p>
                  </div>
                  {activeBrand === brand.name && (
                    <FiCheck size={18} className="flex-shrink-0 text-black" />
                  )}
                  <FiArrowUpRight className={`flex-shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${activeBrand === brand.name ? 'text-black/60' : 'text-white/25'}`} />
                </motion.button>
              ))}
              </div>
              {filteredBrands.length === 0 && <p className="py-10 text-center text-xs uppercase tracking-widest text-white/35">No brand found</p>}
            </div>

            <div className="border-t border-white/10 px-6 py-5 sm:px-8">
              <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/30">Made for your next session</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FlavorSidebar;
