
import React from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Instagram, Linkedin } from 'lucide-react';
import { scrollToSection } from '../lib/nav';

const WechatIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8 17.5a5 5 0 0 1-5-5c0-2.5 2.5-4.5 5.5-4.5s5.5 2 5.5 4.5c0 .8-.2 1.5-.6 2.1l.6 2.4-2.4-.6c-.9.4-1.9.6-3 .6z" />
    <path d="M17 11c3 0 5.5 1.8 5.5 4s-2.5 4-5.5 4c-.9 0-1.8-.2-2.6-.5l-2 .5.5-2c-.3-.6-.4-1.2-.4-1.9 0-2.3 2.5-4.1 5.5-4.1z" />
    <circle cx="6.5" cy="11.5" r=".5" fill="currentColor" />
    <circle cx="9.5" cy="11.5" r=".5" fill="currentColor" />
    <circle cx="15.5" cy="14.5" r=".5" fill="currentColor" />
    <circle cx="18.5" cy="14.5" r=".5" fill="currentColor" />
  </svg>
);


const QqIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3.5c2.4 0 4 1.7 4 3.9v2.3c1.7.8 2.8 2.2 3 4l.1.8-1.6-.3.3 1.9c.2 1.2-.5 2.3-1.7 2.9-1.3.6-2.8.9-4.1.9s-2.8-.3-4.1-.9c-1.2-.6-1.9-1.7-1.7-2.9l.3-1.9-1.6.3.1-.8c.2-1.8 1.3-3.2 3-4V7.4c0-2.2 1.6-3.9 4-3.9z" />
    <circle cx="10" cy="8.6" r=".5" fill="currentColor" />
    <circle cx="14" cy="8.6" r=".5" fill="currentColor" />
  </svg>
);

const WeiboIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 7.5a4 4 0 0 1 4 4" />
    <path d="M15.5 9.5a2 2 0 0 1 2 2" />
    <path d="M12 4a9 9 0 0 0-9 9 9 9 0 0 0 9 9 5 5 0 0 0 5-5c0-3-4-3-4-6s2-5 2-6" />
    <circle cx="11.5" cy="13.5" r="1" fill="currentColor" />
  </svg>
);

export const Footer: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // 导航项中英映射
  const NAV_EN: Record<string, string> = {
    '关于': 'About',
    '产品': 'Products',
    '项目': 'Projects',
    '团队': 'Team',
    '新闻': 'News',
    '联系': 'Contact',
  };
  const navLabel = (zh: string) => (lang === 'en' ? NAV_EN[zh] || zh : zh);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!id) return;
      if (isHome) {
        scrollToSection(id);
      } else {
        navigate('/', { state: { scrollTo: id } });
      }
    } else {
      navigate(href);
    }
  };

  // 社交链接未配置（#）时不渲染可点击链接，避免死链
  const socials = [
    { key: 'wechat' as const, label: '微信', Icon: WechatIcon },
    { key: 'qq' as const, label: 'QQ', Icon: QqIcon },
  ];

  return (
    <footer id="contact" className="bg-stone-950 text-stone-400 py-16 md:py-24 text-sm font-light">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-bold tracking-widest uppercase mb-6">MUQI HOME</h3>
            <p className="mb-4 leading-relaxed max-w-xs">{content.company.name}</p>
            <p className="opacity-60">{content.company.nameEn}</p>
          </div>

          {/* Nav */}
          <div className="md:col-span-1">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Sitemap</h4>
            <ul className="flex flex-col gap-3">
              {content.nav.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="hover:text-white transition-colors"
                  >
                    {navLabel(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Contact</h4>
            <p className="mb-2">{content.company.address}</p>
            <a
              href={`mailto:${content.company.email || ''}`}
              className="hover:text-white transition-colors block mb-2"
            >
              {t('邮箱', 'Email')}: {content.company.email}
            </a>
            {content.company.phone && (
              <a
                href={`tel:${(content.company.phone || '').replace(/\s/g, '')}`}
                className="hover:text-white transition-colors block mb-2"
              >
                {t('电话', 'Tel')}: {content.company.phone}
              </a>
            )}
            {content.company.phoneMobile && (
              <a
                href={`tel:${content.company.phoneMobile}`}
                className="hover:text-white transition-colors block"
              >
                {t('手机', 'Mobile')}: {content.company.phoneMobile}
              </a>
            )}
          </div>

          {/* Socials */}
          <div className="md:col-span-1 flex flex-col justify-start md:items-end">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Social</h4>
            <div className="flex gap-4">
              {socials.map(({ key, label, Icon }) => {
                const href = content.company.socials[key];
                if (!href || href === '#') {
                  return (
                    <span
                      key={key}
                      className="text-stone-600 cursor-not-allowed"
                      aria-label={label}
                      title={`${label}（待配置）`}
                    >
                      <Icon size={22} />
                    </span>
                  );
                }
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                    aria-label={label}
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
          <div className="flex flex-wrap gap-4 items-center opacity-50">
            <p>{content.company.copyright}</p>
          </div>

          <div className="flex gap-6 opacity-50 items-center">
            <span>{content.company.icp}</span>
            <span>Privacy Policy</span>
            <span>Terms &amp; Conditions</span>
            <button
              onClick={() => navigate('/login')}
              className="hover:text-white transition-colors"
              aria-label="后台管理"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
