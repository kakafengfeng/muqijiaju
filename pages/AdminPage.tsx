import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import {
  Settings, LogOut, Save, RotateCcw, Eye, Plus, Trash2, Image as ImageIcon,
  ChevronRight, Building2, Home, Users, Sofa, FolderKanban, Newspaper, CircleUserRound
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SECTION_META: { id: string; label: string; Icon: any; isArray?: boolean }[] = [
  { id: 'hero', label: '首页 Hero', Icon: Home },
  { id: 'about', label: '关于 About', Icon: CircleUserRound },
  { id: 'departments', label: '团队架构', Icon: Users },
  { id: 'products', label: '产品 Products', Icon: Sofa, isArray: true },
  { id: 'projects', label: '项目 Projects', Icon: FolderKanban, isArray: true },
  { id: 'news', label: '新闻 News', Icon: Newspaper, isArray: true },
  { id: 'company', label: '公司信息', Icon: Building2 },
];

export const AdminPage: React.FC = () => {
  const { content, updateContent, updateNestedContent, saveContent, resetContent, user, logout } = useContent();
  const [activeSection, setActiveSection] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // 未登录：通过 useEffect 跳回登录页（渲染期间直接 navigate 会导致空白页）
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveContent();
      window.alert('保存成功（已写入本机浏览器存储）');
    } catch (e) {
      console.error(e);
      window.alert('保存失败，请查看控制台');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAdd = (sectionId: string) => {
    const currentArray = (content as any)[sectionId];
    const id = Date.now().toString();
    let newItem: any = {};
    switch (sectionId) {
      case 'news':
        newItem = { id, title: '新文章标题', date: new Date().toISOString().slice(0, 7), category: '新闻', link: '#' };
        break;
      case 'products':
        newItem = { id, category: '系列', name: '新产品名称', description: '产品描述…', image: '' };
        break;
      case 'projects':
        newItem = { id, name: '新项目名称', category: '分类', year: '2026', image: '' };
        break;
      default:
        return;
    }
    updateContent(sectionId as any, [...currentArray, newItem]);
  };

  const handleDelete = (sectionId: string, index: number) => {
    if (window.confirm('确定删除该项？')) {
      const currentArray = (content as any)[sectionId];
      updateContent(sectionId as any, currentArray.filter((_: any, idx: number) => idx !== index));
    }
  };

  const handleAddDepartmentMember = (deptIndex: number) => {
    const departments = [...content.departments];
    const newMember = {
      id: `new-${Date.now()}`,
      name: '新成员',
      role: '职位',
      intro: '介绍…',
      image: '',
    };
    if (!departments[deptIndex].members) departments[deptIndex].members = [];
    departments[deptIndex].members.push(newMember);
    updateContent('departments', departments);
  };

  const handleDeleteDepartmentMember = (deptIndex: number, memberIndex: number) => {
    if (window.confirm('确定删除该成员？')) {
      const departments = [...content.departments];
      departments[deptIndex].members.splice(memberIndex, 1);
      updateContent('departments', departments);
    }
  };

  const handleAddAboutCard = () => {
    const cards = [...(content.about.cards || [])];
    cards.push({
      id: `c-${Date.now()}`,
      titleEn: 'English Title',
      titleZh: '中文标题',
      image: '',
      more: '了解更多',
    });
    updateContent('about', { ...content.about, cards });
  };

  const handleDeleteAboutCard = (index: number) => {
    if (window.confirm('确定删除该卡片？')) {
      const cards = [...(content.about.cards || [])];
      cards.splice(index, 1);
      updateContent('about', { ...content.about, cards });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, path: string[]) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // SVG 矢量图：直接保留原始文件（透明背景），不做 canvas 压缩
    if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = () => updateNestedContent(path, reader.result as string);
      reader.readAsDataURL(file);
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const MAX_EDGE = 800;
        let { width, height } = img;
        if (Math.max(width, height) > MAX_EDGE) {
          const scale = MAX_EDGE / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, 0.82);
        updateNestedContent(path, dataUrl);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  };

  const active = SECTION_META.find((s) => s.id === activeSection) || SECTION_META[0];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* 顶栏 */}
      <header className="bg-stone-900 text-white px-6 py-3 flex justify-between items-center shadow-lg z-20">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-amber-400" />
          <div>
            <h1 className="text-base font-bold tracking-widest uppercase leading-tight">MUQI CMS 后台管理</h1>
            <div className="flex items-center gap-2 text-[10px] text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online: {user.email}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white transition-colors px-3 py-1.5 rounded border border-stone-700 hover:border-stone-500"
          >
            <Eye size={14} /> 查看网站
          </button>
          <button
            onClick={resetContent}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5"
          >
            <RotateCcw size={14} /> 恢复默认
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-stone-900 px-4 py-1.5 rounded text-xs font-bold transition-colors shadow disabled:opacity-50"
          >
            <Save size={14} /> {isSaving ? '保存中…' : '保存'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-red-400 transition-colors px-3 py-1.5"
          >
            <LogOut size={14} /> 退出
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 左侧菜单 */}
        <aside className="w-56 bg-white border-r border-stone-200 py-4 flex flex-col overflow-y-auto">
          <p className="px-5 pb-3 text-[10px] uppercase tracking-widest text-stone-400 font-bold">内容模块</p>
          {SECTION_META.map((s) => {
            const Icon = s.Icon;
            const isActive = s.id === activeSection;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <Icon size={16} />
                <span className="flex-1">{s.label}</span>
                <ChevronRight size={14} className={isActive ? 'text-amber-400' : 'text-stone-300'} />
              </button>
            );
          })}
          <div className="mt-auto px-5 pt-4 text-[10px] text-stone-400 leading-relaxed">
            数据保存在本机浏览器。
            <br />
            刷新/重新打开不丢失。
          </div>
        </aside>

        {/* 右侧编辑区 */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-stone-900 mb-1">{active.label}</h2>
            <p className="text-xs text-stone-400 mb-6">修改后点击右上角「保存」生效</p>

            {/* Hero */}
            {active.id === 'hero' && (
              <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
                <InputField label="主标题" path={['hero', 'title']} />
                <InputField label="副标题" path={['hero', 'subtitle']} />
                <TextAreaField label="描述文字" path={['hero', 'description']} />
                <ImageUploadField label="背景大图" path={['hero', 'backgroundImage']} />
              </div>
            )}

            {/* About */}
            {active.id === 'about' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
                  <InputField label="区块标题" path={['about', 'heading']} />
                  <TextAreaField label="正文段落 1" path={['about', 'paragraph1']} />
                  <ImageUploadField label="配图" path={['about', 'image']} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 pt-2">
                  四图卡片（每张可单独替换图片 / 中英文标题）
                </p>
                {(content.about.cards || []).map((card, cardIdx) => (
                  <div key={card.id || cardIdx} className="relative bg-white rounded-lg border border-stone-200 p-5 space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-bold text-stone-400 uppercase">卡片 #{cardIdx + 1}</div>
                      <button
                        onClick={() => handleDeleteAboutCard(cardIdx)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        title="删除卡片"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField label="英文标题" path={['about', 'cards', cardIdx.toString(), 'titleEn']} />
                      <InputField label="中文标题" path={['about', 'cards', cardIdx.toString(), 'titleZh']} />
                    </div>
                    <InputField label="More 文字" path={['about', 'cards', cardIdx.toString(), 'more']} />
                    <ImageUploadField label="图片" path={['about', 'cards', cardIdx.toString(), 'image']} />
                  </div>
                ))}
                <button
                  onClick={handleAddAboutCard}
                  className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-stone-300 text-stone-500 rounded-lg hover:border-stone-900 hover:text-stone-900 text-sm transition-colors bg-white"
                >
                  <Plus size={16} /> 添加卡片
                </button>
              </div>
            )}

            {/* Departments */}
            {active.id === 'departments' && (
              <div className="space-y-5">
                {content.departments.map((dept, deptIdx) => (
                  <div key={dept.id || deptIdx} className="bg-white rounded-lg border border-stone-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-stone-900">{dept.department}</h4>
                      <div className="w-48">
                        <InputField label="负责人" path={['departments', deptIdx.toString(), 'manager']} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">成员列表</p>
                      {dept.members?.map((member, memIdx) => (
                        <div key={member.id || memIdx} className="relative bg-stone-50 border border-stone-100 rounded p-3">
                          <button
                            onClick={() => handleDeleteDepartmentMember(deptIdx, memIdx)}
                            className="absolute top-2 right-2 text-stone-400 hover:text-red-500 transition-colors"
                            title="删除成员"
                          >
                            <Trash2 size={13} />
                          </button>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <InputField label="姓名" path={['departments', deptIdx.toString(), 'members', memIdx.toString(), 'name']} />
                            <InputField label="职位" path={['departments', deptIdx.toString(), 'members', memIdx.toString(), 'role']} />
                          </div>
                          <TextAreaField label="个人介绍" path={['departments', deptIdx.toString(), 'members', memIdx.toString(), 'intro']} />
                          <div className="mt-2">
                            <ImageUploadField label="照片" path={['departments', deptIdx.toString(), 'members', memIdx.toString(), 'image']} />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleAddDepartmentMember(deptIdx)}
                        className="w-full py-2 text-xs border border-dashed border-stone-300 rounded hover:bg-white hover:border-stone-900 transition-colors flex items-center justify-center gap-1 text-stone-500 hover:text-stone-900"
                      >
                        <Plus size={12} /> 添加成员
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Company */}
            {active.id === 'company' && (
              <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4">
                <InputField label="公司名称" path={['company', 'name']} />
                <InputField label="英文名称" path={['company', 'nameEn']} />
                <InputField label="地址" path={['company', 'address']} />
                <InputField label="邮箱" path={['company', 'email']} />
                <InputField label="电话" path={['company', 'phone']} />
                <InputField label="手机" path={['company', 'phoneMobile']} />
                <InputField label="备案号 ICP" path={['company', 'icp']} />
                <InputField label="版权信息" path={['company', 'copyright']} />
                <ImageUploadField label="公司 Logo" path={['company', 'logo']} />
                <div className="border-t border-stone-100 pt-4 space-y-4">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">社交链接（可配置加人）</p>
                  <InputField label="微信链接" path={['company', 'socials', 'wechat']} />
                  <InputField label="QQ 链接" path={['company', 'socials', 'qq']} />
                </div>
              </div>
            )}

            {/* 数组类：products / projects / news */}
            {active.isArray && (
              <div className="space-y-4">
                {(content as any)[active.id].map((item: any, idx: number) => (
                  <div key={item.id || idx} className="relative bg-white rounded-lg border border-stone-200 p-5 space-y-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-bold text-stone-400 uppercase">#{idx + 1}</div>
                      <button onClick={() => handleDelete(active.id, idx)} className="text-stone-400 hover:text-red-600 p-1 transition-colors" title="删除该项">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {active.id === 'news' && (
                      <>
                        <InputField label="标题" path={['news', idx.toString(), 'title']} />
                        <div className="grid grid-cols-2 gap-2">
                          <InputField label="日期" path={['news', idx.toString(), 'date']} />
                          <InputField label="分类" path={['news', idx.toString(), 'category']} />
                        </div>
                      </>
                    )}
                    {active.id === 'products' && (
                      <>
                        <InputField label="名称" path={['products', idx.toString(), 'name']} />
                        <InputField label="分类" path={['products', idx.toString(), 'category']} />
                        <TextAreaField label="描述" path={['products', idx.toString(), 'description']} />
                        <ImageUploadField label="图片" path={['products', idx.toString(), 'image']} />
                      </>
                    )}
                    {active.id === 'projects' && (
                      <>
                        <InputField label="名称" path={['projects', idx.toString(), 'name']} />
                        <div className="grid grid-cols-2 gap-2">
                          <InputField label="分类" path={['projects', idx.toString(), 'category']} />
                          <InputField label="年份" path={['projects', idx.toString(), 'year']} />
                        </div>
                        <ImageUploadField label="图片" path={['projects', idx.toString(), 'image']} />
                      </>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleAdd(active.id)}
                  className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-stone-300 text-stone-500 rounded-lg hover:border-stone-900 hover:text-stone-900 text-sm transition-colors bg-white"
                >
                  <Plus size={16} /> 添加一条
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );

  function InputField({ label, path }: { label: string; path: string[] }) {
    let value: any = content;
    for (const key of path) {
      if (value && value[key] !== undefined) value = value[key];
      else value = '';
    }
    return (
      <div className="space-y-1 w-full">
        <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">{label}</label>
        <input
          type="text"
          value={value as string || ''}
          onChange={(e) => updateNestedContent(path, e.target.value)}
          className="w-full p-2.5 text-sm border border-stone-200 rounded focus:border-stone-900 outline-none bg-white"
        />
      </div>
    );
  }

  function TextAreaField({ label, path }: { label: string; path: string[] }) {
    let value: any = content;
    for (const key of path) {
      if (value && value[key] !== undefined) value = value[key];
      else value = '';
    }
    return (
      <div className="space-y-1 w-full">
        <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">{label}</label>
        <textarea
          value={value as string || ''}
          onChange={(e) => updateNestedContent(path, e.target.value)}
          rows={3}
          className="w-full p-2.5 text-sm border border-stone-200 rounded focus:border-stone-900 outline-none resize-y bg-white"
        />
      </div>
    );
  }

  function ImageUploadField({ label, path }: { label: string; path: string[] }) {
    let value: any = content;
    for (const key of path) {
      if (value && value[key] !== undefined) value = value[key];
      else value = '';
    }
    return (
      <div className="space-y-2 w-full">
        <label className="block text-[10px] uppercase tracking-widest font-bold text-stone-400">{label}</label>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-stone-100 rounded overflow-hidden flex-shrink-0 relative border border-stone-200">
            {value ? (
              <img src={value as string} alt={label} className="w-full h-full object-cover" />
            ) : (
              <div className="text-[8px] p-1 text-center mt-4 text-stone-400">无图</div>
            )}
          </div>
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center justify-center w-full px-3 py-2 text-xs border border-dashed border-stone-300 rounded hover:border-stone-900 hover:text-stone-900 text-stone-500 bg-white transition-colors">
              <ImageIcon size={14} className="mr-2" /> 上传图片（自动压缩至 800px）
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, path)} />
          </label>
        </div>
      </div>
    );
  }
};

export default AdminPage;
