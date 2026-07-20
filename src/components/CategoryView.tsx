/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Clock, Calendar, ArrowRight, Home } from 'lucide-react';
import { BlogPost, Page } from '../types';
import { BLOG_POSTS } from '../data';

interface CategoryViewProps {
  category: string;
  onNavigate: (page: Page | 'blog-post' | 'blog-category', slug?: string) => void;
  onSubscribe: (email: string) => void;
}

export default function CategoryView({ category, onNavigate, onSubscribe }: CategoryViewProps) {
  // Normalize category name
  const formattedCategory = category.trim();
  
  // Filter posts belonging to this category
  const categoryPosts = useMemo(() => {
    return BLOG_POSTS.filter(p => p.category.toLowerCase() === formattedCategory.toLowerCase());
  }, [formattedCategory]);

  // Dynamic header copy based on category
  const categoryMeta = useMemo(() => {
    const meta: Record<string, { title: string; subtitle: string; desc: string; color: string; bgClass: string }> = {
      'Nutrition': {
        title: 'Nutrition Science & Dietetics',
        subtitle: 'Optimal Cellular Refueling',
        desc: 'Explore clinical-grade nutrition protocols, bioavailable whole food biochemistry, and targeted guidelines to optimize metabolic performance and systemic vitality.',
        color: 'text-primary',
        bgClass: 'from-amber-500/10 to-red-500/10'
      },
      'Exercise': {
        title: 'Precision Physical Training',
        subtitle: 'Athletic Conditioning & Adaptation',
        desc: 'Science-backed workout programs, circadian physical training windows, metabolic flexibility strategies, and biomechanics optimizations for athletic durability.',
        color: 'text-secondary',
        bgClass: 'from-blue-500/10 to-indigo-500/10'
      },
      'Mental Health': {
        title: 'Cognitive Science & Recovery',
        subtitle: 'Autonomic Balance Protocols',
        desc: 'Discover practical protocols in neurobiology, stress regulation, circadian light synchronization, and nervous system recovery to bridge the gap between mind and body.',
        color: 'text-emerald-600',
        bgClass: 'from-emerald-500/10 to-teal-500/10'
      },
      'Preventive': {
        title: 'Longevity & Preventive Medicine',
        subtitle: 'Systemic Healthspan Expansion',
        desc: 'Targeted daily habits, clinical biomarker awareness, non-exercise physical activities, and cellular recycling (autophagy) triggers to expand functional longevity.',
        color: 'text-purple-600',
        bgClass: 'from-purple-500/10 to-pink-500/10'
      }
    };

    // Case-insensitive match or fallback
    const key = Object.keys(meta).find(k => k.toLowerCase() === formattedCategory.toLowerCase()) || 'Nutrition';
    return meta[key];
  }, [formattedCategory]);

  const [emailInput, setEmailInput] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      onSubscribe(emailInput);
      setEmailInput('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 mt-20 pt-12 pb-20 bg-background">
      <main className="max-w-[1120px] mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 mb-8 select-none">
          <button 
            onClick={() => onNavigate('home')} 
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            id="breadcrumb-home"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
          <span className="text-gray-300">/</span>
          <button 
            onClick={() => onNavigate('blog')} 
            className="hover:text-primary transition-colors cursor-pointer"
            id="breadcrumb-blog"
          >
            Blog
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-secondary font-black">{formattedCategory}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('blog')}
            className="group flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors cursor-pointer"
            id="back-to-blog-btn"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to main blog
          </button>
        </div>

        {/* Category Hero Block */}
        <section className={`rounded-3xl bg-gradient-to-br ${categoryMeta.bgClass} p-8 md:p-12 mb-16 border border-outline-variant/20 relative overflow-hidden`}>
          <div className="max-w-3xl relative z-10 text-left">
            <span className={`inline-block text-xs font-black uppercase tracking-widest ${categoryMeta.color} mb-3`}>
              {categoryMeta.subtitle}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-secondary mb-4 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {categoryMeta.title}
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant font-serif leading-relaxed">
              {categoryMeta.desc}
            </p>
          </div>
          {/* Subtle background glow decorative circle */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none"></div>
        </section>

        {/* Posts List Section */}
        <section className="mb-20 text-left">
          <h2 className="text-2xl font-black text-secondary mb-8 font-display border-b border-gray-100 pb-4">
            Available Guides in {formattedCategory} ({categoryPosts.length})
          </h2>

          {categoryPosts.length === 0 ? (
            <div className="text-center py-20 bg-[#f8f9fa] rounded-2xl border border-dashed border-gray-200">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">folder_open</span>
              <p className="text-lg font-bold text-secondary">No Articles Found</p>
              <p className="text-sm text-on-surface-variant mt-1">We are compiling research for this category. Check back soon!</p>
              <button 
                onClick={() => onNavigate('blog')}
                className="mt-6 bg-primary text-white font-bold text-xs px-6 py-3 rounded-full cursor-pointer hover:brightness-115 transition-all"
                id="empty-category-back"
              >
                Explore other guides
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categoryPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => onNavigate('blog-post', post.slug)}
                  className="group bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
                  id={`category-post-card-${post.id}`}
                >
                  {/* Image wrapper */}
                  <div className="h-52 md:h-60 w-full overflow-hidden relative bg-gray-100 shrink-0">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={post.image}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block py-1 px-3 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider text-on-surface-variant/60 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-secondary group-hover:text-primary transition-colors leading-snug mb-3">
                      {post.title}
                    </h3>

                    <p className="text-on-surface-variant text-sm font-serif leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-secondary group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        Read Protocol
                      </span>
                      <span className="w-8 h-8 rounded-full bg-[#f1f3f9] text-secondary group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter subscription module within category */}
        <section className="bg-secondary rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary mb-3">
              STAY CURRENT ON {formattedCategory.toUpperCase()} RESEARCH
            </span>
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Subscribe to FitFlame Insights
            </h2>
            <p className="text-sm md:text-base text-gray-300 font-serif leading-relaxed mb-8">
              Receive structured bio-individual updates, clinical biomarker insights, and healthy habit protocols directly to your inbox. No spam.
            </p>

            <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-grow px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-semibold text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:brightness-110 active:scale-95 text-white font-bold rounded-xl transition-all cursor-pointer red-accent-shadow text-sm shrink-0"
                id="category-newsletter-subscribe-btn"
              >
                Join Protocol
              </button>
            </form>
          </div>

          {/* Decorative design elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mt-10 -ml-10"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-3xl -mb-12 -mr-12"></div>
        </section>
      </main>

      {/* Floating success toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-secondary text-white px-5 py-4 rounded-xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300 z-[150] max-w-sm text-left">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white shrink-0">✓</div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-primary">Subscription Shake Logged</p>
              <p className="text-xs text-gray-300 font-serif mt-0.5 leading-relaxed">Your email protocol has been registered for the latest {formattedCategory} science updates.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
