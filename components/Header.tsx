import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Search } from 'lucide-react';
import { CONTENT } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'bg-stone-50/90 backdrop-blur-md py-4 text-stone-900 shadow-sm' 
            : 'bg-transparent py-8 text-white'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2 cursor-pointer z-50">
            <div className={`h-8 w-8 ${isScrolled ? 'bg-stone-900' : 'bg-white'} rounded-sm`}></div>
            <span className={`text-xl font-bold tracking-widest uppercase ${isScrolled ? 'text-stone-900' : 'text-white'}`}>
              MUQI
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            {CONTENT.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm tracking-widest uppercase hover:opacity-60 transition-opacity ${
                   isScrolled ? 'text-stone-900' : 'text-white/90'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Utilities */}
          <div className="hidden md:flex items-center gap-6">
            <button className={`hover:opacity-60 transition-opacity ${isScrolled ? 'text-stone-900' : 'text-white'}`}>
                <Search size={20} strokeWidth={1.5} />
            </button>
            <button className={`flex items-center gap-2 text-xs tracking-wide hover:opacity-60 transition-opacity ${isScrolled ? 'text-stone-900' : 'text-white'}`}>
              <Globe size={18} strokeWidth={1.5} />
              <span>ZH / EN</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden z-50 hover:opacity-60 transition-opacity ${isScrolled || isMenuOpen ? 'text-stone-900' : 'text-white'}`}
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 z-40 bg-stone-50 flex flex-col justify-center items-center md:hidden"
          >
            <nav className="flex flex-col gap-8 text-center">
              {CONTENT.nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
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