import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams();
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const navigate = useNavigate();

  const item = content.news.find((n: any) => n.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-light mb-4">{isEn ? 'Article Not Found' : '文章不存在'}</h2>
          <Link to="/" className="text-sm border-b border-stone-900 pb-1">
            {isEn ? 'Return Home' : '返回首页'}
          </Link>
        </div>
      </div>
    );
  }

  const title = isEn ? (item.titleEn || item.title) : item.title;
  const category = isEn ? (item.categoryEn || item.category) : item.category;
  const summary = isEn ? (item.summaryEn || item.summary || '') : (item.summary || '');
  const body = isEn ? (item.contentEn || item.content || '') : (item.content || '');
  const paragraphs = body.split(/\n{2,}/).filter((p: string) => p.trim().length > 0);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Nav Strip */}
      <div className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 py-4 px-6 md:px-12 flex items-center justify-between">
        <button
          onClick={() => navigate('/', { state: { scrollTo: 'news' } })}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-900 hover:opacity-60 transition-opacity"
        >
          <ArrowLeft size={16} /> {isEn ? 'Back to News' : '返回新闻动态'}
        </button>
        <span className="text-xs font-bold text-stone-400 uppercase">{category}</span>
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-24 max-w-3xl">
        <motion.article
          {...({
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
          } as any)}
        >
          {/* Meta */}
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-stone-400 mb-6">
            <span className="text-amber-700 font-bold">{category}</span>
            <span className="font-serif italic">{item.date}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-light text-stone-900 leading-tight mb-8 break-words">
            {title}
          </h1>

          {/* Summary */}
          {summary && (
            <p className="text-lg text-stone-500 font-serif italic leading-relaxed border-l-2 border-stone-300 pl-5 mb-10">
              {summary}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-stone-200 mb-10"></div>

          {/* Body */}
          {paragraphs.length > 0 ? (
            <div className="space-y-6">
              {paragraphs.map((p: string, idx: number) => (
                <p key={idx} className="text-stone-700 leading-8 text-[15px] md:text-base">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-stone-400 text-sm">
              {isEn ? 'Full content coming soon.' : '正文内容待补充。'}
            </p>
          )}

          {/* Back */}
          <div className="mt-16 pt-8 border-t border-stone-200 flex justify-between items-center">
            <button
              onClick={() => navigate('/', { state: { scrollTo: 'news' } })}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 hover:opacity-60 transition-opacity"
            >
              <ArrowLeft size={14} /> {isEn ? 'All News' : '全部新闻'}
            </button>
            <span className="text-[10px] uppercase tracking-widest text-stone-400">
              {isEn ? 'Muqi Home' : '木栖家居'}
            </span>
          </div>
        </motion.article>
      </div>
    </div>
  );
};
