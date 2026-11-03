import React from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from './UI/Reveal';
import { Link } from 'react-router-dom';

export const ProductCarousel: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const t = (zh: string, en: string) => (isEn ? en : zh);

  return (
    <section id="products" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12 mb-16">
        <Reveal>
          <div>
            <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-2 block">Collections</span>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900">{t('精工产品', 'Precision Craftsmanship')}</h2>
          </div>
        </Reveal>
      </div>

      {/* 产品卡片：居中一排显示（flex-wrap，产品增减时依然居中） */}
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-wrap justify-center gap-8">
          {content.products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-[400px] group cursor-pointer"
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
                    <span className="text-white text-xs tracking-widest uppercase border-b border-white/70 pb-1">{t('查看详情', 'View Details')}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-medium text-stone-900 mb-2 break-words">{isEn ? (product.nameEn || product.name) : product.name}</h3>
              <p className="text-stone-600 text-sm font-light leading-relaxed line-clamp-2 break-words">{isEn ? (product.descriptionEn || product.description) : product.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
