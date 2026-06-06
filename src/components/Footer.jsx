import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import MakooLogo from './MakooLogo';

const Footer = () => {
  const exploreLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/cakes', label: 'Cakes' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About' },
    { to: '/order', label: 'Order Online' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-navy-dark text-cream">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12">
          {/* Left Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <MakooLogo size={48} color="#C9A84C" />
              <div>
                <div className="font-display text-3xl font-bold tracking-tight">MAKOO BAKERY</div>
                <div className="text-sm text-gold/70 tracking-[0.15em] -mt-1">EST. 1988</div>
              </div>
            </div>
            <p className="text-sm text-cream/70 italic mb-6 max-w-xs">
              Baking Heritage Since 1988
            </p>

            <div className="flex gap-4 mb-8">
              <a
                href="https://facebook.com/MakooBakery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/makoobakery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 01-2.881 0 1.44 1.44 0 012.881 0z" />
                </svg>
              </a>
            </div>

            <div className="text-xs text-cream/50 tracking-widest">
              WEDDING CAKE SPECIALISTS • FRESH BAKES • QUICK BITES
            </div>
          </div>

          {/* Center: Explore */}
          <div className="md:col-span-3">
            <div className="font-sans text-xs font-medium text-gold tracking-[0.15em] uppercase mb-4">EXPLORE</div>
            <div className="space-y-2 text-sm">
              {exploreLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-cream/80 hover:text-cream transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Visit Us */}
          <div className="md:col-span-4">
            <div className="font-sans text-xs font-medium text-gold tracking-[0.15em] uppercase mb-4">VISIT US</div>
            
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-cream/90">Makoo Road, Jawalakhel, Lalitpur 44600</div>
                  <div className="text-xs text-cream/60 mt-0.5">Flagship Store</div>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div className="text-cream/90">Talchikhel Branch, Lalitpur</div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:015424285" className="hover:text-gold transition-colors">01-5424285</a>
                  <span className="text-cream/40 mx-1">|</span>
                  <a href="tel:015422997" className="hover:text-gold transition-colors">01-5422997</a>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-cream/70">Viber/WhatsApp:</span>{' '}
                  <a href="https://wa.me/9779841224345" className="hover:text-gold transition-colors">9841224345</a>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <a href="mailto:makoobakery@gmail.com" className="hover:text-gold transition-colors">
                  makoobakery@gmail.com
                </a>
              </div>

              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div className="text-cream/90">Open Daily 8:00 AM – 8:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#070D18] py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-cream/60 tracking-wider font-light">
            © 2025 Makoo Bakery. All Rights Reserved. | Jawalakhel, Lalitpur, Nepal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
