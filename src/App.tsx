import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LogoStrip } from './components/LogoStrip';
import { About } from './components/About';
import { Services } from './components/Services';
import { Possibilities } from './components/Possibilities';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f3f3f3] selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Hero />
        {}
        <LogoStrip />
        <About />
        <Services />
        <Possibilities />
      </main>
      <Footer />
    </div>
  );
}