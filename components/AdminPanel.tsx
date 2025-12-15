import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Settings, X, Image as ImageIcon, ChevronRight, ChevronDown, Trash2, Plus, Save, LogOut, RotateCcw, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminPanel: React.FC = () => {
  const { content, updateContent, updateNestedContent, saveContent, resetContent } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Listen for the custom event from Footer to open login
  useEffect(() => {
    const handleOpenLogin = () => setShowLoginModal(true);
    window.addEventListener('open-admin-login', handleOpenLogin);
    return () => window.removeEventListener('open-admin-login', handleOpenLogin);
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin') { // Simple hardcoded password
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setIsOpen(true);
      setErrorMsg('');
      setPasswordInput('');
    } else {
      setErrorMsg('密码错误 (Password Incorrect)');
    }
  };

  // Handle Save
  const handleSave = () => {
    saveContent();
    alert('修改已保存！\nChanges saved successfully.');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOpen(false);
  };

  // Handle Image Upload (Convert to Base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, path: string[]) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateNestedContent(path, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (sectionId: string) => {
    const currentArray = (content as any)[sectionId];
    const id = Date.now().toString();
    let newItem = {};

    switch (sectionId) {
      case 'team':
        newItem = { 
          id, 
          name: 'New Member', 
          role: 'Position', 
          intro: 'Introduction text goes here.', 
          image: 'https://aistudiocdn.com/images/placeholder-portrait.jpg' // Default placeholder
        };
        break;
      case 'news':
        newItem = { 
          id, 
          title: 'New Article Title', 
          date: new Date().toISOString().slice(0, 7), 
          category: 'News', 
          link: '#' 
        };
        break;
      case 'products':
        newItem = { 
            id, 
            category: 'New Series', 
            name: 'New Product', 
            description: 'Product description.', 
            image: 'https://aistudiocdn.com/images/placeholder.jpg' 
        };
        break;
      case 'projects':
        newItem = { 
            id, 
            name: 'New Project', 
            category: 'Residence', 
            year: '2025', 
            image: 'https://aistudiocdn.com/images/placeholder.jpg' 
        };
        break;
      default:
        return;
    }

    updateContent(sectionId as any, [...currentArray, newItem]);
  };

  const handleDelete = (sectionId: string, index: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        const currentArray = (content as any)[sectionId];
        const newArray = currentArray.filter((_: any, idx: number) => idx !== index);
        updateContent(sectionId as any, newArray);
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

  // Render Login Modal
  if (showLoginModal && !isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm"
        >
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
               <Lock size={20} /> 管理员登录
             </h2>
             <button onClick={() => setShowLoginModal(false)}><X size={20} /></button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-2 border border-stone-200 rounded focus:border-stone-900 outline-none"
                placeholder="Enter admin password"
                autoFocus
              />
              {errorMsg && <p className="text-red-500 text-xs mt-1">{errorMsg}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full py-2 bg-stone-900 text-white font-medium rounded hover:bg-stone-700 transition-colors"
            >
              Unlock Editor
            </button>
            <div className="text-center text-xs text-stone-400 mt-2">
                默认密码: admin
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // If not authenticated and not showing modal, show nothing (Hidden)
  if (!isAuthenticated) return null;

  // Floating Trigger (Only visible when authenticated)
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[100] bg-stone-900 text-white p-4 rounded-full shadow-2xl hover:bg-stone-800 transition-colors"
        title="Edit Content"
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
           <div className="flex items-center gap-2 text-[10px] text-stone-400">
             <span className="w-2 h-2 rounded-full bg-green-500"></span> Authenticated
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
          <button 
            onClick={resetContent}
            className="flex items-center gap-2 text-xs text-red-600 hover:text-red-800 font-medium"
            title="Reset to default"
          >
             <RotateCcw size={14} /> 重置
          </button>
          <button 
             onClick={handleSave}
             className="flex items-center gap-2 bg-stone-900 text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-green-700 transition-colors shadow-sm"
          >
             <Save size={14} /> 保存修改
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
                    {/* Singleton Sections */}
                    {section.id === 'hero' && (
                      <>
                        <InputField label="Title" path={['hero', 'title']} />
                        <InputField label="Subtitle" path={['hero', 'subtitle']} />
                        <TextAreaField label="Description" path={['hero', 'description']} />
                        <ImageUploadField label="Background Image" path={['hero', 'backgroundImage']} />
                      </>
                    )}
                     {section.id === 'about' && (
                      <>
                        <InputField label="Heading" path={['about', 'heading']} />
                        <TextAreaField label="Paragraph 1" path={['about', 'paragraph1']} />
                         <ImageUploadField label="About Image" path={['about', 'image']} />
                      </>
                    )}
                     {section.id === 'company' && (
                        <>
                           <InputField label="Company Name" path={['company', 'name']} />
                           <InputField label="Address" path={['company', 'address']} />
                        </>
                     )}

                    {/* Array Sections */}
                    {section.isArray && (
                      <div className="space-y-6">
                        {(content as any)[section.id].map((item: any, idx: number) => (
                            <div key={item.id || idx} className="relative p-4 bg-stone-50 rounded-lg space-y-3 border border-stone-100">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-xs font-bold text-stone-400 uppercase">Item {idx + 1}</div>
                                    <button 
                                        onClick={() => handleDelete(section.id, idx)}
                                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {/* Team Fields */}
                                {section.id === 'team' && (
                                    <>
                                        <InputField label="Name" path={['team', idx.toString(), 'name']} />
                                        <InputField label="Role" path={['team', idx.toString(), 'role']} />
                                        <TextAreaField label="Intro" path={['team', idx.toString(), 'intro']} />
                                        <ImageUploadField label="Photo" path={['team', idx.toString(), 'image']} />
                                    </>
                                )}

                                {/* News Fields */}
                                {section.id === 'news' && (
                                    <>
                                        <InputField label="Title" path={['news', idx.toString(), 'title']} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <InputField label="Date" path={['news', idx.toString(), 'date']} />
                                            <InputField label="Category" path={['news', idx.toString(), 'category']} />
                                        </div>
                                        <InputField label="Link" path={['news', idx.toString(), 'link']} />
                                    </>
                                )}

                                {/* Product Fields */}
                                {section.id === 'products' && (
                                    <>
                                        <InputField label="Name" path={['products', idx.toString(), 'name']} />
                                        <InputField label="Category" path={['products', idx.toString(), 'category']} />
                                        <TextAreaField label="Description" path={['products', idx.toString(), 'description']} />
                                        <ImageUploadField label="Image" path={['products', idx.toString(), 'image']} />
                                    </>
                                )}

                                {/* Project Fields */}
                                {section.id === 'projects' && (
                                    <>
                                        <InputField label="Name" path={['projects', idx.toString(), 'name']} />
                                        <div className="grid grid-cols-2 gap-2">
                                            <InputField label="Category" path={['projects', idx.toString(), 'category']} />
                                            <InputField label="Year" path={['projects', idx.toString(), 'year']} />
                                        </div>
                                        <ImageUploadField label="Image" path={['projects', idx.toString(), 'image']} />
                                    </>
                                )}
                            </div>
                        ))}
                        
                        <button 
                            onClick={() => handleAdd(section.id)}
                            className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-stone-300 text-stone-500 rounded-lg hover:border-stone-900 hover:text-stone-900 transition-colors text-sm font-medium"
                        >
                            <Plus size={16} /> Add New Item
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
      
      <div className="p-4 bg-stone-100 text-xs text-stone-500 text-center border-t border-stone-200">
          编辑模式已开启 | Authenticated
      </div>
    </div>
  );

  function InputField({ label, path }: { label: string; path: string[] }) {
    let value: any = content;
    for (const key of path) {
        if (value) value = value[key];
    }

    return (
      <div className="space-y-1">
        <label className="text-xs uppercase font-bold text-stone-500">{label}</label>
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => updateNestedContent(path, e.target.value)}
          className="w-full p-2 text-sm border border-stone-200 rounded focus:outline-none focus:border-stone-900 transition-colors"
        />
      </div>
    );
  }

  function TextAreaField({ label, path }: { label: string; path: string[] }) {
      let value: any = content;
      for (const key of path) {
          if (value) value = value[key];
      }
      return (
        <div className="space-y-1">
          <label className="text-xs uppercase font-bold text-stone-500">{label}</label>
          <textarea
            value={value as string || ''}
            onChange={(e) => updateNestedContent(path, e.target.value)}
            rows={3}
            className="w-full p-2 text-sm border border-stone-200 rounded focus:outline-none focus:border-stone-900 transition-colors resize-none"
          />
        </div>
      );
  }

  function ImageUploadField({ label, path }: { label: string; path: string[] }) {
     let value: any = content;
      for (const key of path) {
          if (value) value = value[key];
      }

    return (
        <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-stone-500">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-stone-200 rounded overflow-hidden flex-shrink-0 relative">
                    {value ? (
                        <img src={value as string} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-[10px]">No Img</div>
                    )}
                </div>
                <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center w-full px-3 py-2 text-xs border border-dashed border-stone-300 rounded text-stone-500 hover:border-stone-900 hover:text-stone-900 transition-colors">
                        <ImageIcon size={14} className="mr-2" />
                        <span>Change Photo</span>
                    </div>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageUpload(e, path)}
                    />
                </label>
            </div>
        </div>
    )
  }
};