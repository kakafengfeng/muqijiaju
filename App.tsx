
import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { DepartmentGrid } from './components/DepartmentGrid';
import { ProductCarousel } from './components/ProductCarousel';
import { ProjectGrid } from './components/ProjectGrid';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { ContentProvider } from './context/ContentContext';
import { SECTION_ROUTES, scrollToSection } from './lib/nav';

// 路由级代码分割：非首屏页面与后台面板按需加载
const ProductDetail = lazy(() =>
  import('./pages/ProductDetail').then((m) => ({ default: m.ProductDetail }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const TeamPage = lazy(() =>
  import('./pages/TeamPage').then((m) => ({ default: m.TeamPage }))
);
const AdminPanel = lazy(() =>
  import('./components/AdminPanel').then((m) => ({ default: m.AdminPanel }))
);

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-xs uppercase tracking-widest text-stone-400">Loading…</div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const isSectionAlias = SECTION_ROUTES[pathname.replace('/', '')] !== undefined;

  React.useEffect(() => {
    // 区块别名路由由 HomePage 负责滚动，避免“先跳顶再滚动”的闪烁
    if (!isSectionAlias) window.scrollTo(0, 0);
  }, [pathname, isSectionAlias]);
  return null;
}

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 处理导航目标：优先取路由 state 中的 scrollTo，其次按别名路径映射
  React.useEffect(() => {
    let target: string | null = null;
    const stateTarget = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (stateTarget) {
      target = stateTarget;
      // 滚动后清理 state，避免刷新/返回时重复滚动
      navigate(location.pathname, { replace: true, state: null });
    } else {
      const alias = location.pathname.replace('/', '');
      if (SECTION_ROUTES[alias]) target = SECTION_ROUTES[alias];
    }
    if (target) {
      const timer = setTimeout(() => scrollToSection(target), 60);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.state, navigate]);

  return (
    <>
      <Header />
      <Hero />
      <About />
      <DepartmentGrid />
      <ProductCarousel />
      <ProjectGrid />
      <NewsSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <ContentProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* 单页区块路由别名 */}
              <Route path="/about" element={<HomePage />} />
              <Route path="/products" element={<HomePage />} />
              <Route path="/projects" element={<HomePage />} />
              <Route path="/news" element={<HomePage />} />
              <Route path="/contact" element={<HomePage />} />

              {/* 独立页面 */}
              <Route
                path="/product/:id"
                element={
                  <>
                    <Header />
                    <ProductDetail />
                    <Footer />
                  </>
                }
              />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
            <AdminPanel />
          </Suspense>
        </div>
      </Router>
    </ContentProvider>
  );
}

export default App;
