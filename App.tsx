
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { DepartmentGrid } from './components/DepartmentGrid';
import { ProductCarousel } from './components/ProductCarousel';
import { ProjectGrid } from './components/ProjectGrid';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { ProductDetail } from './pages/ProductDetail';
import { LoginPage } from './pages/LoginPage';
import { TeamPage } from './pages/TeamPage';
import { ContentProvider } from './context/ContentContext';
import { AdminPanel } from './components/AdminPanel';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage() {
  const location = useLocation();
  
  // Basic handling to scroll to section if path is like /about (simulating pages on a single landing)
  React.useEffect(() => {
    if (location.pathname === '/about') {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/products') {
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/projects') {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.pathname === '/news') {
        document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

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
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Route aliases for Single Page Experience */}
            <Route path="/about" element={<HomePage />} />
            <Route path="/brand" element={<HomePage />} />
            <Route path="/products" element={<HomePage />} />
            <Route path="/projects" element={<HomePage />} />
            <Route path="/news" element={<HomePage />} />
            <Route path="/contact" element={<HomePage />} />
            
            {/* Dedicated Pages */}
            <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /></>} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <AdminPanel />
        </div>
      </Router>
    </ContentProvider>
  );
}

export default App;
