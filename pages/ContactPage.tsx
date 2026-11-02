import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Smartphone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from '../components/UI/Reveal';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

// 社交二维码（与页脚共用 public/images/ 下的图片）
const WECHAT_QR = `${import.meta.env.BASE_URL}images/wechat-qr.png`;
const QQ_QR = `${import.meta.env.BASE_URL}images/qq-qr.png`;
const WECHAT_ID = 'zhangyanhui95';
const QQ_NUMBER = '980763379';

export const ContactPage: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLanguage();
  const isEn = lang === 'en';
  const company = content.company;

  const infoCards = [
    {
      icon: MapPin,
      label: t('地址', 'Address'),
      value: isEn ? (company.addressEn || company.address) : company.address,
      href: undefined as string | undefined,
    },
    {
      icon: Phone,
      label: t('电话', 'Tel'),
      value: company.phone || '',
      href: company.phone ? `tel:${company.phone.replace(/\s/g, '')}` : undefined,
    },
    {
      icon: Smartphone,
      label: t('手机', 'Mobile'),
      value: company.phoneMobile || '',
      href: company.phoneMobile ? `tel:${company.phoneMobile}` : undefined,
    },
    {
      icon: Mail,
      label: t('邮箱', 'Email'),
      value: company.email || '',
      href: company.email ? `mailto:${company.email}` : undefined,
    },
  ].filter((c) => c.value);

  return (
    <div className="bg-stone-50 min-h-screen">
      <Header />

      <div className="container mx-auto px-6 md:px-12 pt-32 md:pt-40 pb-20">
        <motion.div
          {...({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } } as any)}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">
            {t('联系我们', 'Contact Us')}
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
            {isEn
              ? 'We look forward to hearing from you.'
              : '期待与您取得联系。'}
          </p>
        </motion.div>

        {/* 联系信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
          {infoCards.map((card, idx) => {
            const Icon = card.icon;
            const body = (
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                    {card.label}
                  </p>
                  <p className="text-stone-900 text-lg font-light leading-relaxed break-words">
                    {card.value}
                  </p>
                </div>
              </div>
            );
            return (
              <Reveal key={card.label} delay={idx * 0.08}>
                <div className="bg-white border border-stone-100 p-8 h-full">
                  {card.href ? (
                    <a href={card.href} className="hover:opacity-70 transition-opacity">
                      {body}
                    </a>
                  ) : (
                    body
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* 社交二维码 */}
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-light text-stone-900">
                {t('扫码添加', 'Scan to Connect')}
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
            <Reveal delay={0.05}>
              <div className="bg-white border border-stone-100 p-6 text-center">
                <img
                  src={WECHAT_QR}
                  alt="WeChat QR"
                  className="w-40 h-48 mx-auto object-contain mb-4"
                />
                <p className="text-sm font-medium text-stone-900 mb-1">{t('微信', 'WeChat')}</p>
                <p className="text-xs text-stone-400 break-words">
                  {t('微信号', 'WeChat ID')}: {WECHAT_ID}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-white border border-stone-100 p-6 text-center">
                <img
                  src={QQ_QR}
                  alt="QQ QR"
                  className="w-40 h-48 mx-auto object-contain mb-4"
                />
                <p className="text-sm font-medium text-stone-900 mb-1">QQ</p>
                <p className="text-xs text-stone-400 break-words">
                  QQ: {QQ_NUMBER}
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-16 text-center">
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
