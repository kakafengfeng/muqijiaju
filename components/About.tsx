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
    <section id="about" className="py-24 md:py-32 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* 全宽大图 + 文字浮现（右侧对齐） */}
        <Reveal>
          <div className="relative w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[2/1] overflow-hidden bg-stone-900">
            <img
              src={about.image || 'images/content/about-hero.jpg'}
              alt={about.heading}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* 深色渐变：左侧偏深、右侧偏浅，保证文字可读且画面通透 */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-stone-950/20"></div>

            {/* 文字层：右侧对齐、垂直居中 */}
            <div className="absolute inset-0 flex items-center">
              <div className="ml-auto w-full max-w-xl p-8 md:p-12 text-right">
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
                  <div className="h-[1px] w-20 bg-white/70 mb-8 ml-auto"></div>
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
                    to="/team"
                    className="inline-block text-sm border-b border-white/80 pb-1 text-white tracking-widest uppercase hover:text-stone-300 hover:border-stone-300 transition-colors whitespace-nowrap"
                  >
                    {isEn ? (about.ctaEn || about.cta) : about.cta}
                  </Link>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
