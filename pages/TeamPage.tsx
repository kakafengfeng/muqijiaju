
import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Star, Database, Lock, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTENT as DEFAULT_CONTENT } from '../constants';
import { DepartmentMember } from '../types';

export const TeamPage: React.FC = () => {
  const { content, user, updateContent, saveContent } = useContent();
  const departments = content.departments || [];
  const [selectedMember, setSelectedMember] = useState<DepartmentMember | null>(null);

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
          <span className="text-xs font-bold text-stone-400 uppercase">Our Team</span>
       </div>

       <div className="container mx-auto px-6 md:px-12 pt-32 pb-24">
          <motion.div 
            {...({
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
            } as any)}
            className="text-center mb-24"
          >
             <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">团队架构</h1>
             <p className="text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
                木栖家居拥有一支专业、高效、富有激情的团队。每一位成员都秉持着匠心精神，致力于为客户创造极致的居家体验。
             </p>
          </motion.div>

          {/* Departments Loop */}
          <div className="space-y-32">
             {departments.map((dept, deptIndex) => (
                <div key={dept.id || deptIndex}>
                   {/* Department Header */}
                   <motion.div 
                      {...({
                          initial: { opacity: 0 },
                          whileInView: { opacity: 1 },
                          viewport: { once: true }
                      } as any)}
                      className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-4"
                   >
                      <div>
                          <h2 className="text-3xl font-light text-stone-900 mb-2">{dept.department}</h2>
                          {dept.manager && (
                             <div className="flex items-center gap-2 text-stone-500">
                                <Star size={14} className="text-amber-600" />
                                <span className="text-sm font-serif italic">Manager: {dept.manager}</span>
                             </div>
                          )}
                      </div>
                      <span className="text-xs font-bold text-stone-300 uppercase tracking-widest mt-4 md:mt-0">
                          {dept.members?.length || 0} Members
                      </span>
                   </motion.div>

                   {/* Members Grid */}
                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                      {dept.members?.map((member, memberIndex) => (
                         <motion.div
                            key={member.id || memberIndex}
                            layoutId={`member-card-${member.id || memberIndex}`}
                            {...({
                                initial: { opacity: 0, y: 20 },
                                whileInView: { opacity: 1, y: 0 },
                                viewport: { once: true },
                                transition: { delay: memberIndex * 0.05 }
                            } as any)}
                            className="group cursor-pointer"
                            onClick={() => setSelectedMember(member)}
                         >
                            {/* Card Image */}
                            <div className="relative aspect-[3/4] bg-stone-200 overflow-hidden mb-4">
                                <img 
                                   src={member.image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                                   alt={member.name}
                                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500"></div>
                                <div className="absolute bottom-4 right-4 bg-white text-stone-900 p-2 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                   <Plus size={16} />
                                </div>
                            </div>

                            {/* Card Info */}
                            <div>
                               <h3 className="text-lg font-bold text-stone-900">{member.name}</h3>
                               <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{member.role}</p>
                            </div>
                         </motion.div>
                      ))}
                   </div>
                </div>
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
                   <p className="text-[10px] text-stone-400 mt-3 max-w-xs">
                      Updates the database with the defined structure (images, roles, intros).
                   </p>
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
                   layoutId={`member-card-${selectedMember.id}`}
                   className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl"
                   onClick={(e) => e.stopPropagation()}
                >
                   {/* Modal Image */}
                   <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-auto bg-stone-200 relative">
                       <img 
                          src={selectedMember.image} 
                          alt={selectedMember.name} 
                          className="w-full h-full object-cover"
                       />
                   </div>

                   {/* Modal Content */}
                   <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Team Member</span>
                      <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-2">{selectedMember.name}</h2>
                      <div className="text-sm font-medium text-amber-600 mb-8 uppercase tracking-wider">{selectedMember.role}</div>
                      
                      <div className="h-[1px] w-12 bg-stone-200 mb-8"></div>
                      
                      <div className="relative">
                         <span className="absolute -top-4 -left-2 text-6xl text-stone-100 font-serif">"</span>
                         <p className="text-stone-600 leading-relaxed font-serif italic text-lg relative z-10">
                            {selectedMember.intro || "暂无个人介绍"}
                         </p>
                      </div>
                      
                      <div className="mt-12 pt-8 border-t border-stone-100 flex gap-8">
                         <div>
                            <span className="block text-[10px] uppercase font-bold text-stone-400">Department</span>
                            <span className="text-stone-900 text-sm">
                                {departments.find(d => d.members.find(m => m.id === selectedMember.id))?.department}
                            </span>
                         </div>
                         <div>
                            <span className="block text-[10px] uppercase font-bold text-stone-400">ID</span>
                            <span className="text-stone-900 text-sm">{selectedMember.id}</span>
                         </div>
                      </div>
                   </div>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};
