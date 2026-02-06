
import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Search } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { content, user } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // If we are on a detail page, we might want the header to be always dark/visible or handle it differently
  // For now, we stick to the transparent-to-white behavior on the home page
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force header style if not on home
  const headerStyle = !isHome || isScrolled
    ? 'bg-stone-50/90 backdrop-blur-md py-4 text-stone-900 shadow-sm'
    : 'bg-transparent py-8 text-white';

  const textColor = !isHome || isScrolled ? 'text-stone-900' : 'text-white';
  
  // Logic to invert logo color when header is transparent (dark background)
  // The default logo is dark blue. 
  // When transparent (isHome && !isScrolled), we need it white -> brightness-0 invert
  const logoFilterClass = (!isHome || isScrolled) ? '' : 'brightness-0 invert';

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
                    className={`h-12 w-auto transition-all duration-300 ${logoFilterClass}`}
                 />
             ) : (
                 <span className={`text-xl font-bold tracking-widest uppercase ${textColor}`}>
                   MUQI
                 </span>
             )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {content.nav.map((item) => {
               // Handle anchor links vs actual routes if we add more pages
               // For single page sections, we stick to anchors on home
               const isAnchor = item.href.startsWith('#');
               const href = isAnchor && !isHome ? `/${item.href}` : item.href;

               return (
                  <a
                    key={item.label}
                    href={href}
                    className={`text-sm tracking-widest uppercase hover:opacity-60 transition-opacity ${
                      !isHome || isScrolled ? 'text-stone-900' : 'text-white/90'
                    }`}
                  >
                    {item.label}
                  </a>
               );
            })}
          </nav>

          {/* Utilities */}
          <div className="hidden md:flex items-center gap-6">
            {/* Admin Login Button Hidden - Access via /login */}
            <button className={`hover:opacity-60 transition-opacity ${textColor}`}>
                <Search size={20} strokeWidth={1.5} />
            </button>
            <button className={`flex items-center gap-2 text-xs tracking-wide hover:opacity-60 transition-opacity ${textColor}`}>
              <Globe size={18} strokeWidth={1.5} />
              <span>ZH / EN</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
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
                initial: { opacity: 0, x: "100%" },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: "100%" },
                transition: { type: "tween", duration: 0.4 }
            } as any)}
            className="fixed inset-0 z-40 bg-stone-50 flex flex-col justify-center items-center md:hidden"
          >
            <nav className="flex flex-col gap-8 text-center">
              {content.nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href.startsWith('#') && !isHome ? `/${item.href}` : item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl text-stone-900 font-light tracking-widest uppercase"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
