/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onSubscribeOpen: () => void;
}

export default function Footer({ onNavigate, onSubscribeOpen }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-20 mt-20" style={{ fontFamily: 'Manrope, sans-serif' }} id="main-footer">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Branding Column */}
          <div className="lg:col-span-2">
            <button
              onClick={() => {
                onNavigate('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="block h-12 mb-8 cursor-pointer focus:outline-none text-left"
              id="footer-logo-btn"
            >
              <img
                alt="FitFlame Logo"
                className="h-full w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyL3Nwp4mxGIdsj1eV0xbd3L4lOdXNyTy_0AA8ZftYqqtm2gj7qamTiyDCa7kiQQP4Dbzu2rTOxkhkbqTesILqMRW9ZS8Z48q4xbTDyHTkYuNBW7hXeUctSX71u_f8Jbgw5iboQ4yzWG0QNRXKjZtQMGg5BZw3N90wNCsTXhGost_efy06GYQJz-Em6rJVXinSHjbX-SP1STRspoZ4xrOymWH2m4bJWBgdsm7idPbqCi4bxnbenRBuySl0_1eM4KRfQdKqZzS3djKo"
              />
            </button>
            <p className="text-secondary font-serif text-lg max-w-sm leading-relaxed">
              Your ultimate destination for holistic health, expert nutrition, and sustainable fitness motivation. Join us on the journey to your healthiest self.
            </p>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="text-secondary font-bold text-xl mb-6">Explore</h4>
            <ul className="space-y-4 text-secondary/70 text-lg">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={onSubscribeOpen}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Subscribe
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Wellness */}
          <div>
            <h4 className="text-secondary font-bold text-xl mb-6">Wellness</h4>
            <ul className="space-y-4 text-secondary/70 text-lg">
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Nutrition Tips
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Mental Health
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Fitness Routines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Healthy Habits
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Tools */}
          <div>
            <h4 className="text-secondary font-bold text-xl mb-6">Tools</h4>
            <ul className="space-y-4 text-secondary/70 text-lg">
              <li>
                <button
                  onClick={() => {
                    onNavigate('tools');
                    setTimeout(() => {
                      const el = document.getElementById('dosha-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Dosha Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('tools');
                    setTimeout(() => {
                      const el = document.getElementById('bmi-tool');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  BMI Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('tools');
                    setTimeout(() => {
                      const el = document.getElementById('macro-tool');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Meal Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('tools');
                    setTimeout(() => {
                      const el = document.getElementById('stress-tool');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer text-left focus:outline-none"
                >
                  Calorie Tracker
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer Row */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
          <div className="flex flex-col gap-6 items-start">
            {/* Social Icons Bottom-Left */}
            <div className="flex gap-4">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                  className="w-full h-full object-contain"
                  alt="LinkedIn"
                />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                  className="w-full h-full object-contain"
                  alt="Facebook"
                />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                  className="w-full h-full object-contain"
                  alt="Instagram"
                />
              </a>
            </div>
            {/* Copyright text */}
            <div className="text-secondary/60 text-base">
              © {currentYear} FitFlame. All rights reserved. <span className="ml-4 uppercase tracking-widest text-xs font-bold">Powered by FitFlame</span>
            </div>
          </div>

          {/* Legal Links Bottom-Right */}
          <div className="flex gap-8 text-sm font-semibold uppercase tracking-wider text-secondary">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-primary transition-colors cursor-pointer uppercase text-sm font-semibold tracking-wider text-secondary focus:outline-none"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
