
import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ProductCarousel } from './components/ProductCarousel';
import { ProjectGrid } from './components/ProjectGrid';
import { TeamSection } from './components/TeamSection';
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
  return (
    <>
      <Header />
      <Hero />
      <About />
      <ProductCarousel />
      <ProjectGrid />
      <TeamSection />
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
