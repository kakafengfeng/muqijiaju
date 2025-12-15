import React, { useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { Reveal } from './UI/Reveal';
import { motion, useScroll, useTransform } from 'framer-motion';

export const About: React.FC = () => {
  const { content } = useContent();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="about" className="py-24 md:py-32 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Image Side */}
          <div className="relative order-2 md:order-1">
             <Reveal direction="right">
                <div ref={containerRef} className="aspect-[4/5] bg-stone-200 overflow-hidden relative">
                  <motion.img 
                    style={{ y, scale: 1.15 }}
                    src={content.about.image} 
                    alt="About Muqi" 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
             </Reveal>
             {/* Decorative Element */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-stone-100 -z-10 hidden md:block"></div>
          </div>

          {/* Text Side */}
          <div className="order-1 md:order-2">
            <Reveal>
              <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">
                {content.about.title}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-stone-900 mb-8 leading-tight">
                {content.about.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="h-[1px] w-20 bg-stone-900 mb-8"></div>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-stone-600 leading-relaxed mb-6 font-light">
                {content.about.paragraph1}
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="text-stone-600 leading-relaxed mb-10 font-light">
                {content.about.paragraph2}
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <a href="#" className="inline-block text-sm border-b border-stone-900 pb-1 text-stone-900 tracking-widest uppercase hover:text-stone-500 hover:border-stone-500 transition-colors">
                {content.about.cta}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};