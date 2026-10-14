import React from 'react';
import { useContent } from '../context/ContentContext';
import { Reveal } from './UI/Reveal';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { content } = useContent();

  return (
    <section id="about" className="relative overflow-hidden bg-stone-950">
      {/* 背景大图 */}
      <div className="absolute inset-0">
        <img
          src={content.about.image}
          alt="About Muqi"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {/* 深色渐变遮罩：保证图上文字可读（参考 LAMI 服务卡片风格） */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/40"></div>
      </div>

      {/* 图上内容 */}
      <div className="relative container mx-auto px-6 md:px-12 py-28 md:py-44">
        <div className="max-w-2xl">
          <Reveal>
            <span className="text-sm font-bold text-amber-200/90 tracking-[0.25em] uppercase mb-6 block">
              {content.about.title}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight">
              {content.about.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="h-px w-24 bg-white/50 mb-8"></div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-white/85 leading-relaxed mb-6 font-light text-base md:text-lg">
              {content.about.paragraph1}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-white/70 leading-relaxed mb-12 font-light">
              {content.about.paragraph2}
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <Link
              to="/team"
              className="inline-flex items-center gap-3 px-8 py-3 border border-white/70 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-stone-900 transition-colors duration-300"
            >
              {content.about.cta}
              <span className="text-xl leading-none">+</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
