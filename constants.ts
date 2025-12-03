import { SiteContent } from './types';

// DATA PANEL: Edit this object to change website content
export const CONTENT: SiteContent = {
  nav: [
    { label: "关于", href: "#about" },
    { label: "品牌", href: "#brand" },
    { label: "产品", href: "#products" },
    { label: "项目", href: "#projects" },
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
    address: "上海市静安区南京西路1266号恒隆广场",
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