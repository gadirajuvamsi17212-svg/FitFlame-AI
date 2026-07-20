/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page } from '../types';
import heroImage from '../assets/images/hero_running_clean_1783877295013.jpg';
import fitnessMotivation from '../assets/images/fitness_motivation_1784532287021.jpg';
import antiInflammatoryFoods from '../assets/images/anti_inflammatory_foods_1784023792912.jpg';
import antiInflammatoryHero from '../assets/images/anti_inflammatory_hero_1784540420691.jpg';
import nutrientDensity from '../assets/images/nutrient_density_1784532300000.jpg';
import metabolicFlexibility from '../assets/images/metabolic_flexibility_1784532311992.jpg';

interface HomeViewProps {
  onNavigate: (page: Page | 'blog-post', slug?: string) => void;
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
      <section className="relative h-[550px] md:h-[870px] min-h-[480px] md:min-h-[600px] flex items-center justify-center overflow-hidden bg-white mt-16 md:mt-20">
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
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => onNavigate('blog')}
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer w-full sm:w-auto text-center"
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                Let Us Get Started
              </button>
              <button 
                onClick={() => onNavigate('tools')}
                className="bg-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer w-full sm:w-auto text-center"
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
               className="rounded-lg shadow-xl relative z-10 w-full h-[300px] md:h-[500px] object-cover" 
               src={fitnessMotivation}
               referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 rounded-lg shadow-lg z-20 hidden md:block">
              <div className="text-4xl font-black mb-1">89%</div>
              <div className="text-xs uppercase tracking-widest font-bold text-white/90">Transformation Success Rate</div>
            </div>
            <div className="absolute -top-3 -left-3 md:-top-6 md:-left-6 w-full h-full border-2 border-primary-container rounded-lg -z-10"></div>
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
          <div 
            onClick={() => onNavigate('blog-post', 'top-10-anti-inflammatory-foods')}
            className="group flex flex-col bg-white rounded-3xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full cursor-pointer text-left"
          >
            <div className="overflow-hidden rounded-2xl aspect-[16/10] mb-6 shadow-sm relative select-none">
              <img 
                alt="Top 10 Anti-Inflammatory Foods" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={antiInflammatoryHero}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block py-1.5 px-3 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Nutrition
                </span>
              </div>
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="font-extrabold text-2xl mb-3 text-secondary leading-tight group-hover:text-primary transition-colors line-clamp-2">
                Top 10 Anti-Inflammatory Foods You Should Be Eating Every Day
              </h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed line-clamp-3">
                Joint stiffness, constant fatigue, skin flare-ups, and puffiness are often signs of chronic inflammation. Discover the top 10 foods to heal from within.
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">timer</span>
                  <span className="text-xs font-bold text-on-surface-variant">8 min read</span>
                </div>
                <span className="text-primary font-black text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>

          {/* Post 2 */}
          <div 
            onClick={() => onNavigate('blog-post', 'fueling-your-fire-nutrient-density')}
            className="group flex flex-col bg-white rounded-3xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full cursor-pointer text-left"
          >
            <div className="overflow-hidden rounded-2xl aspect-[16/10] mb-6 shadow-sm relative select-none">
              <img 
                alt="Nutrient Density" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={nutrientDensity}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block py-1.5 px-3 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Nutrition
                </span>
              </div>
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="font-extrabold text-2xl mb-3 text-secondary leading-tight group-hover:text-primary transition-colors line-clamp-2">
                Fueling Your Fire: The Ultimate Guide to Nutrient Density
              </h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed line-clamp-3">
                Discover how specific micro-nutrients can transform your energy levels, cognitive performance, and everyday biological processes.
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">timer</span>
                  <span className="text-xs font-bold text-on-surface-variant">6 min read</span>
                </div>
                <span className="text-primary font-black text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
              </div>
            </div>
          </div>

          {/* Post 3 */}
          <div 
            onClick={() => onNavigate('blog-post', 'precision-training-metabolic-flexibility')}
            className="group flex flex-col bg-white rounded-3xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full cursor-pointer text-left"
          >
            <div className="overflow-hidden rounded-2xl aspect-[16/10] mb-6 shadow-sm relative select-none">
              <img 
                alt="Metabolic Flexibility" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={metabolicFlexibility}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-block py-1.5 px-3 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Exercise
                </span>
              </div>
            </div>
            <div className="flex flex-col flex-grow">
              <h3 className="font-extrabold text-2xl mb-3 text-secondary leading-tight group-hover:text-primary transition-colors line-clamp-2">
                Precision Training: Maximizing Metabolic Flexibility
              </h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed line-clamp-3">
                Why your workout timing might be more important than intensity. Learn the circadian biology of peak strength and fat oxidation windows.
              </p>
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">timer</span>
                  <span className="text-xs font-bold text-on-surface-variant">5 min read</span>
                </div>
                <span className="text-primary font-black text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </span>
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
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-stretch max-w-md mx-auto w-full">
                <input 
                  className="px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none w-full text-on-surface bg-white text-sm" 
                  placeholder="Enter your email address" 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-95 active:scale-95 transition-all shadow-sm cursor-pointer whitespace-nowrap w-full sm:w-auto text-center" 
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
