import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ProductCarousel } from './components/ProductCarousel';
import { ProjectGrid } from './components/ProjectGrid';
import { TeamSection } from './components/TeamSection';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-900 selection:text-white">
      <Header />
      <main>
        <Hero />
        <About />
        <ProductCarousel />
        <ProjectGrid />
        <TeamSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;