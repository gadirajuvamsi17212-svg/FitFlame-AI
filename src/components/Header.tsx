/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onSearchOpen: () => void;
  onSubscribeOpen: () => void;
}

export default function Header({ currentPage, onNavigate, onSearchOpen, onSubscribeOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { name: string; page: Page }[] = [
    { name: 'Home', page: 'home' },
    { name: 'About', page: 'about' },
    { name: 'Blog', page: 'blog' },
    { name: 'Tools', page: 'tools' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-outline-variant/30 transition-all duration-300 ${
        isScrolled ? 'shadow-md h-16' : 'h-20'
      }`}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-margin-desktop max-w-container-max mx-auto h-full">
        {/* Logo */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="block h-10 cursor-pointer focus:outline-none"
          id="nav-logo-btn"
        >
          <img
            alt="FitFlame"
            className="h-full w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbtFKd5GyvW-Ixy-MNihoEZsYLr4iVVGMw9vIM8DUtYbHj_fKjKDXYwYXS8pf6Ddi_2ilRjgVUeAVo25tnQhI9lFvusTBDQvnBzp0MKyaFIp0Oj1nWc6T9lsnZDTOUg176ctFYoQzPrhOpUE1pXBQvOPy0pi3_FB119CujhpY8wLfxj_Uy8E9RSil2CkP4kV0zKVNMP3SJfZQvC0yMPpoBT4_erU621r0FjrNkamli3jGPWQzdPAt_ZfVYIwLEAKLq-WR129SIUeba"
          />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-secondary font-bold border-b-2 border-secondary pb-1'
                    : 'text-on-surface-variant hover:text-secondary font-medium'
                }`}
                id={`nav-link-${link.page}`}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onSearchOpen}
            className="material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
            id="search-trigger-btn"
          >
            search
          </button>
          
          <button
            onClick={onSubscribeOpen}
            className="bg-primary text-white px-4 md:px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer red-accent-shadow"
            id="subscribe-trigger-btn"
          >
            Subscribe
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden material-symbols-outlined text-on-surface-variant p-2 rounded-full hover:bg-surface-container-low transition-colors cursor-pointer"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="bg-white border-b border-outline-variant/30 px-6 py-6 flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-left py-2 font-semibold text-lg border-b border-gray-100 transition-colors ${
                    isActive ? 'text-secondary font-bold' : 'text-on-surface'
                  }`}
                  id={`mobile-nav-link-${link.page}`}
                >
                  {link.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
