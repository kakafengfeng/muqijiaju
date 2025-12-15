import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Reveal } from './UI/Reveal';
import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ProjectGrid: React.FC = () => {
  const { content } = useContent();
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const selectedProject = content.projects.find(p => p.id === selectedId);

  return (
    <section id="projects" className="py-24 md:py-32 bg-stone-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 md:mb-24">
           <Reveal direction="down">
              <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">Selected Works</span>
              <h2 className="text-3xl md:text-5xl font-light text-stone-900">经典案例</h2>
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
                      src={project.image} 
                      alt={project.name} 
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
                      <h3 className="text-lg font-medium text-stone-900 mb-1">{project.name}</h3>
                      <p className="text-xs text-stone-500 uppercase tracking-wider">{project.category}</p>
                   </div>
                   <span className="text-sm font-serif italic text-stone-400">{project.year}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-16">
            <button className="px-10 py-4 border border-stone-900 text-stone-900 text-sm tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-colors">
               更多案例
            </button>
        </div>
      </div>
      
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-sm flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedId(null)}
          >
            {/* Close Button */}
            <button 
                className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors z-50 p-2"
                onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(null);
                }}
            >
                <X size={32} strokeWidth={1} />
            </button>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="relative max-w-6xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
            >
               <div className="relative w-full overflow-hidden shadow-2xl bg-stone-900">
                   <img 
                     src={selectedProject.image} 
                     className="w-full h-full object-contain max-h-[70vh] md:max-h-[75vh]"
                     alt={selectedProject.name}
                   />
               </div>
               
               <div className="w-full mt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-white border-t border-white/10 pt-6">
                 <div>
                    <h3 className="text-2xl md:text-4xl font-light mb-2">{selectedProject.name}</h3>
                    <p className="text-sm font-bold text-white/40 tracking-widest uppercase">{selectedProject.category}</p>
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