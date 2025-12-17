import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, Instagram, Facebook, Twitter, Camera, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { settings } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-surface shadow-md py-2' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo reloads the page via href instead of Link */}
        <a href="/" className="flex items-center gap-2 z-50">
           {settings.logoUrl ? (
             <img 
               src={settings.logoUrl} 
               alt={settings.siteName} 
               style={{ height: `${settings.logoHeight}px` }}
               className={`w-auto transition-all duration-300 ${
                 isScrolled 
                   ? 'dark:brightness-100 invert dark:invert-0' // Invert white logo to black on light scroll; keep white on dark scroll
                   : 'brightness-100' // Keep white on transparent
               }`} 
             />
           ) : (
             <>
               <Camera className={`w-8 h-8 ${isScrolled ? 'text-primary' : 'text-white'}`} />
               <span className={`text-2xl font-heading font-bold tracking-tighter ${isScrolled ? 'text-text' : 'text-white drop-shadow-md'}`}>
                 {settings.siteName}
               </span>
             </>
           )}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-semibold uppercase tracking-widest hover:text-primary transition-colors ${isScrolled ? 'text-text' : 'text-white drop-shadow-md'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className={`w-8 h-8 ${isScrolled ? 'text-text' : 'text-white'}`} /> : <Menu className={`w-8 h-8 ${isScrolled ? 'text-text' : 'text-white'}`} />}
        </button>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-surface flex flex-col items-center justify-center gap-8 transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
          {navLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              className="text-2xl font-heading text-text hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  const { settings } = useApp();
  
  return (
    <footer className="bg-[#111] text-gray-300 py-16">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={settings.siteName} 
              style={{ height: `${settings.logoHeight}px` }}
              className="w-auto mb-4" 
            />
          ) : (
            <h3 className="text-2xl font-heading text-white">{settings.siteName}</h3>
          )}
          <p className="text-sm leading-relaxed text-gray-400">
            {settings.tagline}. We specialize in capturing the essence of life's most beautiful moments across the globe.
          </p>
          <div className="flex gap-4 pt-4">
            <a href={settings.socialLinks.instagram} className="hover:text-white transition-colors" title="Instagram"><Instagram size={20} /></a>
            <a href={settings.socialLinks.facebook} className="hover:text-white transition-colors" title="Facebook"><Facebook size={20} /></a>
            <a href={settings.socialLinks.twitter} className="hover:text-white transition-colors" title="Twitter"><Twitter size={20} /></a>
            <a href={settings.socialLinks.whatsapp} className="hover:text-green-400 transition-colors" title="WhatsApp"><MessageCircle size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-white transition-colors">Wedding Photography</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Pre-Wedding Shoots</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Fashion Editorial</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Maternity</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-1 shrink-0" />
              <span>{settings.contactAddress}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} />
              <span>{settings.contactPhone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} />
              <span>{settings.contactEmail}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Newsletter</h4>
          <p className="text-sm mb-4 text-gray-400">Subscribe for updates and photography tips.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-[#222] text-white px-4 py-2 w-full focus:outline-none border border-[#333] focus:border-white transition-colors"
            />
            <button className="bg-white text-black px-4 py-2 font-bold hover:bg-gray-200 transition-colors">
              JOIN
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 pt-12 mt-12 border-t border-[#222] text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} {settings.siteName}. All Rights Reserved. <Link to="/admin" className="ml-4 opacity-50 hover:opacity-100">Admin</Link>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};