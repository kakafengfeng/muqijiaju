
import { SiteContent } from './types';

// DATA PANEL: Edit this object to change website content
export const CONTENT: SiteContent = {
  nav: [
    { label: "关于", href: "#about" },
    { label: "品牌", href: "#brand" },
    { label: "产品", href: "#products" },
    { label: "项目", href: "#projects" },
    { label: "团队", href: "#team" },
    { label: "新闻", href: "#news" },
    { label: "联系", href: "#contact" },
  ],
  hero: {
    title: "木栖家居 — 只为美好关系",
    subtitle: "Make better connections",
    description: "在细微之处重塑空间秩序，以极简美学演绎东方哲学。我们创造的不只是家具，而是恒久的生活温度。",
    ctaPrimary: "了解更多",
    ctaSecondary: "联系我们",
    // 1920x900 placeholder
    backgroundImage: "https://picsum.photos/id/23/1920/1080" 
  },
  about: {
    title: "About Us",
    heading: "重构生活美学",
    paragraph1: "木栖家居科技（上海）有限公司，致力于提供高品质的居家生活与智能定制解决方案。我们坚信，家是人与世界连接的起点，也是内心回归的终点。",
    paragraph2: "我们汇聚全球顶尖设计力量，融合精湛工艺与现代科技，为您打造独一无二的居住体验。每一处细节，皆是对完美的极致追求。",
    cta: "阅读我们的故事",
    image: "https://picsum.photos/id/42/800/1000"
  },
  products: [
    {
      id: "01",
      category: "Door System",
      name: "隐形门系统",
      description: "无界设计，空间延伸的艺术。",
      image: "https://picsum.photos/id/234/800/600"
    },
    {
      id: "02",
      category: "Wall System",
      name: "木饰面护墙",
      description: "温润触感，定义空间基调。",
      image: "https://picsum.photos/id/352/800/600"
    },
    {
      id: "03",
      category: "Cabinet System",
      name: "高定收纳",
      description: "理性秩序与感性美学的平衡。",
      image: "https://picsum.photos/id/449/800/600"
    },
    {
      id: "04",
      category: "Smart Home",
      name: "智能中控",
      description: "科技隐于无形，服务生活。",
      image: "https://picsum.photos/id/180/800/600"
    }
  ],
  projects: [
    {
      id: "p1",
      name: "上海·云顶别墅",
      category: "Private Residence",
      year: "2024",
      image: "https://picsum.photos/id/101/800/800"
    },
    {
      id: "p2",
      name: "杭州·西溪艺术馆",
      category: "Public Space",
      year: "2023",
      image: "https://picsum.photos/id/202/800/800"
    },
    {
      id: "p3",
      name: "北京·壹号院",
      category: "Showroom",
      year: "2024",
      image: "https://picsum.photos/id/305/800/800"
    }
  ],
  team: [
    {
      id: "t1",
      name: "林一鸣",
      role: "创始人 / 首席设计师",
      intro: "20年高端家居设计经验，曾获红点设计大奖。致力于探索东方美学与现代生活的平衡。",
      image: "https://picsum.photos/id/1005/600/800"
    },
    {
      id: "t2",
      name: "王广大",
      role: "设计总监",
      intro: "前意大利著名家居品牌主理人，专注于极简主义美学与功能性的完美融合。",
      image: "https://picsum.photos/id/338/600/800"
    },
    {
      id: "t3",
      name: "张艳慧",
      role: "工艺总监",
      intro: "匠心独运，对材质与细节有着极致的追求，确保每一件作品都经得起时间的考验。",
      image: "https://picsum.photos/id/64/600/800"
    }
  ],
  departments: [
    {
      id: "d1",
      department: "销售部",
      manager: "郑晓博",
      members: [
        { 
          id: "d1-m1", 
          name: "王丽娜", 
          role: "销售经理", 
          intro: "倾听客户需求，提供最温暖的家居方案。", 
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d1-m2", 
          name: "王丽艳", 
          role: "高级顾问", 
          intro: "专业与热情并重，为您排忧解难。", 
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d1-m3", 
          name: "王南南", 
          role: "客户经理", 
          intro: "致力于建立长期的客户信任关系。", 
          image: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f8e?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d1-m4", 
          name: "李秦严", 
          role: "销售代表", 
          intro: "用真诚的服务打动每一位客户。", 
          image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d1-m5", 
          name: "费宏娜", 
          role: "商务助理", 
          intro: "细致入微，确保每一个环节完美衔接。", 
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600&h=800" 
        }
      ]
    },
    {
      id: "d2",
      department: "设计部",
      manager: "王广大",
      members: [
        { 
          id: "d2-m1", 
          name: "尤艳涛", 
          role: "主案设计师", 
          intro: "设计不只是视觉，更是生活的艺术。", 
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d2-m2", 
          name: "石立菊", 
          role: "空间规划师", 
          intro: "在有限的空间里创造无限的可能。", 
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d2-m3", 
          name: "王秦琳", 
          role: "软装设计师", 
          intro: "色彩与材质的碰撞，激发生活灵感。", 
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d2-m4", 
          name: "王舒淼", 
          role: "深化设计师", 
          intro: "专注细节，将设计图纸完美落地。", 
          image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d2-m5", 
          name: "邢旺", 
          role: "3D渲染师", 
          intro: "用光影还原真实的未来家园。", 
          image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d2-m6", 
          name: "周颖", 
          role: "设计师", 
          intro: "创新是设计的灵魂。", 
          image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d2-m7", 
          name: "林泉", 
          role: "设计助理", 
          intro: "学习与成长，为设计注入新活力。", 
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600&h=800" 
        }
      ]
    },
    {
      id: "d3",
      department: "安装部",
      manager: "刘潘潘",
      members: [
        { 
          id: "d3-m1", 
          name: "王明鑫", 
          role: "安装组长", 
          intro: "精准安装，确保每一毫米的严丝合缝。", 
          image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d3-m2", 
          name: "张雄", 
          role: "高级技师", 
          intro: "经验丰富，解决各种现场难题。", 
          image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
          id: "d3-m3", 
          name: "潘小玲", 
          role: "安装调度", 
          intro: "统筹安排，保证工期按时交付。", 
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600&h=800" 
        },
        { 
            id: "d3-m4",
            name: "张靓靓",
            role: "技师",
            intro: "匠心工艺，追求卓越。",
            image: "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?auto=format&fit=crop&q=80&w=600&h=800"
        },
        {
            id: "d3-m5",
            name: "韩伪南",
            role: "技师",
            intro: "严谨细致，服务至上。",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=800"
        },
        {
             id: "d3-m6",
             name: "秦超磊",
             role: "技师",
             intro: "专业技术，品质保障。",
             image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600&h=800"
        },
        {
             id: "d3-m7",
             name: "王华伟",
             role: "技师",
             intro: "脚踏实地，精益求精。",
             image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=800"
        },
        {
             id: "d3-m8",
             name: "皇凡磊",
             role: "技师",
             intro: "用心服务，客户满意。",
             image: "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&q=80&w=600&h=800"
        }
      ]
    },
    {
      id: "d4",
      department: "物流部",
      manager: "周阳",
      members: [
        { id: "d4-m1", name: "依鹏", role: "物流专员", intro: "安全送达，风雨无阻。", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=600&h=800" },
        { id: "d4-m2", name: "周连成", role: "仓储主管", intro: "井井有条，高效流转。", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=600&h=800" },
        { id: "d4-m3", name: "王泽有", role: "物流司机", intro: "准时送达，使命必达。", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600&h=800" },
        { id: "d4-m4", name: "王文博", role: "配送员", intro: "细心搬运，呵护每一件家具。", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=600&h=800" }
      ]
    },
    {
      id: "d5",
      department: "下单部",
      members: [
        { id: "d5-m1", name: "张艳慧", role: "下单主管", intro: "精准核对，源头把控。", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600&h=800" }
      ]
    },
    {
      id: "d6",
      department: "调度员",
      members: [
        { id: "d6-m1", name: "陈莲红", role: "总调度", intro: "运筹帷幄，统筹全局。", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600&h=800" }
      ]
    },
    {
      id: "d7",
      department: "财务部",
      members: [
        { id: "d7-m1", name: "陈吉", role: "财务经理", intro: "严谨合规，为企业护航。", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800" }
      ]
    }
  ],
  news: [
    {
      id: "n1",
      title: "木栖家居新品发布会：重塑边界",
      date: "2025-11",
      category: "Events",
      link: "#"
    },
    {
      id: "n2",
      title: "荣获2024年度国际设计金奖",
      date: "2024-10",
      category: "Awards",
      link: "#"
    },
    {
      id: "n3",
      title: "关于木材可持续发展的企业承诺",
      date: "2024-09",
      category: "Sustainability",
      link: "#"
    }
  ],
  company: {
    name: "木栖家居科技（上海）有限公司",
    nameEn: "Muqi Home Technology (Shanghai) Co., Ltd.",
    address: "上海市徐汇区宜山路家饰佳4033展位",
    copyright: "© 2025 Muqi Home Technology. All rights reserved.",
    icp: "沪ICP备××××××号",
    socials: {
      wechat: "#",
      weibo: "#",
      linkedin: "#",
      instagram: "#"
    }
  }
};
