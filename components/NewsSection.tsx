import React from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from './UI/Reveal';
import { ArrowUpRight } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const t = (zh: string, en: string) => (isEn ? en : zh);

  return (
    <section id="news" className="py-24 bg-stone-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 border-b border-stone-200 pb-8">
           <Reveal>
             <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4 md:mb-0">{t('新闻动态', 'News & Updates')}</h2>
           </Reveal>
           <Reveal delay={0.1}>
             <span className="flex items-center gap-2 text-sm text-stone-500 uppercase tracking-widest">
               Read All News <ArrowUpRight size={16} />
             </span>
           </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
           {content.news.map((item, index) => {
             const hasLink = item.link && item.link !== '#';
             const card = (
               <>
                 <div className="border-t border-stone-200 pt-6 transition-colors group-hover:border-stone-900">
                    <div className="flex justify-between items-center mb-4">
                       <span className="text-xs font-bold text-stone-400 uppercase tracking-widest group-hover:text-amber-700 transition-colors">
                         {isEn ? (item.categoryEn || item.category) : item.category}
                       </span>
                       <span className="text-xs text-stone-400 font-serif italic">
                         {item.date}
                       </span>
                    </div>
                    <h3 className="text-xl font-light text-stone-900 leading-snug group-hover:translate-x-2 transition-transform duration-300 break-words">
                      {isEn ? (item.titleEn || item.title) : item.title}
                    </h3>
                    <div className="mt-6 flex items-center gap-2 text-xs text-stone-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
                      {t('Read More', 'Read More')} <ArrowUpRight size={12} />
                    </div>
                 </div>
               </>
             );
             return (
               <Reveal key={item.id} delay={index * 0.1}>
                 {hasLink ? (
                   <a href={item.link} target="_blank" rel="noreferrer" className="group block">
                     {card}
                   </a>
                 ) : (
                   <div className="group block">{card}</div>
                 )}
               </Reveal>
             );
           })}
        </div>
      </div>
    </section>
  );
};
