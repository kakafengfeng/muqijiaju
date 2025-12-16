
import React from 'react';
import { useContent } from '../context/ContentContext';
import { Instagram, Linkedin } from 'lucide-react';

const WechatIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
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

const WeiboIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
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
  return (
    <footer className="bg-stone-950 text-stone-400 py-16 md:py-24 text-sm font-light">
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
                {content.nav.map(item => (
                   <li key={item.label}>
                      <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                   </li>
                ))}
             </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
             <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Contact</h4>
             <p className="mb-2">上海市徐汇区宜山路家饰佳4062展位</p>
             <p className="mb-6">{content.company.address}</p>
             <a href="mailto:info@muqi.com" className="hover:text-white transition-colors block mb-2">邮箱:980763379@qq.com</a>
             <a href="tel:+86 15801948991" className="hover:text-white transition-colors"> 电话:  021-54242017</a>
          </div>

           {/* Socials */}
           <div className="md:col-span-1 flex flex-col justify-start md:items-end">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-6">Social</h4>
              <div className="flex gap-4">
                 <a href={content.company.socials.wechat} className="hover:text-white transition-colors" aria-label="WeChat">
                    <WechatIcon size={22} />
                 </a>
                 <a href={content.company.socials.weibo} className="hover:text-white transition-colors" aria-label="Weibo">
                    <WeiboIcon size={22} />
                 </a>
                 <a href={content.company.socials.linkedin} className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <Linkedin size={22} strokeWidth={1.5} />
                 </a>
                 <a href={content.company.socials.instagram} className="hover:text-white transition-colors" aria-label="Instagram">
                    <Instagram size={22} strokeWidth={1.5} />
                 </a>
              </div>
           </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
           <div className="flex flex-wrap gap-4 items-center opacity-50">
              <p>{content.company.copyright}</p>
           </div>
           
           {/* Admin Link Hidden */}

           <div className="flex gap-6 opacity-50">
              <span>{content.company.icp}</span>
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
           </div>
        </div>
      </div>
    </footer>
  );
};
