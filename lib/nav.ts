/** 单页区块 id 与其路由别名的映射（品牌区块暂无独立内容，未列入） */
export const SECTION_ROUTES: Record<string, string> = {
  about: 'about',
  products: 'products',
  projects: 'projects',
  news: 'news',
  contact: 'contact',
};

/** 平滑滚动到指定区块 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
