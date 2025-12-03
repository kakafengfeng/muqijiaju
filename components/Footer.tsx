import React from 'react';
import { CONTENT } from '../constants';
import { Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-16 md:py-24 text-sm font-light">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white text-lg font-bold tracking-widest uppercase mb-6">MUQI HOME</h3>
            <p className="mb-4 leading-relaxed max-w-xs">{CONTENT.company.name}</p>
            <p className="opacity-60">{CONTENT.company.nameEn}</p>
          </div>

          {/* Nav */}
          <div className="md:col-span-1">
             <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Sitemap</h4>
             <ul className="flex flex-col gap-3">
                {CONTENT.nav.map(item => (
                   <li key={item.label}>
                      <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                   </li>
                ))}
             </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
             <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Contact</h4>
             <p className="mb-2">上海市静安区</p>
             <p className="mb-6">{CONTENT.company.address}</p>
             <a href="mailto:info@muqi.com" className="hover:text-white transition-colors block mb-2">info@muqi.com</a>
             <a href="tel:+862112345678" className="hover:text-white transition-colors">+86 21 1234 5678</a>
          </div>

           {/* Socials */}
           <div className="md:col-span-1 flex flex-col justify-start md:items-end">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Social</h4>
              <div className="flex gap-4">
                 <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                 <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
                 <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
                 <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              </div>
           </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs opacity-50">
           <p>{CONTENT.company.copyright}</p>
           <div className="flex gap-6">
              <span>{CONTENT.company.icp}</span>
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
           </div>
        </div>
      </div>
    </footer>
  );
};