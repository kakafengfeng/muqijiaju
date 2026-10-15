import React, { useState, useEffect, useCallback } from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import { Reveal } from './UI/Reveal';
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ProjectGrid: React.FC = () => {
  const { content } = useContent();
  const { lang } = useLanguage();
  const isEn = lang === 'en';
  const t = (zh: string, en: string) => (isEn ? en : zh);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const selectedProject = content.projects.find(p => p.id === selectedId);

  // 兼容旧数据：无 images 数组时退回单图
  const getImages = (p: { image: string; images?: string[] }) =>
    p.images && p.images.length > 0 ? p.images : [p.image];

  const currentImages = selectedProject ? getImages(selectedProject) : [];
  const total = currentImages.length;

  const nextImage = useCallback(() => {
    if (total > 1) setImageIndex(i => (i + 1) % total);
  }, [total]);

  const prevImage = useCallback(() => {
    if (total > 1) setImageIndex(i => (i - 1 + total) % total);
  }, [total]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedId]);

  // 打开时重置索引；键盘左右切换 / Esc 关闭
  useEffect(() => {
    if (selectedId) setImageIndex(0);
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, nextImage, prevImage]);

  return (
    <section id="projects" className="py-24 md:py-32 bg-stone-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
           <Reveal direction="down">
              <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">Selected Works</span>
              <h2 className="text-3xl md:text-5xl font-light text-stone-900">{t('经典案例', 'Featured Projects')}</h2>
           </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.projects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.1}>
              <div 
                className="group relative cursor-pointer block overflow-hidden"
                onClick={() => setSelectedId(project.id)}
              >
                <div className="aspect-square bg-stone-300 overflow-hidden relative">
                   <img
                      src={getImages(project)[0]}
                      alt={project.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                         <Plus size={24} />
                      </div>
                   </div>
                </div>
                
                <div className="mt-6 flex justify-between items-start">
                   <div>
                      <h3 className="text-lg font-medium text-stone-900 mb-1 break-words">{isEn ? (project.nameEn || project.name) : project.name}</h3>
                      <p className="text-xs text-stone-500 uppercase tracking-wider">{isEn ? (project.categoryEn || project.category) : project.category}</p>
                   </div>
                   <span className="text-sm font-serif italic text-stone-400">{project.year}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-16">
            <button className="px-10 py-4 border border-stone-900 text-stone-900 text-sm tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-colors">
               {t('更多案例', 'More Projects')}
            </button>
        </div>
      </div>
      
      {/* Lightbox Modal — 多图浏览 */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <motion.div 
            {...({
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                transition: { duration: 0.3 }
            } as any)}
            className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedId(null)}
          >
            {/* Close Button */}
            <button
                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors z-50 p-2"
                aria-label={t('关闭案例大图', 'Close case image')}
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(null);
                }}
            >
                <X size={32} strokeWidth={1} />
            </button>

            <motion.div 
                {...({
                    initial: { opacity: 0, scale: 0.95, y: 20 },
                    animate: { opacity: 1, scale: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.95, y: 20 },
                    transition: { duration: 0.4, delay: 0.1, ease: "easeOut" }
                } as any)}
                className="relative max-w-6xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
            >
               {/* 主图区域 */}
               <div className="relative w-full overflow-hidden shadow-2xl bg-stone-900 select-none">
                  <div className="relative w-full" style={{ minHeight: '40vh' }}>
                     <AnimatePresence mode="wait">
                        <motion.img 
                           key={imageIndex}
                           {...({
                              initial: { opacity: 0, x: 40 },
                              animate: { opacity: 1, x: 0 },
                              exit: { opacity: 0, x: -40 },
                              transition: { duration: 0.35, ease: "easeOut" }
                           } as any)}
                           src={currentImages[imageIndex]}
                           className="w-full h-full object-contain max-h-[60vh] md:max-h-[68vh]"
                           alt={`${selectedProject.name} ${imageIndex + 1}`}
                           draggable={false}
                        />
                     </AnimatePresence>
                  </div>

                  {/* 左右切换箭头 */}
                  {total > 1 && (
                     <>
                        <button
                           aria-label={t('上一张', 'Previous image')}
                           onClick={(e) => { e.stopPropagation(); prevImage(); }}
                           className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/25 bg-stone-950/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 hover:bg-stone-950/70 transition-all z-10"
                        >
                           <ChevronLeft size={22} />
                        </button>
                        <button
                           aria-label={t('下一张', 'Next image')}
                           onClick={(e) => { e.stopPropagation(); nextImage(); }}
                           className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full border border-white/25 bg-stone-950/40 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 hover:bg-stone-950/70 transition-all z-10"
                        >
                           <ChevronRight size={22} />
                        </button>
                     </>
                  )}

                  {/* 页码指示 */}
                  {total > 1 && (
                     <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-full bg-stone-950/60 backdrop-blur-sm text-white/70 text-xs tracking-widest">
                        {imageIndex + 1} / {total}
                     </div>
                  )}
               </div>

               {/* 缩略图条 */}
               {total > 1 && (
                  <div className="w-full mt-4 flex gap-3 overflow-x-auto pb-1" onClick={(e) => e.stopPropagation()}>
                     {currentImages.map((img, i) => (
                        <button
                           key={i}
                           onClick={() => setImageIndex(i)}
                           aria-label={`${t('查看第', 'View image ')}${i + 1}`}
                           className={`flex-shrink-0 w-20 h-14 md:w-28 md:h-20 overflow-hidden rounded transition-all duration-300 ${
                              i === imageIndex
                                 ? 'ring-2 ring-white/90 opacity-100'
                                 : 'opacity-50 hover:opacity-90 ring-1 ring-white/15'
                           }`}
                        >
                           <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                     ))}
                  </div>
               )}
               
               <div className="w-full mt-6 flex flex-col md:flex-row justify-between items-start md:items-center text-white border-t border-white/10 pt-6">
                 <div>
                    <h3 className="text-2xl md:text-4xl font-light mb-2 break-words">{isEn ? (selectedProject.nameEn || selectedProject.name) : selectedProject.name}</h3>
                    <p className="text-sm font-bold text-white/40 tracking-widest uppercase">{isEn ? (selectedProject.categoryEn || selectedProject.category) : selectedProject.category}</p>
                 </div>
                 <div className="mt-4 md:mt-0 font-serif italic text-3xl text-white/60">
                    {selectedProject.year}
                 </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
