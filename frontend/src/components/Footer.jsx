import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiCornerDownRight } from 'react-icons/fi';
import { GiSmokingPipe } from 'react-icons/gi';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 filter blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <GiSmokingPipe className="text-4xl text-gold group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-cormorant text-2xl font-bold tracking-widest text-white uppercase italic">LUXE <span className="text-gold">OS</span></span>
                <span className="text-[8px] uppercase tracking-[0.4em] text-gray-500">Neural Sensory Core</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
              Pioneering the future of sensory stimulation since 2030. Molecular vapor technology for the elite connoisseur.
            </p>
            <div className="flex space-x-5">
              {[<FiInstagram />, <FiTwitter />, <FiFacebook />, <FiYoutube />].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-black transition-all duration-300">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-10">Sensory Vault</h4>
            <ul className="space-y-4">
              {['All Flavors', 'Molecular Mint', 'Exotic Blends', 'Limited Editions'].map((link) => (
                <li key={link}>
                  <Link to="/flavors" className="text-gray-500 hover:text-white transition-all text-xs uppercase tracking-widest flex items-center gap-2 group">
                    <FiCornerDownRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-10">Assistance</h4>
            <ul className="space-y-4">
              {['Vision', 'Security', 'Contact', 'Wholesale'].map((link) => (
                <li key={link}>
                  <Link to="/contact" className="text-gray-500 hover:text-white transition-all text-xs uppercase tracking-widest flex items-center gap-2 group">
                    <FiCornerDownRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-gold" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-[0.3em] mb-10">Subscription</h4>
            <p className="text-gray-500 text-xs tracking-wide mb-6">Receive encrypted sensory updates.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="NEURAL_AUTH_MAIL" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white placeholder-gray-700 focus:outline-none focus:border-gold transition-colors" 
              />
              <button className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-gold text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-colors">
                Link
              </button>
            </form>
          </div>

        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em] mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LUXE_OS. ALL_RIGHTS_RESERVED.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-gray-600 hover:text-gold text-[9px] uppercase tracking-widest transition-colors">Privacy_Protocol</a>
            <a href="#" className="text-gray-600 hover:text-gold text-[9px] uppercase tracking-widest transition-colors">Terms_of_Sync</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
