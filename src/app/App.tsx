import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuroraBackground } from '@/components/AuroraBackground';
import { HomePage } from './HomePage';

export default function App() {
  const handleNavigateHome = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="flex min-h-screen flex-col">
      <AuroraBackground />
      <Navbar onNavigateHome={handleNavigateHome} />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
