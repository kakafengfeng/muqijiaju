
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Database, Lock, X, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { CONTENT as DEFAULT_CONTENT } from '../constants';
import { DepartmentMember } from '../types';

export const TeamPage: React.FC = () => {
  const { content, user, updateContent, saveContent } = useContent();
  const departments = content.departments || [];
  const [selectedMember, setSelectedMember] = useState<DepartmentMember | null>(null);
  const location = useLocation();

  // Handle Scroll to Hash on Mount
  useEffect(() => {
    if (location.hash) {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
            // Slight delay to ensure DOM is ready and animation doesn't conflict
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }
  }, [location]);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMember]);

  const seedDatabase = async () => {
    if (!window.confirm("这将覆盖数据库中现有的“部门”数据为默认列表，确定要执行吗？")) return;
    try {
        updateContent('departments', DEFAULT_CONTENT.departments);
        setTimeout(async () => {
             await saveContent();
             alert("✅ 数据已重置并上传至云端数据库！");
        }, 500);
    } catch (e) {
        console.error(e);
        alert("Upload failed. See console.");
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
       {/* Nav Strip */}
       <div className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 py-4 px-6 md:px-12 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-900 hover:opacity-60 transition-opacity">
             <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="text-xs font-bold text-stone-400 uppercase">Organization</span>
       </div>

       <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
          <motion.div 
            {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            } as any)}
            className="text-center mb-16"
          >
             <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">团队架构</h1>
             <p className="text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
                高效协作，专业分工。每一位成员都是木栖大家庭不可或缺的一部分。
             </p>
          </motion.div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {departments.map((dept, deptIndex) => (
                <motion.div
                   id={dept.id} // Added ID for Anchor Scroll
                   key={dept.id || deptIndex}
                   {...({
                       initial: { opacity: 0, y: 20 },
                       whileInView: { opacity: 1, y: 0 },
                       viewport: { once: true },
                       transition: { delay: deptIndex * 0.1 }
                   } as any)}
                   className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100 flex flex-col h-full scroll-mt-32" // scroll-mt for sticky header offset
                >
                   {/* Header: Dept Name & Manager */}
                   <div className="mb-6 border-b border-stone-100 pb-4">
                       <h2 className="text-2xl font-bold text-stone-900 mb-3">{dept.department}</h2>
                       {dept.manager ? (
                           <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-md w-fit">
                               <Star size={16} fill="currentColor" className="text-amber-500" />
                               <span className="text-sm font-bold tracking-wide">Manager: {dept.manager}</span>
                           </div>
                       ) : (
                           <div className="h-9"></div> // Spacer to align cards if no manager
                       )}
                   </div>

                   {/* Members List - Tag Style */}
                   <div className="flex-1">
                       <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Members ({dept.members?.length || 0})</div>
                       <div className="flex flex-wrap gap-2">
                           {dept.members?.map((member, mIndex) => (
                               <button 
                                   key={member.id || mIndex}
                                   onClick={() => setSelectedMember(member)}
                                   className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-full text-sm hover:bg-stone-900 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                               >
                                   <Briefcase size={12} className="opacity-0 w-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-200" />
                                   {member.name}
                               </button>
                           ))}
                       </div>
                   </div>
                </motion.div>
             ))}
          </div>

          {/* Admin Action Area */}
          {user && (
             <motion.div 
               {...({
                   initial: { opacity: 0 },
                   animate: { opacity: 1 }
               } as any)}
               className="mt-32 pt-12 border-t border-stone-200 text-center"
             >
                <div className="inline-flex flex-col items-center p-6 bg-stone-100 rounded-lg border border-stone-200">
                   <h4 className="text-sm font-bold text-stone-900 uppercase mb-4 flex items-center gap-2">
                      <Lock size={14} /> Admin Zone
                   </h4>
                   <button 
                      onClick={seedDatabase}
                      className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded hover:bg-stone-700 transition-colors shadow-lg"
                   >
                      <Database size={18} />
                      Reset to Default Data
                   </button>
                </div>
             </motion.div>
          )}
       </div>

       {/* Member Detail Modal */}
       <AnimatePresence>
          {selectedMember && (
             <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12 bg-stone-900/95 backdrop-blur-sm"
                onClick={() => setSelectedMember(null)}
             >
                <button 
                   className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                   onClick={() => setSelectedMember(null)}
                >
                   <X size={32} strokeWidth={1} />
                </button>

                <motion.div
                   className="bg-white w-full max-w-lg overflow-hidden flex flex-col shadow-2xl rounded-lg"
                   onClick={(e) => e.stopPropagation()}
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                >
                   {/* Modal Image */}
                   <div className="w-full aspect-video bg-stone-200 relative overflow-hidden">
                       <img 
                          src={selectedMember.image} 
                          alt={selectedMember.name} 
                          className="w-full h-full object-cover"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
                       <div className="absolute bottom-6 left-6 text-white">
                           <h2 className="text-3xl font-light mb-1">{selectedMember.name}</h2>
                           <p className="text-amber-400 text-sm font-bold uppercase tracking-wider">{selectedMember.role}</p>
                       </div>
                   </div>

                   {/* Modal Content */}
                   <div className="p-8">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 block">Introduction</span>
                      <p className="text-stone-600 leading-relaxed font-serif italic text-lg">
                         "{selectedMember.intro || "暂无个人介绍"}"
                      </p>
                      
                      <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                         <span className="text-xs text-stone-400">Employee ID: {selectedMember.id}</span>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
