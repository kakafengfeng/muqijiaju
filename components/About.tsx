import React from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from './UI/Reveal';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const about = content.about;

  return (
    <section id="about" className="bg-stone-50 overflow-hidden">
      {/* 全出血大图（与 Hero 同宽、无顶部留白）+ 文字浮现（左侧对齐） */}
      <Reveal>
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[2/1] overflow-hidden bg-stone-900">
          <img
            src={about.image || 'images/content/about-hero.jpg'}
            alt={about.heading}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 深色渐变：左侧偏深保证文字可读，右侧偏浅画面通透 */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-stone-950/20"></div>

          {/* 文字层：左侧对齐、垂直居中（内容宽度与 Hero 一致） */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full max-w-3xl px-6 md:px-12 text-left">
              <Reveal>
                <span className="text-xs md:text-sm font-bold text-white/80 tracking-widest uppercase mb-4 block">
                  {about.title}
                </span>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight break-words">
                  {isEn ? (about.headingEn || about.heading) : about.heading}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="h-[1px] w-20 bg-white/70 mb-8"></div>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-white/85 leading-relaxed mb-4 font-light">
                  {isEn ? (about.paragraph1En || about.paragraph1) : about.paragraph1}
                </p>
              </Reveal>
              <Reveal delay={0.4}>
                <p className="text-white/85 leading-relaxed mb-8 font-light">
                  {isEn ? (about.paragraph2En || about.paragraph2) : about.paragraph2}
                </p>
              </Reveal>
              <Reveal delay={0.5}>
                <Link
                  to="/story"
                  className="inline-block text-sm border-b border-white/80 pb-1 text-white tracking-widest uppercase hover:text-stone-300 hover:border-stone-300 transition-colors whitespace-nowrap"
                >
                  {isEn ? (about.ctaEn || about.cta) : about.cta}
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
