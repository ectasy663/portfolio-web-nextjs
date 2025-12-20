import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Achievements from '@/components/Achievements';
import Contact from '@/components/Contact';
import PageEffects from '@/components/PageEffects';

export default function HomePage() {
  return (
    <div className="App">
      <aside aria-label="Page effects">
        <PageEffects />
      </aside>
      <Navigation />
      <main className="pt-20 relative z-0">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Contact />
      </main>
    </div>
  );
}
