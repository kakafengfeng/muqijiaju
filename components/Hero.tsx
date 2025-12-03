import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CONTENT } from '../constants';

export const Hero: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-stone-900">
      {/* Parallax Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
         <div className="absolute inset-0 bg-black/40 z-10" />
         <img 
            src={CONTENT.hero.backgroundImage} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
         />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 h-full container mx-auto px-6 md:px-12 flex flex-col justify-center text-white">
        <div className="max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl font-serif italic tracking-wider mb-4 text-stone-200"
          >
            {CONTENT.hero.subtitle}
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide leading-tight mb-8"
          >
            {CONTENT.hero.title}
          </motion.h1>

          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6, duration: 1 }}
             className="text-stone-300 text-sm md:text-base max-w-xl leading-relaxed mb-12 border-l-2 border-stone-500 pl-6"
          >
            {CONTENT.hero.description}
          </motion.p>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8, duration: 0.6 }}
             className="flex flex-col sm:flex-row gap-6"
          >
            <button className="group relative px-8 py-4 bg-white text-stone-900 text-sm tracking-widest uppercase transition-transform hover:-translate-y-1">
              <span className="relative z-10 flex items-center gap-2 font-medium">
                {CONTENT.hero.ctaPrimary} <ArrowRight size={16} />
              </span>
            </button>
            <button className="px-8 py-4 border border-white/30 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-stone-900 transition-all hover:-translate-y-1">
              {CONTENT.hero.ctaSecondary}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 text-white/50"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
};