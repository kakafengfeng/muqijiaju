import React from 'react';
import { useContent } from '../context/ContentContext';
import { Reveal } from './UI/Reveal';

export const TeamSection: React.FC = () => {
  const { content } = useContent();

  return (
    <section id="team" className="py-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 text-center">
           <Reveal>
              <span className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-4 block">Our Team</span>
              <h2 className="text-3xl md:text-4xl font-light text-stone-900">核心团队</h2>
           </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
          {content.team.map((member, index) => (
             <Reveal key={member.id} delay={index * 0.1}>
                <div className="group text-center cursor-default">
                   {/* Image container */}
                   <div className="relative mb-8 overflow-hidden aspect-[3/4] mx-auto w-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out bg-stone-100">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                   </div>
                   
                   {/* Text Info */}
                   <div className="space-y-3">
                     <h3 className="text-xl font-medium text-stone-900">{member.name}</h3>
                     <div className="w-8 h-[1px] bg-stone-300 mx-auto transition-all duration-500 group-hover:w-16 group-hover:bg-stone-900"></div>
                     <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">{member.role}</div>
                     <p className="text-stone-500 font-light text-sm leading-relaxed max-w-xs mx-auto pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {member.intro}
                     </p>
                   </div>
                </div>
             </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};