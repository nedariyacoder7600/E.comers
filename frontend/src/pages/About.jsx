import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { FiWind, FiZap, FiDribbble, FiAward, FiCpu, FiHardDrive, FiShield, FiTarget } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  const pillars = [
    {
      icon: <FiCpu className="text-3xl" />,
      title: "Bio-Tech Lab",
      description: "Mapping flavor sequences with 2050 atomic precision for a cross-dimensional density.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <FiZap className="text-3xl" />,
      title: "Plasma Ignition",
      description: "Quantum-plasma coils ensuring 100% efficient molecular vaporization with zero latency.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FiHardDrive className="text-3xl" />,
      title: "Neural Sync",
      description: "Cloud-sync your sensory sessions across the global mesh for a consistent atmosphere.",
      color: "from-gold to-orange-500"
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Cyber Shield",
      description: "Nano-membrane filtration trapping 99.9% of impurities for absolute sensory purity.",
      color: "from-green-500 to-cyan-500"
    }
  ];

  return (
    <div ref={containerRef} className="bg-[#000] text-white selection:bg-white selection:text-black font-sans overflow-hidden">
      
      {/* 🔮 Background Abstract Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0a0a0a_0%,#000_100%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* 🚀 Intro Section */}
      <section className="relative h-screen flex flex-col items-center justify-center z-10 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <span className="text-gold uppercase tracking-[1em] text-[10px] font-bold mb-10 block">System 2050 // Singularity</span>
          
          <h1 className="text-[12vw] font-bold tracking-tighter leading-none mb-10 relative group">
            {/* Scramble Effect Container */}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="block relative"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-500 to-white relative z-10">
                {/* Custom Decoding Animation */}
                {Array.from("BEYOND").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="inline-block relative"
                  >
                    <motion.span
                      animate={{ 
                        opacity: [1, 0, 1],
                        content: ["X", "!", "#", char]
                      }}
                      transition={{ 
                        duration: 0.8, 
                        delay: i * 0.1,
                        times: [0, 0.2, 0.4, 1],
                        repeat: 0
                      }}
                      className="after:content-[attr(data-char)]"
                      data-char={char}
                    >
                      {char}
                    </motion.span>
                  </motion.span>
                ))}
              </span>
              
              {/* Glitch Overlay 1 */}
              <motion.span 
                animate={{ 
                  x: [-2, 2, -2],
                  opacity: [0, 0.5, 0]
                }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute inset-0 text-red-500/30 -z-10 translate-x-1"
              >BEYOND</motion.span>
            </motion.span>

            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="italic text-white brightness-150 block mt-4"
            >
              EXISTENCE.
            </motion.span>
          </h1>

          <p className="text-zinc-500 text-xl font-light tracking-widest max-w-2xl mx-auto italic">
            "We don't sell smoke. We curate the atmosphere of the future."
          </p>
        </motion.div>
      </section>

      {/* 🎨 COLOR CARDS SECTION: Restoring the requested aesthetic */}
      <section className="py-40 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-28">
             <motion.h2 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-5xl md:text-7xl font-bold tracking-tighter"
             >
                THE <span className="text-gold italic">CORE</span> NODES
             </motion.h2>
             <div className="h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="animated-card-wrapper group cursor-pointer"
              >
                <div className="animated-card-inner !bg-black/80 backdrop-blur-xl p-10 h-full flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500`}>
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-6 tracking-widest uppercase">{pillar.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-white transition-colors duration-500 font-light">
                    {pillar.description}
                  </p>
                  
                  {/* Glowing Bottom Indicator */}
                  <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r ${pillar.color} group-hover:w-full transition-all duration-700`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 Tech Showcase */}
      <section className="py-60 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden group border border-white/10"
            >
                <img 
                  src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200"
                  alt="Tech"
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black to-transparent">
                    <span className="text-gold font-mono text-xs animate-pulse">PROTOCOL STATUS: OPTIMAL</span>
                </div>
            </motion.div>
            
            <div className="space-y-10">
               <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">NO <br />LIMITS.</h2>
               <p className="text-zinc-500 text-xl font-light leading-relaxed mb-10">
                 The 2050 series represents the end of compromise. Every molecule is accounted for; every breath is a masterpiece of digital extraction.
               </p>
               <button 
                  onClick={() => navigate('/all')}
                  className="px-12 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gold transition-all"
               >
                  Sync With The Shop
               </button>
            </div>
        </div>
      </section>

      {/* 🔮 Final Call */}
      <section className="h-screen flex flex-col items-center justify-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-[15vw] font-black tracking-tighter text-white mix-blend-difference mb-12"
          >
            2050.
          </motion.h2>
          <button 
            onClick={() => navigate('/all')}
            className="px-20 py-8 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:invert transition-all hover:scale-110 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
          >
            Enter The Collective
          </button>
      </section>

      {/* 🚀 Footer */}
      <footer className="py-20 bg-black border-t border-white/5 z-10 relative">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-zinc-600 font-mono text-[10px] gap-10">
              <div className="flex gap-10">
                  <p>EST. 2024</p>
                  <p>RE-CODED 2050</p>
              </div>
              <p className="tracking-[1em]">LUXE HOOKAH SINGULARITY — SYSTEM ACTIVE</p>
              <p>© ALL TRANSCENDED.</p>
          </div>
      </footer>
    </div>
  );
};

export default About;
