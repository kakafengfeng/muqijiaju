import React, { useState } from 'react';
import { CONTENT } from '../constants';
import { Reveal } from './UI/Reveal';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ProjectGrid: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
          {CONTENT.projects.map((project, index) => (
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
      
      {/* Simple Lightbox Modal */}
      <AnimatePresence>
        {selectedId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            <div className="relative max-w-5xl w-full max-h-[90vh]">
               <img 
                 src={CONTENT.projects.find(p => p.id === selectedId)?.image} 
                 className="w-full h-full object-contain max-h-[85vh]"
                 alt="Project detail"
               />
               <div className="absolute bottom-[-40px] left-0 text-white font-light text-xl">
                 {CONTENT.projects.find(p => p.id === selectedId)?.name}
               </div>
               <button className="absolute -top-10 right-0 text-white hover:text-stone-300">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};