
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
}

export interface AboutContent {
  title: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  cta: string;
  image: string;
}

export interface ProductItem {
  id: string;
  category: string;
  name: string;
  description: string;
  image: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  image: string;
  year: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  intro: string;
  image: string;
}

export interface DepartmentMember {
  id: string;
  name: string;
  role: string;
  intro: string;
  image: string;
}

export interface Department {
  id: string;
  department: string;
  manager?: string;
  members: DepartmentMember[];
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  link: string;
}

export interface CompanyInfo {
  name: string;
  nameEn: string;
  address: string;
  copyright: string;
  icp: string;
  logo?: string;
  socials: {
    wechat: string;
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