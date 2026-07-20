/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { BLOG_POSTS } from '../data';
import { BlogPost } from '../types';

interface BlogViewProps {
  onSubscribe: (email: string) => void;
  searchTerm?: string;
  onClearSearch?: () => void;
  onSelectPost: (slug: string) => void;
  onSelectCategory?: (category: string) => void;
}

type CategoryFilter = 'All' | 'Nutrition' | 'Exercise' | 'Mental Health' | 'Preventive';

export default function BlogView({ onSubscribe, searchTerm: externalSearch = '', onClearSearch, onSelectPost, onSelectCategory }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'time'>('latest');
  const [internalSearch, setInternalSearch] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Sync external search term from global search bar
  useEffect(() => {
    if (externalSearch) {
      setInternalSearch(externalSearch);
    }
  }, [externalSearch]);

  const categories: CategoryFilter[] = ['All', 'Nutrition', 'Exercise', 'Mental Health', 'Preventive'];

  // Handle local searching and filtering
  const filteredPosts = useMemo(() => {
    let posts = [...BLOG_POSTS];

    // Category filter
    if (selectedCategory !== 'All') {
      posts = posts.filter(p => p.category === selectedCategory);
    }

    // Search query filter (matches title, excerpt, content, or category)
    const query = (internalSearch || '').toLowerCase().trim();
    if (query) {
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy === 'latest') {
      posts.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'popular') {
      posts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'time') {
      const getTime = (str: string) => parseInt(str.split(' ')[0], 10) || 0;
      posts.sort((a, b) => getTime(b.readTime) - getTime(a.readTime));
    }

    return posts;
  }, [selectedCategory, sortBy, internalSearch]);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submittedEmail.trim()) {
      onSubscribe(submittedEmail);
      setSubmittedEmail('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 mt-20 pt-12 pb-0">
      <main className="max-w-[1120px] mx-auto px-6 mb-20">
        {/* Header Section */}
        <section className="mb-16 text-left">
          <h1 className="text-5xl md:text-6xl font-black text-secondary mb-6 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Insights for Vitality
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Expert-led guidance on nutrition, fitness, and mental well-being to help you ignite your inner potential.
          </p>
        </section>

        {/* Filters & Sort */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 w-full overflow-hidden">
          {/* Category tabs */}
          <div className="flex overflow-x-auto pb-3 md:pb-0 gap-2 w-full no-scrollbar select-none -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:overflow-x-visible shrink-0">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (cat === 'All') {
                      setSelectedCategory('All');
                    } else if (onSelectCategory) {
                      onSelectCategory(cat);
                    } else {
                      setSelectedCategory(cat);
                    }
                  }}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-[#f8f9fa] text-on-surface-variant border border-gray-200 hover:border-primary hover:text-primary'
                  }`}
                  id={`filter-btn-${cat.replace(' ', '-')}`}
                >
                  {cat === 'All' ? 'All Posts' : cat}
                </button>
              );
            })}
          </div>

          {/* Search box and Sort dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {/* Inline search */}
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary/60">
                search
              </span>
              <input
                type="text"
                value={internalSearch}
                onChange={(e) => {
                  setInternalSearch(e.target.value);
                  if (e.target.value === '' && onClearSearch) {
                    onClearSearch();
                  }
                }}
                placeholder="Search articles..."
                className="pl-10 pr-8 py-2 w-full md:w-64 bg-[#f1f3f9] text-secondary placeholder-secondary/50 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary font-semibold text-sm"
                id="blog-inline-search"
              />
              {internalSearch && (
                <button
                  onClick={() => {
                    setInternalSearch('');
                    if (onClearSearch) onClearSearch();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                >
                  close
                </button>
              )}
            </div>

            {/* Sort options */}
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-xl text-sm px-4 py-2 font-semibold focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer flex-grow sm:flex-grow-0"
                id="blog-sort-select"
              >
                <option value="latest">Latest Updates</option>
                <option value="popular">Most Popular</option>
                <option value="time">Reading Time</option>
              </select>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-[#f8f9fa] rounded-2xl border border-dashed border-gray-300">
            <span className="material-symbols-outlined text-5xl text-secondary/30 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-secondary mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>No articles found</h3>
            <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
              We couldn't find any articles matching "{internalSearch}". Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setInternalSearch('');
                setSelectedCategory('All');
                if (onClearSearch) onClearSearch();
              }}
              className="mt-6 bg-primary text-white px-6 py-2 rounded-full font-bold text-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectPost(post.slug)}
                className="group cursor-pointer transition-all duration-700 opacity-100 translate-y-0 text-left"
                id={`blog-card-${post.id}`}
              >
                {/* Image aspect-ratio holder */}
                <div className="overflow-hidden rounded-2xl aspect-[16/10] mb-6 shadow-custom relative">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectCategory) {
                          onSelectCategory(post.category);
                        }
                      }}
                      className="inline-block py-1 px-3 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:brightness-110 cursor-pointer"
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Metadata & Title */}
                <div>
                  <h3 className="text-2xl font-extrabold text-secondary mb-3 leading-tight group-hover:text-primary transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {post.title}
                  </h3>
                  <p className="text-on-surface-variant line-clamp-2 mb-4 leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">timer</span>
                      <span className="text-xs font-bold text-on-surface-variant">{post.readTime}</span>
                    </div>
                    <span className="text-primary font-black text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 text-secondary hover:bg-primary/5 transition-all disabled:opacity-30 cursor-not-allowed"
            disabled
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary text-white font-black shadow-md">
              1
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl text-secondary font-bold hover:bg-primary/5 transition-all cursor-pointer">
              2
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl text-secondary font-bold hover:bg-primary/5 transition-all cursor-pointer">
              3
            </button>
            <span className="text-on-surface-variant font-black">...</span>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl text-secondary font-bold hover:bg-primary/5 transition-all cursor-pointer">
              12
            </button>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 text-secondary hover:bg-primary/5 transition-all cursor-pointer">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      {/* CTA Section */}
      <section className="bg-secondary py-24 relative overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-6 text-center relative z-10">
          <div className="inline-block p-3 rounded-2xl bg-primary mb-8 shadow-xl">
            <span className="material-symbols-outlined text-white text-4xl">mail</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Never Miss a Spark
          </h2>
          <p className="text-lg text-white/80 mb-12 max-w-xl mx-auto font-medium">
            Join 15,000+ others receiving our weekly weekly digest of science-backed wellness insights directly in their inbox.
          </p>

          {showToast ? (
            <div className="bg-green-500 text-white p-4 rounded-xl font-bold inline-block shadow-lg animate-bounce">
              ✓ Successfully signed up for FitFlame insights!
            </div>
          ) : (
            <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                className="flex-grow px-8 py-5 rounded-2xl border-none text-on-surface focus:ring-4 focus:ring-primary/30 font-semibold bg-white outline-none"
                placeholder="Enter your email address"
                type="email"
                required
                value={submittedEmail}
                onChange={(e) => setSubmittedEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white px-10 py-5 rounded-2xl font-black hover:brightness-110 transition-all active:scale-95 shadow-xl cursor-pointer"
              >
                Sign Up Now
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-white/40 font-bold uppercase tracking-widest">
            No spam, just vitality. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
