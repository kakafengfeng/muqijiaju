import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewsListPage: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const navigate = useNavigate();
  const t = (zh: string, en: string) => (isEn ? en : zh);

  const items = [...content.news].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Nav Strip */}
      <div className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 py-4 px-6 md:px-12 flex items-center justify-between">
        <button
          onClick={() => navigate('/', { state: { scrollTo: 'news' } })}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-900 hover:opacity-60 transition-opacity"
        >
          <ArrowLeft size={16} /> {isEn ? 'Back to Home' : '返回首页'}
        </button>
        <span className="text-xs font-bold text-stone-400 uppercase">
          {isEn ? 'News & Updates' : '新闻动态'}
        </span>
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24 max-w-4xl">
        {/* Page Title */}
        <motion.div
          {...({
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
          } as any)}
          className="mb-16 border-b border-stone-200 pb-10"
        >
          <h1 className="text-3xl md:text-5xl font-light text-stone-900 leading-tight">
            {t('新闻动态', 'News & Updates')}
          </h1>
          <p className="mt-4 text-stone-500 text-sm md:text-base max-w-xl">
            {t(
              '关注木栖家居的最新动态、行业荣誉与可持续发展承诺。',
              'Stories from Muqi Home — launches, achievements, and our commitment to sustainability.'
            )}
          </p>
        </motion.div>

        {/* Article List */}
        <div className="flex flex-col">
          {items.map((item, index) => {
            const hasLink = item.link && item.link !== '#';
            const title = isEn ? (item.titleEn || item.title) : item.title;
            const category = isEn ? (item.categoryEn || item.category) : item.category;
            const summary = isEn ? (item.summaryEn || item.summary || '') : (item.summary || '');

            const row = (
              <article className="group flex flex-col md:flex-row gap-6 md:gap-10 py-10 border-b border-stone-200 last:border-b-0 cursor-pointer">
                {/* Cover */}
                {item.image ? (
                  <div className="md:w-[280px] md:shrink-0 aspect-[16/10] overflow-hidden bg-stone-200">
                    <img
                      src={item.image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="md:w-[280px] md:shrink-0 aspect-[16/10] bg-stone-100 border border-stone-200 flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-stone-400">
                      Muqi Home
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-stone-400 mb-3">
                    <span className="text-amber-700 font-bold group-hover:text-stone-900 transition-colors">
                      {category}
                    </span>
                    <span className="font-serif italic">{item.date}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-light text-stone-900 leading-snug group-hover:translate-x-2 transition-transform duration-300 break-words">
                    {title}
                  </h2>
                  {summary && (
                    <p className="mt-3 text-sm text-stone-500 leading-relaxed line-clamp-2">
                      {summary}
                    </p>
                  )}
                  <div className="mt-5 flex items-center gap-2 text-xs text-stone-400 uppercase tracking-widest group-hover:text-stone-900 group-hover:gap-3 transition-all duration-300">
                    {t('Read More', 'Read More')} <ArrowUpRight size={12} />
                  </div>
                </div>
              </article>
            );

            return (
              <motion.div
                key={item.id}
                {...({
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-40px' },
                  transition: { duration: 0.5, delay: (index % 3) * 0.06 },
                } as any)}
              >
                {hasLink ? (
                  <a href={item.link} target="_blank" rel="noreferrer" className="block">
                    {row}
                  </a>
                ) : (
                  <Link to={`/news/${item.id}`} className="block">
                    {row}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
