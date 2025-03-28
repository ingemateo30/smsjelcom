import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { href: "#servicios", label: "Servicios" },
    { href: "#beneficios", label: "Beneficios" },
    { href: "#testimonios", label: "Testimonios" },
    { href: "#contacto", label: "Contacto" }
  ];

  return (
    <>
      <header className="fixed w-full z-50 bg-gray-900 bg-opacity-95 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-orange-500">Jelcom</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              className="text-gray-300 hover:text-orange-500 transition"
            >
              {item.label}
            </a>
          ))}
          <a 
            href="/login" 
            className="bg-orange-500 px-4 py-2 rounded font-bold hover:bg-orange-600 transition"
          >
            Iniciar Sesión
          </a>
        </nav>
        
        {/* Mobile Menu Toggle */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-orange-500 text-2xl"
        >
          {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </header>

      {/* Mobile Slide-Out Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 right-0 w-64 h-full bg-gray-900 z-40 shadow-lg md:hidden"
          >
            <div className="p-6 pt-24 space-y-6">
              {menuItems.map((item) => (
                <a 
                  key={item.href} 
                  href={item.href} 
                  onClick={toggleMobileMenu}
                  className="block text-gray-300 hover:text-orange-500 transition text-xl"
                >
                  {item.label}
                </a>
              ))}
              <a 
                href="/login" 
                onClick={toggleMobileMenu}
                className="block bg-orange-500 px-4 py-2 rounded font-bold hover:bg-orange-600 transition text-center"
              >
                Iniciar Sesión
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-black z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Header;