import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Settings, X, Image as ImageIcon, ChevronRight, ChevronDown, Trash2, Plus, Save, LogOut, RotateCcw, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { content, updateContent, updateNestedContent, saveContent, resetContent, user, logout } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // If not authenticated, hide completely
  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
        await saveContent();
        alert('Changes saved to cloud successfully.');
    } catch (e) {
        alert('Error saving changes. Check console.');
    } finally {
        setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  // Helper to handle Array Additions
  const handleAdd = (sectionId: string) => {
    const currentArray = (content as any)[sectionId];
    const id = Date.now().toString();
    let newItem = {};

    switch (sectionId) {
      case 'team':
        newItem = { id, name: 'New Member', role: 'Position', intro: 'Introduction...', image: 'https://aistudiocdn.com/images/placeholder-portrait.jpg' };
        break;
      case 'news':
        newItem = { id, title: 'New Article', date: new Date().toISOString().slice(0, 7), category: 'News', link: '#' };
        break;
      case 'products':
        newItem = { id, category: 'Series', name: 'New Product', description: 'Desc...', image: 'https://aistudiocdn.com/images/placeholder.jpg' };
        break;
      case 'projects':
        newItem = { id, name: 'New Project', category: 'Category', year: '2025', image: 'https://aistudiocdn.com/images/placeholder.jpg' };
        break;
      default: return;
    }
    updateContent(sectionId as any, [...currentArray, newItem]);
  };

  const handleDelete = (sectionId: string, index: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        const currentArray = (content as any)[sectionId];
        updateContent(sectionId as any, currentArray.filter((_: any, idx: number) => idx !== index));
    }
  };

  // Image Upload (Base64 for simplicity in this demo, ideally upload to Firebase Storage)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, path: string[]) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateNestedContent(path, reader.result);
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    { id: 'hero', label: '首页 Hero' },
    { id: 'about', label: '关于 About' },
    { id: 'products', label: '产品 Products', isArray: true },
    { id: 'projects', label: '项目 Projects', isArray: true },
    { id: 'team', label: '团队 Team', isArray: true },
    { id: 'news', label: '新闻 News', isArray: true },
    { id: 'company', label: '公司信息 Company' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] bg-amber-600 text-white p-4 rounded-full shadow-2xl hover:bg-amber-700 transition-colors animate-bounce"
        title="Admin Panel"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-white z-[100] shadow-2xl flex flex-col border-l border-stone-200">
      {/* Header */}
      <div className="p-6 bg-stone-900 text-white flex justify-between items-center">
        <div>
           <h2 className="text-lg font-bold tracking-wider uppercase">CMS</h2>
           <div className="flex items-center gap-2 text-[10px] text-green-400">
             <span className="w-2 h-2 rounded-full bg-green-500"></span> Online: {user.email}
           </div>
        </div>
        <div className="flex gap-4">
            <button onClick={handleLogout} className="hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={20} />
            </button>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
                <X size={24} />
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex justify-between items-center">
          <button onClick={resetContent} className="flex items-center gap-2 text-xs text-red-600 hover:text-red-800 font-medium">
             <RotateCcw size={14} /> Revert
          </button>
          <button 
             onClick={handleSave}
             disabled={isSaving}
             className="flex items-center gap-2 bg-stone-900 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-stone-700 transition-colors shadow-sm disabled:opacity-50"
          >
             <Save size={14} /> {isSaving ? 'Saving...' : 'Save to Cloud'}
          </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-stone-100 pb-4">
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="w-full flex justify-between items-center py-2 text-stone-900 font-medium hover:text-stone-600"
            >
              <span>{section.label}</span>
              {activeSection === section.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            <AnimatePresence>
              {activeSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    {section.id === 'hero' && (
                      <>
                        <InputField label="Title" path={['hero', 'title']} />
                        <InputField label="Subtitle" path={['hero', 'subtitle']} />
                        <TextAreaField label="Description" path={['hero', 'description']} />
                        <ImageUploadField label="Background" path={['hero', 'backgroundImage']} />
                      </>
                    )}
                    {section.id === 'about' && (
                      <>
                        <InputField label="Heading" path={['about', 'heading']} />
                        <TextAreaField label="Para 1" path={['about', 'paragraph1']} />
                         <ImageUploadField label="Image" path={['about', 'image']} />
                      </>
                    )}
                    {section.id === 'company' && (
                        <>
                           <InputField label="Name" path={['company', 'name']} />
                           <InputField label="Address" path={['company', 'address']} />
                        </>
                     )}

                    {section.isArray && (
                      <div className="space-y-6">
                        {(content as any)[section.id].map((item: any, idx: number) => (
                            <div key={item.id || idx} className="relative p-4 bg-stone-50 rounded-lg space-y-3 border border-stone-100">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-xs font-bold text-stone-400 uppercase">#{idx + 1}</div>
                                    <button onClick={() => handleDelete(section.id, idx)} className="text-stone-400 hover:text-red-600 p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                {section.id === 'team' && (
                                    <>
                                        <InputField label="Name" path={['team', idx.toString(), 'name']} />
                                        <InputField label="Role" path={['team', idx.toString(), 'role']} />
                                        <TextAreaField label="Intro" path={['team', idx.toString(), 'intro']} />
                                        <ImageUploadField label="Photo" path={['team', idx.toString(), 'image']} />
                                    </>
                                )}
                                {section.id === 'news' && (
                                    <>
                                        <InputField label="Title" path={['news', idx.toString(), 'title']} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <InputField label="Date" path={['news', idx.toString(), 'date']} />
                                            <InputField label="Cat" path={['news', idx.toString(), 'category']} />
                                        </div>
                                    </>
                                )}
                                {section.id === 'products' && (
                                    <>
                                        <InputField label="Name" path={['products', idx.toString(), 'name']} />
                                        <InputField label="Cat" path={['products', idx.toString(), 'category']} />
                                        <TextAreaField label="Desc" path={['products', idx.toString(), 'description']} />
                                        <ImageUploadField label="Img" path={['products', idx.toString(), 'image']} />
                                    </>
                                )}
                                {section.id === 'projects' && (
                                    <>
                                        <InputField label="Name" path={['projects', idx.toString(), 'name']} />
                                        <InputField label="Cat" path={['projects', idx.toString(), 'category']} />
                                        <ImageUploadField label="Img" path={['projects', idx.toString(), 'image']} />
                                    </>
                                )}
                            </div>
                        ))}
                        <button onClick={() => handleAdd(section.id)} className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-stone-300 text-stone-500 rounded-lg hover:border-stone-900 hover:text-stone-900 text-sm">
                            <Plus size={16} /> Add Item
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );

  function InputField({ label, path }: { label: string; path: string[] }) {
    let value: any = content;
    for (const key of path) value = value?.[key];
    return (
      <div className="space-y-1">
        <label className="text-xs uppercase font-bold text-stone-500">{label}</label>
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => updateNestedContent(path, e.target.value)}
          className="w-full p-2 text-sm border border-stone-200 rounded focus:border-stone-900 outline-none"
        />
      </div>
    );
  }

  function TextAreaField({ label, path }: { label: string; path: string[] }) {
      let value: any = content;
      for (const key of path) value = value?.[key];
      return (
        <div className="space-y-1">
          <label className="text-xs uppercase font-bold text-stone-500">{label}</label>
          <textarea
            value={value as string || ''}
            onChange={(e) => updateNestedContent(path, e.target.value)}
            rows={3}
            className="w-full p-2 text-sm border border-stone-200 rounded focus:border-stone-900 outline-none resize-none"
          />
        </div>
      );
  }

  function ImageUploadField({ label, path }: { label: string; path: string[] }) {
     let value: any = content;
      for (const key of path) value = value?.[key];
    return (
        <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-stone-500">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-200 rounded overflow-hidden flex-shrink-0 relative">
                    {value ? <img src={value as string} className="w-full h-full object-cover" /> : <div className="text-[10px] p-1">No Img</div>}
                </div>
                <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center w-full px-3 py-2 text-xs border border-dashed border-stone-300 rounded hover:border-stone-900">
                        <ImageIcon size={14} className="mr-2" /> <span>Change</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, path)} />
                </label>
            </div>
        </div>
    )
  }
};
