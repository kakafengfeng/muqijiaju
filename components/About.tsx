import React from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from './UI/Reveal';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLanguage();

  // 四图卡片：后台“关于 About”模块可逐张替换图片与标题；无数据时用默认
  const cards = (content.about.cards && content.about.cards.length >= 4
    ? content.about.cards
    : [
        { titleEn: 'Whole-house Customization', titleZh: '全屋定制', image: content.about.image, more: t('了解更多', 'Learn More') },
        { titleEn: 'Smart Home', titleZh: '智能家居', image: content.about.image, more: t('了解更多', 'Learn More') },
        { titleEn: 'Furniture', titleZh: '成品家具', image: content.about.image, more: t('了解更多', 'Learn More') },
        { titleEn: 'Partial Renovation', titleZh: '家装局改', image: content.about.image, more: t('了解更多', 'Learn More') },
      ]).slice(0, 4);

  return (
    <section id="about" className="py-24 md:py-32 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* 标题区 */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <Reveal>
            <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">
              {content.about.title}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-stone-900 mb-6 leading-tight">
              {content.about.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="h-[1px] w-20 bg-stone-900 mb-8"></div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-stone-600 leading-relaxed mb-4 font-light">
              {content.about.paragraph1}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="text-stone-600 leading-relaxed mb-8 font-light">
              {content.about.paragraph2}
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <Link
              to="/team"
              className="inline-block text-sm border-b border-stone-900 pb-1 text-stone-900 tracking-widest uppercase hover:text-stone-500 hover:border-stone-500 transition-colors"
            >
              {content.about.cta}
            </Link>
          </Reveal>
        </div>

        {/* 四图卡片（模仿 LAMI 服务页：大图 + 双语标题 + More） */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {cards.map((card, idx) => (
            <Reveal key={card.id || idx} delay={idx * 0.1}>
              <div className="group relative aspect-[4/3] overflow-hidden bg-stone-900">
                <img
                  src={card.image}
                  alt={card.titleZh}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* 底部深色渐变，保证文字可读 */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent"></div>
                {/* 图上内容 */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-xs md:text-sm font-bold text-white/70 tracking-[0.2em] uppercase mb-2">
                    {card.titleEn}
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="text-2xl md:text-3xl font-light text-white leading-tight">
                      {lang === 'en' && card.titleEn !== card.titleZh ? card.titleEn : card.titleZh}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-white/85 border-b border-white/40 pb-0.5 whitespace-nowrap">
                      {card.more}
                      <span className="text-base leading-none">+</span>
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
