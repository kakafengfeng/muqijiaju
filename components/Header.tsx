
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { scrollToSection } from '../lib/nav';

// 导航项中英映射（导航 label 来自后台，这里按中文 label 做前端翻译）
const NAV_EN: Record<string, string> = {
  '关于': 'About',
  '产品': 'Products',
  '项目': 'Projects',
  '团队': 'Team',
  '新闻': 'News',
  '联系': 'Contact',
};

export const Header: React.FC = () => {
  const { content } = useContent();
  const { lang, toggle } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const navLabel = (zh: string) => (lang === 'en' ? NAV_EN[zh] || zh : zh);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = !isHome || isScrolled
    ? 'bg-stone-50/90 backdrop-blur-md py-4 text-stone-900 shadow-sm'
    : 'bg-transparent py-8 text-white';

  const textColor = !isHome || isScrolled ? 'text-stone-900' : 'text-white';

  // 导航点击：锚点项在首页直接平滑滚动、非首页回首页后滚动；
  // 路由项（如 /team）直接导航
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
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${headerStyle}`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer z-50">
            {content.company.logo ? (
              <img
                src={content.company.logo}
                alt={content.company.name}
                className="h-14 w-auto object-contain transition-all duration-300"
              />
            ) : (
              <span className={`text-xl font-bold tracking-widest uppercase ${textColor}`}>
                MUQI
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {content.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-base tracking-widest uppercase hover:opacity-60 transition-opacity ${
                  !isHome || isScrolled ? 'text-stone-900' : 'text-white/90'
                }`}
              >
                {navLabel(item.label)}
              </a>
            ))}
            {/* 语言切换：始终显示「中 / EN」，当前语言高亮 */}
            <button
              type="button"
              onClick={toggle}
              aria-label="Switch language"
              className={`flex items-center gap-1.5 text-xs tracking-widest uppercase px-3 py-1.5 rounded-full border transition-all ${
                !isHome || isScrolled
                  ? 'border-stone-900/40 text-stone-900 hover:bg-stone-900 hover:text-white'
                  : 'border-white/50 text-white/90 hover:bg-white hover:text-stone-900'
              }`}
            >
              <span className={lang === 'zh' ? 'font-bold' : 'opacity-50'}>中</span>
              <span className="opacity-40">/</span>
              <span className={lang === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            className={`md:hidden z-50 hover:opacity-60 transition-opacity ${isMenuOpen ? 'text-stone-900' : textColor}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            {...({
              initial: { opacity: 0, x: '100%' },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: '100%' },
              transition: { type: 'tween', duration: 0.4 },
            } as any)}
            className="fixed inset-0 z-40 bg-stone-50 flex flex-col justify-center items-center md:hidden"
          >
            <nav className="flex flex-col gap-8 text-center">
              {content.nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-2xl text-stone-900 font-light tracking-widest uppercase"
                >
                  {navLabel(item.label)}
                </a>
              ))}
              <button
                type="button"
                onClick={toggle}
                className="mx-auto flex items-center gap-1.5 text-sm tracking-widest uppercase px-5 py-2 rounded-full border border-stone-900/40 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors"
              >
                <span className={lang === 'zh' ? 'font-bold' : 'opacity-50'}>中</span>
                <span className="opacity-40">/</span>
                <span className={lang === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
