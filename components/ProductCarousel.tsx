import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from './UI/Reveal';
import { Link } from 'react-router-dom';

const GAP = 32; // 与 className="gap-8" 一致（Tailwind gap-8 = 2rem）

export const ProductCarousel: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const t = (zh: string, en: string) => (isEn ? en : zh);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [step, setStep] = useState(0); // 单张卡片 + gap 的实际步长（px）
  const trackRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = content.products.length;

  // 依据真实卡片宽度计算步长，避免硬编码 340px 与响应式宽度错位
  const measureStep = useCallback(() => {
    const card = trackRef.current?.querySelector('a');
    if (card) {
      setStep(card.getBoundingClientRect().width + GAP);
    }
  }, []);

  useEffect(() => {
    measureStep();
    window.addEventListener('resize', measureStep);
    return () => window.removeEventListener('resize', measureStep);
  }, [measureStep, content.products.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(total, 1));
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(total, 1)) % Math.max(total, 1));
  }, [total]);

  useEffect(() => {
    if (!isPaused && total > 1) {
      timeoutRef.current = setTimeout(nextSlide, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, isPaused, nextSlide, total]);

  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 mb-16 flex justify-between items-end">
        <Reveal>
          <div>
            <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-2 block">Collections</span>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900">{t('精工产品', 'Precision Craftsmanship')}</h2>
          </div>
        </Reveal>
        <div className="hidden md:flex gap-4">
          <button
            onClick={prevSlide}
            aria-label={t('上一个产品', 'Previous product')}
            className="p-3 border border-stone-200 hover:bg-stone-900 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            aria-label={t('下一个产品', 'Next product')}
            className="p-3 border border-stone-200 hover:bg-stone-900 hover:text-white transition-colors"
          >
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
          ref={trackRef}
          className="flex gap-8 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ transform: `translateX(-${currentIndex * step}px)` }}
        >
          {content.products.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className={`flex-shrink-0 w-[85vw] md:w-[400px] group cursor-pointer transition-opacity duration-500 ${index === currentIndex ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 text-xs font-bold text-white/80 z-20 bg-black/20 px-2 py-1 backdrop-blur-sm">
                  {product.id}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center items-center backdrop-blur-[1px]">
                  <div className="flex flex-col items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <span className="text-stone-200 text-sm font-serif italic mb-3">{isEn ? (product.categoryEn || product.category) : product.category}</span>
                    <span className="text-white text-xs tracking-widest uppercase border-b border-white/70 pb-1">{t('View Details', 'View Details')}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-medium text-stone-900 mb-2 break-words">{isEn ? (product.nameEn || product.name) : product.name}</h3>
              <p className="text-stone-600 text-sm font-light leading-relaxed line-clamp-2 break-words">{isEn ? (product.descriptionEn || product.description) : product.description}</p>
            </Link>
          ))}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex justify-center gap-6 mt-12">
          <button onClick={prevSlide} aria-label={t('上一个产品', 'Previous product')}><ArrowLeft size={24} /></button>
          <div className="text-sm tracking-widest">{currentIndex + 1} / {total}</div>
          <button onClick={nextSlide} aria-label={t('下一个产品', 'Next product')}><ArrowRight size={24} /></button>
        </div>
      </div>
    </section>
  );
};
