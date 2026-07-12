/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Page, BlogPost } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import BlogView from './components/BlogView';
import ToolsView from './components/ToolsView';
import ContactView from './components/ContactView';
import { BLOG_POSTS } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Global search modal overlays
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ blogs: BlogPost[]; tools: { name: string; desc: string; id: string }[] }>({
    blogs: [],
    tools: [],
  });

  // Global newsletter subscribe overlay
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  // Synchronized email subscriber logger
  const handleGlobalSubscribe = (emailStr: string) => {
    setSubscriberEmail(emailStr);
    setSubscribeSuccess(true);
    setSubscribeOpen(true);
    setTimeout(() => {
      setSubscribeSuccess(false);
      setSubscribeOpen(false);
      setSubscriberEmail('');
    }, 3500);
  };

  const handleModalSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscriberEmail.trim()) {
      setSubscribeSuccess(true);
      setTimeout(() => {
        setSubscribeSuccess(false);
        setSubscribeOpen(false);
        setSubscriberEmail('');
      }, 3500);
    }
  };

  // Perform dynamic fuzzy matching across clinical guides and physical utilities on input update
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults({ blogs: [], tools: [] });
      return;
    }

    // Match blogs
    const matchedBlogs = BLOG_POSTS.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.category.toLowerCase().includes(query)
    ).slice(0, 3);

    // Available site tools
    const toolsList = [
      { name: 'Ayurvedic Dosha Quiz', desc: 'Identify Vata, Pitta, or Kapha traits', id: 'dosha-section' },
      { name: 'BMI & Body Composition Calculator', desc: 'Ratio appraisal for metric or imperial units', id: 'bmi-tool' },
      { name: 'Macro Target Splits Calculator', desc: 'Protein, fat and carb weight quota limits', id: 'macro-tool' },
      { name: 'Stress Score & Pacing Breath Regulator', desc: 'Cortisol level appraisal and 4-4-4 chest-breathing pacing loops', id: 'stress-tool' },
      { name: 'Sleep Hygiene Checklist Tracker', desc: 'Analyze sleep schedules and suprachiasmatic rhythms', id: 'sleep-tool' },
    ];

    const matchedTools = toolsList.filter(
      (t) => t.name.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query)
    );

    setSearchResults({
      blogs: matchedBlogs,
      tools: matchedTools,
    });
  }, [searchQuery]);

  // Navigate to specific scroll markers for tools
  const handleToolRedirect = (id: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    setCurrentPage('tools');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return (
    <div className="flex flex-col min-h-screen text-on-surface bg-background">
      {/* Dynamic Header Component */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSearchOpen={() => setSearchOpen(true)}
        onSubscribeOpen={() => setSubscribeOpen(true)}
      />

      {/* Main View Router with Scroll Area */}
      <div className="flex-grow">
        {currentPage === 'home' && (
          <HomeView
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSubscribe={handleGlobalSubscribe}
          />
        )}

        {currentPage === 'about' && <AboutView />}

        {currentPage === 'blog' && (
          <BlogView
            onSubscribe={handleGlobalSubscribe}
            searchTerm={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {currentPage === 'tools' && <ToolsView />}

        {currentPage === 'contact' && <ContactView onSubscribe={handleGlobalSubscribe} />}
      </div>

      {/* Dynamic Footer Component */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSubscribeOpen={() => setSubscribeOpen(true)}
      />

      {/* GLOBAL OVERLAY PANEL: SEARCH MODULE */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery('');
          }}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in slide-in-from-top duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input bar */}
            <div className="p-4 md:p-6 border-b border-outline-variant/30 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-2xl">search</span>
              <input
                type="text"
                className="flex-grow text-lg font-semibold text-primary placeholder:text-gray-400 outline-none focus:ring-0"
                placeholder="Search clinical guides, calculators, and assessments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                id="global-search-input"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="material-symbols-outlined text-on-surface-variant/70 hover:text-primary cursor-pointer text-xl"
              >
                close
              </button>
            </div>

            {/* Results window */}
            <div className="p-6 max-h-[400px] overflow-y-auto space-y-6">
              {searchQuery.trim() === '' ? (
                <div className="text-center py-10 text-on-surface-variant/70 font-serif text-sm">
                  <span className="material-symbols-outlined text-3xl text-primary/20 mb-2">find_in_page</span>
                  <p className="font-bold text-primary font-display">Discover healthy habits instantly</p>
                  <p className="text-xs mt-1">Type keywords like "Dosha", "Cortisol", "Calorie", "Sleep" or "BMI".</p>
                </div>
              ) : searchResults.blogs.length === 0 && searchResults.tools.length === 0 ? (
                <div className="text-center py-10 text-on-surface-variant/70 font-serif text-sm">
                  <span className="material-symbols-outlined text-3xl text-primary/20 mb-2">warning</span>
                  <p className="font-bold text-primary font-display">No matches compiled</p>
                  <p className="text-xs mt-1">Try adjusting spelling or searching another category.</p>
                </div>
              ) : (
                <>
                  {/* Tools results segment */}
                  {searchResults.tools.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-secondary">
                        Interactive Health Utilities ({searchResults.tools.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {searchResults.tools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => handleToolRedirect(tool.id)}
                            className="w-full text-left p-3.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-secondary rounded-xl transition-all cursor-pointer flex justify-between items-center"
                          >
                            <div>
                              <p className="text-sm font-bold text-primary font-display">{tool.name}</p>
                              <p className="text-xs text-on-surface-variant/80 mt-0.5 line-clamp-1">{tool.desc}</p>
                            </div>
                            <span className="material-symbols-outlined text-secondary text-sm">arrow_forward</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blogs results segment */}
                  {searchResults.blogs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-secondary">
                        Vetted Wellness Insights ({searchResults.blogs.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {searchResults.blogs.map((blog) => (
                          <button
                            key={blog.id}
                            onClick={() => {
                              setSearchOpen(false);
                              setSearchQuery('');
                              setCurrentPage('blog');
                            }}
                            className="w-full text-left p-3.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 hover:border-secondary rounded-xl transition-all cursor-pointer flex gap-4"
                          >
                            <img
                              alt={blog.title}
                              className="w-16 h-12 object-cover rounded-lg bg-gray-100 shrink-0"
                              src={blog.image}
                            />
                            <div className="flex-grow">
                              <p className="text-xs font-black uppercase tracking-widest text-secondary mb-0.5">
                                {blog.category}
                              </p>
                              <p className="text-sm font-bold text-primary font-display line-clamp-1">
                                {blog.title}
                              </p>
                              <p className="text-xs text-on-surface-variant/80 mt-0.5 line-clamp-1">
                                {blog.excerpt}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL OVERLAY PANEL: NEWSLETTER SUBSCRIPTION MODULE */}
      {subscribeOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            setSubscribeOpen(false);
            setSubscribeSuccess(false);
            setSubscriberEmail('');
          }}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-outline-variant/30 p-6 md:p-8 text-center relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setSubscribeOpen(false);
                setSubscribeSuccess(false);
                setSubscriberEmail('');
              }}
              className="absolute top-4 right-4 text-on-surface-variant/70 hover:text-primary material-symbols-outlined cursor-pointer"
            >
              close
            </button>

            {subscribeSuccess ? (
              <div className="space-y-4 py-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold animate-bounce">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-primary font-display">Ignition Initialized!</h3>
                <p className="text-sm text-on-surface-variant font-serif leading-relaxed px-2">
                  Welcome to FitFlame. A registration handshake has been logged for **{subscriberEmail}**. Get ready for elite health digests!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-12 h-12 bg-secondary/15 text-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                </div>
                <h3 className="text-2xl font-black text-primary font-display">Fuel Your Inner Fire</h3>
                <p className="text-xs md:text-sm text-on-surface-variant font-serif leading-relaxed">
                  Join our clinical digest list today to receive structured nutritional guides, biomarkers awareness metrics, and athletic pacing routines.
                </p>

                <form onSubmit={handleModalSubscribeSubmit} className="space-y-3">
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-semibold text-sm"
                    placeholder="john@example.com"
                    required
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer red-accent-shadow text-sm"
                  >
                    Subscribe to FitFlame
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
