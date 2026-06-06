import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import MakooLogo from './MakooLogo';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/cakes', label: 'Cakes' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-[#FEFCF8] border-b border-[#E8DFD0] sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo + Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <MakooLogo size={52} color="#1B2A5E" />
            <div>
              <div className="font-display text-2xl font-bold text-navy tracking-tight group-hover:text-navy-dark transition-colors">
                MAKOO BAKERY
              </div>
              <div className="text-[10px] text-gold font-sans tracking-[0.2em] -mt-1">
                SINCE 1988
              </div>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-sans text-sm font-medium uppercase tracking-[0.1em] transition-colors relative pb-1 ${
                  isActive(link.to)
                    ? 'text-gold'
                    : 'text-navy hover:text-navy-dark'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: Cart + Order Now */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              to="/order"
              className="relative flex items-center justify-center w-10 h-10 text-navy hover:text-gold transition-colors"
              aria-label="View cart"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-navy text-cream text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Order Now Button */}
            <Link
              to="/order"
              className="hidden md:block px-6 py-2.5 bg-navy text-gold text-xs font-medium uppercase tracking-[0.08em] hover:bg-navy-dark transition-colors"
            >
              ORDER NOW
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-navy p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeMobileMenu}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 bg-navy-dark p-8 flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
                <MakooLogo size={40} color="#C9A84C" />
                <div>
                  <div className="font-display text-xl font-bold text-cream">MAKOO BAKERY</div>
                  <div className="text-[10px] text-gold tracking-[0.2em]">SINCE 1988</div>
                </div>
              </Link>
              <button onClick={closeMobileMenu} className="text-cream">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`font-display text-2xl italic transition-colors ${
                    isActive(link.to) ? 'text-gold' : 'text-cream hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-cream/20 my-4" />
              <Link
                to="/order"
                onClick={closeMobileMenu}
                className="mt-2 px-8 py-3 bg-gold text-navy text-sm font-medium uppercase tracking-[0.08em] text-center hover:bg-gold-light transition-colors"
              >
                ORDER NOW
              </Link>
              <Link
                to="/order"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 text-cream hover:text-gold text-sm mt-2"
              >
                <ShoppingCart size={18} /> View Cart ({cartCount})
              </Link>
            </div>

            <div className="mt-auto pt-8 text-center">
              <div className="text-cream/60 text-xs tracking-widest">JAWALAKHEL, LALITPUR</div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
