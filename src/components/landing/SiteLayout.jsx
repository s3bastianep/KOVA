import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function SiteLayout({ children, className = '' }) {
  return (
    <div className={`kova-landing-wave min-h-screen antialiased flex flex-col${className ? ` ${className}` : ''}`}>
      <Navbar />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer variant="wave" />
    </div>
  );
}
