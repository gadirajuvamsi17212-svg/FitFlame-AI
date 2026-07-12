/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page } from '../types';
import heroImage from '../assets/images/hero_running_clean_1783877295013.jpg';

interface HomeViewProps {
  onNavigate: (page: Page) => void;
  onSubscribe: (email: string) => void;
}

export default function HomeView({ onNavigate, onSubscribe }: HomeViewProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email);
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const handleStartQuiz = () => {
    onNavigate('tools');
    // Scroll to the dosha section in tools page
    setTimeout(() => {
      const element = document.getElementById('dosha-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[870px] min-h-[600px] flex items-center justify-center overflow-hidden bg-white mt-16 md:mt-20">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${heroImage})` 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-[1120px] mx-auto px-6 w-full text-white">
          <div className="max-w-2xl">
            <h1 
              className="font-bold mb-8 text-white drop-shadow-md" 
              style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: '1.1', fontWeight: 800, letterSpacing: '-0.02em' }}
            >
              Health &amp; Wellness for Everyday Living
            </h1>
            <p className="text-lg md:text-xl font-serif text-white/90 max-w-2xl mb-8 leading-relaxed drop-shadow-sm">
              We help you build Healthy Habits through expert Nutrition Tips and Healthy Eating Habits. FitFlame guides your Holistic Wellness journey, inside and out.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('blog')}
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Let Us Get Started
              </button>
              <button 
                onClick={() => onNavigate('tools')}
                className="bg-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Explore Tools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section (Philosophy / About Us) */}
      <section className="py-20 max-w-[1120px] mx-auto px-6" style={{ fontFamily: 'Manrope, sans-serif' }} id="philosophy-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-6 leading-tight">
              Driven by Fitness Motivation, Guided by Healthy Habits
            </h2>
            <p className="font-serif text-lg text-on-surface-variant mb-6 leading-relaxed max-w-xl">
              FitFlame is your ultimate destination for Healthy Living, Wellness Tips, and Fitness Motivation. We help you build Healthy Habits through expert Nutrition Tips and Healthy Eating Habits. From Stress Management to Mental Wellness — FitFlame guides your Holistic Wellness journey, inside and out.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-on-surface-variant text-lg font-bold">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span> 
                Healthy Habits &amp; Wellness Tips
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant text-lg font-bold">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span> 
                Nutrition Tips &amp; Healthy Eating Habits
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant text-lg font-bold">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span> 
                Stress Management &amp; Mental Wellness
              </li>
            </ul>
            <button 
              onClick={() => onNavigate('about')}
              className="bg-secondary text-white px-8 py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider text-sm font-bold shadow-md cursor-pointer"
            >
              Know More
            </button>
          </div>
          
          <div className="relative">
            <img 
              alt="Fitness Motivation" 
              className="rounded-lg shadow-xl relative z-10 w-full h-[500px] object-cover" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLtqUKoSd22TcgdtNeriYVYg5RDGm5Aa83ybrlcC6sQ_xn1eiV8ifJDaaFm_3-kGn966Zg52BZvcZM2QYiWcF6G8L48Gs3_4czT7lwsl3zhXvAWwxNVHRDZkut0i-nlhRO6-IRicFFB7IKL7KZ3TFGOnV4UEWyev27UeDDUXdQ936lveeEVbcRBaI1mlCy4Fr5-KiqUEWF_b4CrL3zNlbFehZC6p1zWcO8lYPK5MkiZYaP2BfVpO62VPqn0"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 rounded-lg shadow-lg z-20 hidden md:block">
              <div className="text-4xl font-black mb-1">89%</div>
              <div className="text-xs uppercase tracking-widest font-bold text-white/90">Transformation Success Rate</div>
            </div>
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-primary-container rounded-lg -z-10"></div>
          </div>
        </div>
      </section>

      {/* Dosha Quiz CTA Card */}
      <section className="py-12 px-6 max-w-[1120px] mx-auto">
        <div className="relative rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[400px] bg-[#3b3b98]">
          <div className="w-full md:w-[62.5%] p-8 md:p-16 flex flex-col items-start justify-center z-10 md:border-r md:border-white/10">
            <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 inline-block">
              Ayurvedic Tool
            </span>
            <h2 className="text-white font-bold text-3xl md:text-4xl mb-6 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Discover your Vata, Pitta or Kapha dosha
            </h2>
            <p className="text-white/95 font-serif text-lg mb-10 max-w-xl leading-relaxed">
              Take our free 18-question Ayurvedic self-assessment and get a personalized breakdown of your dominant dosha, plus lifestyle and nutrition tips tailored to you.
            </p>
            <button 
              onClick={handleStartQuiz}
              className="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Take the Dosha Quiz
            </button>
          </div>
          <div className="hidden md:block md:w-[37.5%] bg-[#2d2d86]"></div>
        </div>
      </section>

      {/* Blog Posts Bento Grid */}
      <section className="py-20 max-w-[1120px] mx-auto px-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="mb-12 text-center">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">
            Latest Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface">
            FitFlame Health &amp; Wellness Posts
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Post 1 */}
          <div className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
            <div className="h-48 overflow-hidden">
              <img 
                alt="Anti-Inflammatory Foods" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLuAao_qXGtt9M7Bs8g28CAUYG2GQQ7N2zSv1cuQe8gPBlyPIyS1YT_xyDoaJdihs4dF6tsNpmN2TiVdppYtB-yRRI0naF_yPTadHhOTv8cTAGsLjOz05yd5RQvPCg_GuTdeUvr5NRJAupjtjSH-Ak0CMaaUOUJGbNy1Y1TWvViqX_-mfccVqjXbV6R62AXmngLxbRyqi5q36_VK6XDFdcKDU_u3rjKh7L53SVggcxGNqP-OCn9pXsIMBdE"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-primary font-bold text-xs uppercase mb-3 block">Nutrition</span>
              <h3 className="font-bold text-lg md:text-xl mb-4 text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                Top Anti-Inflammatory Foods You Should Be Eating Every Day
              </h3>
              <p className="font-serif text-on-surface-variant line-clamp-3 mb-6 text-sm md:text-base leading-relaxed">
                Discover the best anti-inflammatory foods for healthy living. These nutrition tips will help you reduce inflammation naturally.
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-on-surface-variant/60 font-medium">June 16, 2026</span>
                <button 
                  onClick={() => onNavigate('blog')}
                  className="text-primary font-bold text-sm hover:underline cursor-pointer"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>

          {/* Post 2 */}
          <div className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
            <div className="h-48 overflow-hidden">
              <img 
                alt="Vitamin E Foods" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLvPI3fFN59mDEL3d1PzO_uTirMnxvemh_Km1phsO9o29y2glOH4ruB4AsJYCUxa0l1rmPIK02F_4egf6azFQu9B_2SUDIFSQSQwaj213JF4Eaws5nrXToQAD0Hbjw5Zz_X4hZxygW6B7rW_u5Wgmx0e1_D9mF1wpVpNLu0tilR1feGKcQv8lAmXRam8G_Mh8JAU3IA60dkDcTVAISnPr-Rnoav2T4hjhdNSGSzua11SC9RvxbfsqnOHST7t"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-primary font-bold text-xs uppercase mb-3 block">Nutrition</span>
              <h3 className="font-bold text-lg md:text-xl mb-4 text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                Top Vitamin E Foods You Should Be Eating Every Day
              </h3>
              <p className="font-serif text-on-surface-variant line-clamp-3 mb-6 text-sm md:text-base leading-relaxed">
                Boost skin health, immunity, and holistic wellness naturally with these essential vitamin E rich nutrition tips.
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-on-surface-variant/60 font-medium">June 16, 2026</span>
                <button 
                  onClick={() => onNavigate('blog')}
                  className="text-primary font-bold text-sm hover:underline cursor-pointer"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>

          {/* Post 3 */}
          <div className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all h-full">
            <div className="h-48 overflow-hidden">
              <img 
                alt="Magnesium Foods" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLu2phUM7qcnd6KXBiSyNS3P9-q0S4uWqJwtE_86F3STDsIdA43YeqrqTHlWMvF-QDejkvBTlI-zkadx8LSPPqcBZRBO46z24P4Qwv9vSzXwrLD_ukxK4850Ahyux8LlRzXAVbPqVqvLtNnE6lxP6R4Gwo0EwH94vl-kXhF4MSFNYFIcc7PEF1Rxni8dMe_yBzw1h-HPr3ts34OqoW11H3qDVBhxyv9EvyLNTndmsohXqjCj95cI6dLHPDHw"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-primary font-bold text-xs uppercase mb-3 block">Nutrition</span>
              <h3 className="font-bold text-lg md:text-xl mb-4 text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                Top Magnesium Rich Foods You Should Be Eating Every Day
              </h3>
              <p className="font-serif text-on-surface-variant line-clamp-3 mb-6 text-sm md:text-base leading-relaxed">
                Supports muscle function, nerve health, and heart health. Discover the essential minerals your body needs daily.
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs text-on-surface-variant/60 font-medium">June 9, 2026</span>
                <button 
                  onClick={() => onNavigate('blog')}
                  className="text-primary font-bold text-sm hover:underline cursor-pointer"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 bg-[#f8f9fa]" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="max-w-[1120px] mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-on-surface mb-4">
              Unlock Your Healthiest Self Today
            </h2>
            <p className="font-serif text-base text-on-surface-variant mb-8 max-w-2xl mx-auto leading-relaxed">
              Subscribe Now &amp; Get Regular Fitlame Posts, Quotes, Fitness Tips to Your Mail. Join the community starting their fitness journey here.
            </p>
            {submitted ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg font-semibold inline-block animate-bounce shadow-sm">
                ✓ Thank you! You have successfully subscribed to the FitFlame newsletter.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-row gap-3 justify-center items-center max-w-md mx-auto">
                <input 
                  className="px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none flex-grow text-on-surface bg-white text-sm" 
                  placeholder="Enter your email address" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-95 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap" 
                  type="submit"
                >
                  Join FitFlame
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
