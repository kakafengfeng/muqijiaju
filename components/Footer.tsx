
import React, { useState } from 'react';
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

// 社交配置：微信号 / QQ 号（二维码图片在 public/images/ 下，可直接替换同名文件）
// 路径拼接 BASE_URL，兼容 GitHub Pages 子路径部署（/muqijiaju/）与 Cloudflare 根路径部署
const WECHAT_ID = 'zhangyanhui95';
const QQ_NUMBER = '980763379';
const WECHAT_QR = `${import.meta.env.BASE_URL}images/wechat-qr.png`;
const QQ_QR = `${import.meta.env.BASE_URL}images/qq-qr.png`;

export const Footer: React.FC = () => {
  const { content } = useContent();
  const { lang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // 微信弹窗 / QQ 弹窗（两者大小位置一致）/ 复制成功提示状态
  const [wechatOpen, setWechatOpen] = useState(false);
  const [qqOpen, setQqOpen] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);
  const [qqCopied, setQqCopied] = useState(false);

  // 导航项中英映射
  const navLabelMap: Record<string, string> = {
    '关于': 'About',
    '产品': 'Products',
    '项目': 'Projects',
    '团队': 'Team',
    '新闻': 'News',
    '联系': 'Contact',
  };
  const navLabel = (label: string) => (lang === 'en' ? navLabelMap[label] || label : label);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href || href === '#') return;
    if (href.startsWith('#')) {
      e.preventDefault();
      if (isHome) {
        scrollToSection(href.slice(1));
      } else {
        navigate('/', { state: { scrollTo: href.slice(1) } });
      }
    }
  };

  // 社交链接未配置（#）时不渲染可点击链接，避免死链
  const socials = [
    { key: 'wechat' as const, label: t('微信', 'WeChat'), Icon: WechatIcon },
    { key: 'qq' as const, label: 'QQ', Icon: QqIcon },
  ];

  // 复制微信号（navigator.clipboard + 唤起微信）
  const copyWechatId = async () => {
    try {
      await navigator.clipboard.writeText(WECHAT_ID);
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
      // 尝试唤起微信客户端（仅 PC 桌面微信 / 移动端）
      window.location.href = 'weixin://';
    } catch {
      // clipboard 不可用（非 https）时回退
      setWechatCopied(true);
      setTimeout(() => setWechatCopied(false), 2500);
    }
  };

  // 复制 QQ 号
  const copyQQ = async () => {
    try {
      await navigator.clipboard.writeText(QQ_NUMBER);
      setQqCopied(true);
      setTimeout(() => setQqCopied(false), 2000);
    } catch {
      setQqCopied(true);
      setTimeout(() => setQqCopied(false), 2000);
    }
  };

  // QQ 点击：按设备唤起加好友协议
  const openQQ = () => {
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const url = isMobile
      ? `mqqwpa://im/chat?chat_type=wpa&uin=${QQ_NUMBER}&version=1&src_type=web`
      : `tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=${QQ_NUMBER}`;
    window.location.href = url;
  };

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
            <p className="mb-2 break-words">{lang === 'en' ? (content.company.addressEn || content.company.address) : content.company.address}</p>
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
                // 微信：点击 / 悬停打开扫码弹窗
                if (key === 'wechat') {
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setWechatOpen(true)}
                      onMouseEnter={() => setWechatOpen(true)}
                      className="hover:text-white transition-colors cursor-pointer"
                      aria-label={label}
                      title={t('扫码添加微信', 'Scan to add on WeChat')}
                    >
                      <Icon size={22} />
                    </button>
                  );
                }
                // QQ：PC 点击 / 悬停打开与微信一致的大弹窗；移动端点击直接唤起协议
                return (
                  <button
                    key={key}
                    type="button"
                    onMouseEnter={() => setQqOpen(true)}
                    onClick={() => {
                      const isHoverDevice =
                        typeof window !== 'undefined' && window.matchMedia
                          ? window.matchMedia('(hover: hover)').matches
                          : true;
                      if (isHoverDevice) {
                        setQqOpen(true);
                      } else {
                        openQQ();
                      }
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                    aria-label={label}
                    title={t('点击添加 QQ 好友', 'Add on QQ')}
                  >
                    <Icon size={22} />
                  </button>
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
              aria-label={t('后台管理', 'Admin panel')}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* 微信扫码弹窗（暗黑极简卡片） */}
      {wechatOpen && (
        <div
          className="fixed inset-0 z-[200] bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setWechatOpen(false)}
        >
          <div
            className="bg-stone-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setWechatOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
              aria-label={t('关闭', 'Close')}
            >
              ×
            </button>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
              {t('扫码添加微信', 'Scan to Add WeChat')}
            </p>
            <h3 className="text-white text-2xl font-light mb-6">WeChat</h3>
            <img
              src={WECHAT_QR}
              alt="WeChat QR"
              className="w-56 h-72 mx-auto bg-white p-2 rounded-lg mb-6 object-contain"
            />
            <p className="text-center text-white/80 text-sm mb-6 break-words">
              {t('微信号', 'WeChat ID')}:{' '}
              <span className="font-semibold text-white">{WECHAT_ID}</span>
            </p>
            <button
              type="button"
              onClick={copyWechatId}
              className="w-full py-3 bg-white text-stone-900 text-sm font-medium tracking-widest uppercase rounded-lg hover:bg-stone-200 transition-colors"
            >
              {t('复制微信号', 'Copy WeChat ID')}
            </button>
            {wechatCopied && (
              <p className="text-center text-green-400 text-xs mt-3">
                {t('微信号已复制，请打开微信添加', 'WeChat ID copied!')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* QQ 弹窗（与微信弹窗大小位置一致的暗黑极简卡片） */}
      {qqOpen && (
        <div
          className="fixed inset-0 z-[200] bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setQqOpen(false)}
        >
          <div
            className="bg-stone-900 border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQqOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors text-xl leading-none"
              aria-label={t('关闭', 'Close')}
            >
              ×
            </button>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
              {t('添加 QQ 好友', 'Add on QQ')}
            </p>
            <h3 className="text-white text-2xl font-light mb-6">QQ</h3>
            <img
              src={QQ_QR}
              alt="QQ QR"
              className="w-56 h-72 mx-auto bg-white p-2 rounded-lg mb-6 object-contain"
            />
            <p className="text-center text-white/80 text-sm mb-6 break-words">
              {t('QQ 号', 'QQ Number')}:{' '}
              <span className="font-semibold text-white">{QQ_NUMBER}</span>
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={openQQ}
                className="w-full py-3 bg-white text-stone-900 text-sm font-medium tracking-widest uppercase rounded-lg hover:bg-stone-200 transition-colors"
              >
                {t('唤起 QQ', 'Open QQ')}
              </button>
              <button
                type="button"
                onClick={copyQQ}
                className="w-full py-3 bg-transparent border border-white/20 text-white text-sm font-medium tracking-widest uppercase rounded-lg hover:bg-white/10 transition-colors"
              >
                {t('复制 QQ 号', 'Copy QQ Number')}
              </button>
              {qqCopied && (
                <p className="text-center text-green-400 text-xs">
                  {t('QQ 号已复制', 'QQ Number copied!')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
