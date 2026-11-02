import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from '../components/UI/Reveal';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// 员工活动照片墙：在此数组添加 { src, caption } 即可上线展示。
// 照片放到 public/images/story/ 下，src 写 'images/story/xxx.jpg'。
// 数组为空时，该区块自动隐藏。
const ACTIVITY_GALLERY: { src: string; caption: string; captionEn?: string }[] = [
  // 示例：{ src: 'images/story/team-building-2024.jpg', caption: '2024 团建', captionEn: 'Team Building 2024' },
];

export const StoryPage: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const t = (zh: string, en: string) => (isEn ? en : zh);
  const about = content.about;
  const company = content.company;

  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />

      {/* Hero */}
      <div className="relative w-full h-[60vh] min-h-[420px] overflow-hidden bg-stone-900">
        <img
          src={about.image || 'images/content/about-hero.jpg'}
          alt={t('我们的故事', 'Our Story')}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              {...({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } } as any)}
              className="max-w-3xl"
            >
              <span className="text-xs md:text-sm font-bold text-white/70 tracking-widest uppercase mb-4 block">
                Our Story
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                {t('我们的故事', 'Our Story')}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 公司介绍 */}
      <div className="container mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">
              {t('关于我们', 'About Us')}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-8 leading-tight">
              {isEn ? (about.headingEn || about.heading) : about.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-stone-600 leading-loose mb-6 font-light text-lg">
              {isEn ? (about.paragraph1En || about.paragraph1) : about.paragraph1}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-stone-600 leading-loose mb-12 font-light text-lg">
              {isEn ? (about.paragraph2En || about.paragraph2) : about.paragraph2}
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="border-l-2 border-stone-900 pl-6 py-2">
              <p className="text-stone-900 font-medium text-xl mb-1">{company.name}</p>
              <p className="text-stone-400 text-sm">{company.nameEn}</p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* 员工活动照片墙（有照片时才显示） */}
      {ACTIVITY_GALLERY.length > 0 && (
        <div className="bg-white border-y border-stone-100">
          <div className="container mx-auto px-6 md:px-12 py-20 md:py-24">
            <Reveal>
              <div className="text-center mb-12">
                <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">
                  Moments
                </span>
                <h2 className="text-3xl md:text-4xl font-light text-stone-900">
                  {t('员工风采', 'Team Moments')}
                </h2>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {ACTIVITY_GALLERY.map((photo, idx) => (
                <Reveal key={idx} delay={(idx % 4) * 0.08}>
                  <div className="group relative overflow-hidden bg-stone-100 aspect-[4/3]">
                    <img
                      src={photo.src}
                      alt={isEn ? (photo.captionEn || photo.caption) : photo.caption}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {photo.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 to-transparent pt-8 pb-3 px-4">
                        <p className="text-white text-sm font-light">
                          {isEn ? (photo.captionEn || photo.caption) : photo.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="container mx-auto px-6 md:px-12 py-20 text-center">
        <Reveal>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white text-sm tracking-widest uppercase hover:bg-stone-700 transition-colors"
          >
            {t('联系我们', 'Contact Us')} <ArrowRight size={16} />
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-400 hover:text-stone-900 transition-colors"
            >
              <ArrowLeft size={14} /> {t('返回首页', 'Back to Home')}
            </Link>
          </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  );
};
