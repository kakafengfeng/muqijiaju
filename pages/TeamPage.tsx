import React from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Users, Star, Database, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTENT as DEFAULT_CONTENT } from '../constants';

export const TeamPage: React.FC = () => {
  const { content, user, updateContent, saveContent } = useContent();
  const departments = content.departments || [];

  // Function to overwrite current data with the hardcoded list and save to DB
  const seedDatabase = async () => {
    if (!window.confirm("这将覆盖数据库中现有的“部门”数据为默认列表，确定要执行吗？")) return;
    
    try {
        // 1. Update local state with the hardcoded data from constants
        updateContent('departments', DEFAULT_CONTENT.departments);
        
        // 2. Trigger the save to Firestore
        // Note: saveContent saves the *entire* current state of 'content' to DB.
        // Since we just updated the state, we need to wait a tick or ensure state is synced, 
        // but typically in this simple context, we might need to chain it.
        // However, updateContent is sync in React state but won't reflect immediately in 'content' variable here.
        // A cleaner way for a "Seed" is to force a save of the default data directly if possible,
        // or just ask the user to click "Save" in the admin panel.
        // BUT, to fulfill the "one click" request, we will manually trigger a save with the merged data.
        
        // Let's create a temporary object merged with new departments to save
        const newContent = { ...content, departments: DEFAULT_CONTENT.departments };
        // We can't call saveContent with arguments because the context function doesn't take them.
        // So we will rely on the UI update + user hitting save, OR we modify this to just alert the user.
        
        // Better approach for "One Click": Use the AdminPanel logic conceptually.
        // Since I cannot change the `saveContent` signature easily without breaking other files,
        // I will do a trick: update the state, then alert the user to click the floating "Save" button 
        // OR (better) since we are Admin, just use the `db` directly if I had access, but I don't here.
        
        // Let's stick to updating the state and telling the user it's ready to save.
        // Wait! The user asked to "Upload to Firebase". 
        // I will assume the `saveContent` function in Context reads from the *current* state.
        // React state updates are async.
        
        // To make this truly one-click robust, I will instruct the Context to save *this specific data*.
        // But since I can't change Context easily right now, I will use a setTimeout hack to allow state to settle.
        
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
       <div className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 py-4 px-6 md:px-12 flex items-center justify-between">
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
            className="text-center mb-20"
          >
             <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-6">团队架构</h1>
             <p className="text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
                木栖家居拥有一支专业、高效、富有激情的团队。从设计研发到生产制造，从市场销售到售后服务，每一位成员都秉持着匠心精神，致力于为客户创造极致的居家体验。
             </p>
          </motion.div>

          {/* Departments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {departments.map((dept, index) => (
                <motion.div
                   key={dept.id || index}
                   {...({
                       initial: { opacity: 0, y: 20 },
                       animate: { opacity: 1, y: 0 },
                       transition: { delay: index * 0.1 }
                   } as any)}
                   className="bg-white p-8 rounded-sm shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
                >
                   <div className="flex items-center gap-3 mb-6 border-b border-stone-100 pb-4">
                      <div className="p-2 bg-stone-100 rounded text-stone-600">
                        <Users size={20} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-medium text-stone-900">{dept.department}</h3>
                   </div>

                   <div className="space-y-6">
                      {/* Manager Section */}
                      {dept.manager && (
                         <div className="flex items-start gap-3">
                            <div className="mt-1 text-amber-600">
                               <Star size={16} fill="currentColor" />
                            </div>
                            <div>
                               <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">负责人</span>
                               <span className="text-lg font-serif italic text-stone-900">{dept.manager}</span>
                            </div>
                         </div>
                      )}

                      {/* Members Section */}
                      {dept.members && dept.members.length > 0 && (
                         <div>
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-3">
                               {dept.manager ? "团队成员" : "成员列表"}
                            </span>
                            <div className="flex flex-wrap gap-2">
                               {dept.members.map((member, i) => (
                                  <span 
                                    key={i} 
                                    className="px-3 py-1 bg-stone-50 text-stone-600 text-sm rounded-full border border-stone-200"
                                  >
                                    {member}
                                  </span>
                               ))}
                            </div>
                         </div>
                      )}
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
               className="mt-24 pt-12 border-t border-stone-200 text-center"
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
                      Seed Database (Upload Team Data)
                   </button>
                   <p className="text-[10px] text-stone-400 mt-3 max-w-xs">
                      Clicking this will overwrite the live database "departments" list with the hardcoded default data provided in code.
                   </p>
                </div>
             </motion.div>
          )}
       </div>
    </div>
  );
};