/** 单页区块 id 与其路由别名的映射（品牌区块暂无独立内容，未列入；news/story/contact/projects 已升级为独立页面路由） */
export const SECTION_ROUTES: Record<string, string> = {
  about: 'about',
  products: 'products',
};

/** 滚动到指定区块；页面内锚点默认平滑过渡，跨页返回定位请传 'instant' 实现瞬间直达 */
export function scrollToSection(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: 'start' });
}
