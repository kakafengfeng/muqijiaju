
export interface NavItem {
  label: string;
  href: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  backgroundImage: string;
  titleEn?: string;
  subtitleEn?: string;
  descriptionEn?: string;
  ctaPrimaryEn?: string;
  ctaSecondaryEn?: string;
}

export interface AboutContent {
  title: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  cta: string;
  image: string;
  cards?: AboutCard[];
  headingEn?: string;
  paragraph1En?: string;
  paragraph2En?: string;
  ctaEn?: string;
}

export interface AboutCard {
  id?: string;
  titleEn: string;
  titleZh: string;
  image: string;
  more: string;
}

export interface ProductItem {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  nameEn?: string;
  categoryEn?: string;
  descriptionEn?: string;
  /** 详情页文案（后台可编辑，空行分段）；以下均为可选，老数据缺失时详情页自动隐藏对应区块 */
  detail?: string;
  detailEn?: string;
  materials?: string;
  materialsEn?: string;
  dimensions?: string;
  dimensionsEn?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  image: string;
  /** 多图数组：详情弹窗可切换浏览；兼容旧数据（无该字段时退回单图） */
  images?: string[];
  year: string;
  nameEn?: string;
  categoryEn?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  intro: string;
  image: string;
  roleEn?: string;
  introEn?: string;
}

export interface DepartmentMember {
  id: string;
  name: string;
  role: string;
  intro: string;
  image: string;
  roleEn?: string;
  introEn?: string;
}

export interface Department {
  id: string;
  department: string;
  manager?: string;
  members: DepartmentMember[];
  departmentEn?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  link?: string;
  image?: string;
  titleEn?: string;
  categoryEn?: string;
  summary?: string;
  summaryEn?: string;
  content?: string;
  contentEn?: string;
}

export interface CompanyInfo {
  name: string;
  nameEn: string;
  address: string;
  addressEn?: string;
  copyright: string;
  icp: string;
  logo?: string;
  email?: string;
  phone?: string;
  phoneMobile?: string;
  socials: {
    wechat: string;
    qq: string;
    weibo: string;
    linkedin: string;
    instagram: string;
  };
}

export interface SiteContent {
  nav: NavItem[];
  hero: HeroContent;
  about: AboutContent;
  products: ProductItem[];
  projects: ProjectItem[];
  team: TeamMember[];
  departments: Department[];
  news: NewsItem[];
  company: CompanyInfo;
}
