import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CONTENT } from '../constants';
import { Reveal } from './UI/Reveal';

export const ProductCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CONTENT.products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CONTENT.products.length) % CONTENT.products.length);
  };

  useEffect(() => {
    if (!isPaused) {
      timeoutRef.current = setTimeout(nextSlide, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused]);

  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 mb-16 flex justify-between items-end">
        <Reveal>
           <div>
              <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-2 block">Collections</span>
              <h2 className="text-3xl md:text-4xl font-light text-stone-900">精工产品</h2>
           </div>
        </Reveal>
        <div className="hidden md:flex gap-4">
          <button onClick={prevSlide} className="p-3 border border-stone-200 hover:bg-stone-900 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <button onClick={nextSlide} className="p-3 border border-stone-200 hover:bg-stone-900 hover:text-white transition-colors">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        className="w-full relative overflow-hidden pl-6 md:pl-[calc((100vw-1200px)/2+48px)] lg:pl-[calc((100vw-1280px)/2+48px)]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="flex gap-8 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `translateX(-${currentIndex * 340}px)` }} 
        >
          {CONTENT.products.map((product, index) => (
             <div 
                key={product.id} 
                className={`flex-shrink-0 w-[85vw] md:w-[400px] group cursor-pointer transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
             >
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
                   <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute top-4 left-4 text-xs font-bold text-white/80 z-20 bg-black/20 px-2 py-1 backdrop-blur-sm">
                      {product.id}
                   </div>
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center backdrop-blur-[1px]">
                      <div className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                         <span className="text-stone-200 text-sm font-serif italic mb-3">{product.category}</span>
                         <span className="text-white text-xs tracking-widest uppercase border-b border-white/70 pb-1">View Details</span>
                      </div>
                   </div>
                </div>
                
                <h3 className="text-xl font-medium text-stone-900 mb-2">{product.name}</h3>
                <p className="text-stone-600 text-sm font-light leading-relaxed line-clamp-2">{product.description}</p>
             </div>
          ))}
        </div>
        
        {/* Mobile Controls */}
        <div className="md:hidden flex justify-center gap-6 mt-12">
            <button onClick={prevSlide}><ArrowLeft size={24} /></button>
            <div className="text-sm tracking-widest">{currentIndex + 1} / {CONTENT.products.length}</div>
            <button onClick={nextSlide}><ArrowRight size={24} /></button>
        </div>
      </div>
    </section>
  );
};