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
}

type CategoryFilter = 'All' | 'Nutrition' | 'Exercise' | 'Mental Health' | 'Preventive';

export default function BlogView({ onSubscribe, searchTerm: externalSearch = '', onClearSearch }: BlogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'time'>('latest');
  const [internalSearch, setInternalSearch] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

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
      // Keep preloaded ID sorting (highest ID first = latest)
      posts.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'popular') {
      // Simulate popularity by ID or title
      posts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'time') {
      // Extract number from "X min read" and sort descending
      const getTime = (str: string) => parseInt(str.split(' ')[0], 10) || 0;
      posts.sort((a, b) => getTime(b.readTime) - getTime(a.readTime));
    }

    return posts;
  }, [selectedCategory, sortBy, internalSearch]);

  // Handle post scrolling progress calculation inside reader
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const winScroll = target.scrollTop;
    const height = target.scrollHeight - target.clientHeight;
    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      setReadingProgress(scrolled);
    } else {
      setReadingProgress(0);
    }
  };

  const handlePostClick = (post: BlogPost) => {
    setActivePost(post);
    setReadingProgress(0);
  };

  const handleCloseReader = () => {
    setActivePost(null);
    setReadingProgress(0);
  };

  return (
    <div className="animate-in fade-in duration-500 mt-20 pt-12 pb-16">
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        {/* Page Title */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6 tracking-tight font-display">
            Insights for Vitality
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed font-serif">
            Expert-led guidance on nutrition, fitness, and mental well-being to help you ignite your inner potential.
          </p>
        </section>

        {/* Filters & Sorting Panel */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 md:px-6 py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:border-secondary hover:text-secondary'
                  }`}
                  id={`filter-btn-${cat.replace(' ', '-')}`}
                >
                  {cat === 'All' ? 'All Posts' : cat}
                </button>
              );
            })}
          </div>

          {/* Search Box + Sort dropdown */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Inline search box */}
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">
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
                className="pl-10 pr-8 py-2 w-full md:w-60 bg-surface-container-low border border-outline-variant rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
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

            {/* Sort selection */}
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-outline-variant rounded-xl text-xs md:text-sm px-3 md:px-4 py-2 font-semibold focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                id="blog-sort-select"
              >
                <option value="latest">Latest Updates</option>
                <option value="popular">Most Popular</option>
                <option value="time">Reading Time</option>
              </select>
            </div>
          </div>
        </section>

        {/* Blog Post Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-5xl text-primary/30 mb-4">search_off</span>
            <h3 className="text-xl font-bold text-primary mb-2 font-display">No articles found</h3>
            <p className="text-on-surface-variant text-sm font-serif max-w-sm mx-auto">
              We couldn't find any articles matching "{internalSearch}". Try adjusting your filters or search criteria.
            </p>
            <button
              onClick={() => {
                setInternalSearch('');
                setSelectedCategory('All');
                if (onClearSearch) onClearSearch();
              }}
              className="mt-6 bg-secondary text-white px-6 py-2 rounded-full font-bold text-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="group cursor-pointer bg-white border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
                id={`blog-card-${post.id}`}
              >
                {/* Image Section */}
                <div className="overflow-hidden aspect-[16/10] relative bg-gray-50">
                  <img
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={post.image}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block py-1 px-3 rounded-lg bg-secondary text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-extrabold text-primary mb-3 leading-tight group-hover:text-secondary transition-colors font-display">
                      {post.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs md:text-sm line-clamp-3 mb-4 leading-relaxed font-serif">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-1.5 text-on-surface-variant/80">
                      <span className="material-symbols-outlined text-secondary text-lg">timer</span>
                      <span className="text-xs font-bold font-display">{post.readTime}</span>
                    </div>
                    <span className="text-secondary font-black text-xs md:text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Insight
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <button
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border border-outline-variant text-primary hover:bg-surface-container-low transition-all disabled:opacity-35 cursor-not-allowed"
            disabled
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-secondary text-white font-black shadow-md">
              1
            </button>
            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl text-primary font-bold hover:bg-surface-container-low transition-all cursor-pointer">
              2
            </button>
            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl text-primary font-bold hover:bg-surface-container-low transition-all cursor-pointer">
              3
            </button>
            <span className="text-on-surface-variant font-black">...</span>
            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl text-primary font-bold hover:bg-surface-container-low transition-all cursor-pointer">
              12
            </button>
          </div>
          <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border border-outline-variant text-primary hover:bg-surface-container-low transition-all cursor-pointer">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      {/* CTA newsletter section */}
      <section className="bg-primary py-20 mt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(235,59,90,0.1),transparent)]" />
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop text-center relative z-10">
          <div className="inline-block p-4 rounded-2xl bg-secondary mb-8 shadow-xl">
            <span className="material-symbols-outlined text-white text-3xl">mail</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight font-display">
            Never Miss a Spark
          </h2>
          <p className="text-base md:text-lg text-white/80 mb-10 max-w-xl mx-auto font-serif">
            Join 15,000+ others receiving our weekly digest of science-backed wellness insights directly in their inbox.
          </p>
          <div className="w-full max-w-md mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = form.querySelector('input') as HTMLInputElement;
                if (emailInput?.value) {
                  onSubscribe(emailInput.value);
                  form.reset();
                }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                className="flex-grow px-6 py-4 rounded-xl border-none bg-white text-on-surface focus:ring-2 focus:ring-secondary placeholder:text-gray-400 font-semibold text-sm"
                placeholder="Enter your email address"
                type="email"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-8 py-4 rounded-xl font-black hover:brightness-115 active:scale-95 transition-all shadow-lg cursor-pointer text-sm"
              >
                Sign Up Now
              </button>
            </form>
          </div>
          <p className="mt-6 text-xs text-white/40 font-bold uppercase tracking-widest font-display">
            No spam, just vitality. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* IMMERSIVE READ DRAWER/MODAL */}
      {activePost && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Slide-over Container */}
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Custom Reading Progress Bar */}
            <div
              className="absolute top-0 left-0 h-1.5 bg-secondary z-50 transition-all duration-75"
              style={{ width: `${readingProgress}%` }}
            />

            {/* Header section with Close button */}
            <div className="flex justify-between items-center px-6 md:px-8 py-4 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-block py-1 px-2.5 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-wider">
                  {activePost.category}
                </span>
                <span className="text-xs text-on-surface-variant/80 font-bold font-display">
                  {activePost.readTime}
                </span>
              </div>
              <button
                onClick={handleCloseReader}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none"
                id="close-reader-btn"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Post Body (Calculates Reading Progress) */}
            <div
              onScroll={handleScroll}
              className="flex-grow overflow-y-auto px-6 md:px-12 py-8 overflow-x-hidden"
              id="reader-scroll-container"
            >
              {/* Featured image */}
              <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-8 bg-gray-100 shadow-md">
                <img
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                  src={activePost.image}
                />
              </div>

              {/* Date & Author */}
              <div className="text-xs text-on-surface-variant/70 font-semibold mb-3 flex items-center gap-2">
                <span>Published on {activePost.date}</span>
                <span>•</span>
                <span className="text-secondary uppercase tracking-widest font-bold">FitFlame Medical Board</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-primary mb-6 leading-tight font-display tracking-tight">
                {activePost.title}
              </h1>

              {/* Styled body prose */}
              <div className="prose max-w-none text-base md:text-lg text-on-surface-variant font-serif leading-relaxed space-y-6">
                {activePost.content.split('\n\n').map((paragraph, index) => {
                  const cleaned = paragraph.trim();
                  if (!cleaned) return null;

                  // Heading matching (simple markdown headings)
                  if (cleaned.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-xl md:text-2xl font-bold text-primary font-display mt-8 mb-4">
                        {cleaned.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (cleaned.startsWith('#### ')) {
                    return (
                      <h4 key={index} className="text-lg md:text-xl font-bold text-secondary font-display mt-6 mb-3">
                        {cleaned.replace('#### ', '')}
                      </h4>
                    );
                  }

                  // Bullet lists matching
                  if (cleaned.startsWith('* ')) {
                    const lines = cleaned.split('\n');
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 mt-4">
                        {lines.map((line, lIdx) => (
                          <li key={lIdx} className="pl-1">
                            {line.replace('* ', '')}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // Numbered lists matching
                  if (/^\d+\.\s/.test(cleaned)) {
                    const lines = cleaned.split('\n');
                    return (
                      <ol key={index} className="list-decimal pl-6 space-y-3 mt-4">
                        {lines.map((line, lIdx) => (
                          <li key={lIdx} className="pl-1">
                            {line.replace(/^\d+\.\s/, '')}
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <p key={index} className="mb-4">
                      {cleaned}
                    </p>
                  );
                })}
              </div>

              {/* Reading end callout */}
              <div className="mt-12 p-6 bg-surface-container-low rounded-xl border border-outline-variant/40 text-center font-serif text-sm">
                <span className="material-symbols-outlined text-secondary text-3xl mb-2">local_fire_department</span>
                <p className="font-bold text-primary text-base font-display">You have completed this Insight!</p>
                <p className="text-on-surface-variant mt-1 leading-relaxed">
                  Continue building consistent wellness habits by trying our clinical assessments.
                </p>
              </div>
            </div>

            {/* Footer newsletter / quick share section */}
            <div className="px-6 md:px-8 py-4 border-t border-outline-variant/30 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold font-serif">
                Knowledge is energy. Share this insight.
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => alert('Link copied to clipboard!')}
                  className="bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy Link
                </button>
                <button
                  onClick={handleCloseReader}
                  className="bg-secondary text-white px-5 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
