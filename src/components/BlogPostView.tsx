/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data';

interface BlogPostViewProps {
  post: BlogPost;
  onBack: () => void;
  onNavigateToPost: (slug: string) => void;
  onSubscribe: (email: string) => void;
  onNavigateToCategory?: (category: string) => void;
}

export default function BlogPostView({ post, onBack, onNavigateToPost, onSubscribe, onNavigateToCategory }: BlogPostViewProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Set page title when article loads
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${post.title} | FitFlame Insights`;
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => {
      document.title = originalTitle;
    };
  }, [post]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleLocalSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email);
      setEmail('');
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  // Find related posts (exclude current post, prefer same category)
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id)
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (a.category !== post.category && b.category === post.category) return 1;
      return b.id - a.id;
    })
    .slice(0, 3);

  // Helper to render bold text
  const parseBoldText = (text: string) => {
    const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-black text-secondary">{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="animate-in fade-in duration-500 mt-20 pb-0 bg-white">
      <article className="w-full">
        {/* Article Hero Header */}
        <header className="relative py-16 md:py-24 bg-[#f8f9fa] border-b border-gray-100">
          <div className="max-w-[800px] mx-auto px-6 text-left">
            {/* Back to Blog */}
            <button
              onClick={onBack}
              className="group mb-8 inline-flex items-center gap-2 text-sm font-black text-secondary hover:text-primary transition-colors cursor-pointer bg-transparent border-none outline-none"
              id="article-back-btn"
            >
              <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
              Back to Insights
            </button>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => onNavigateToCategory?.(post.category)}
                className="inline-block py-1.5 px-4 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none outline-none"
              >
                {post.category}
              </button>
              <span className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-sm text-primary">timer</span>
                {post.readTime}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-bold text-on-surface-variant">
                Published {post.date}
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary leading-tight tracking-tight mb-8"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              {post.title}
            </h1>

            {/* Author Attribution */}
            <div className="flex items-center gap-4 py-4 border-t border-b border-gray-200/60">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black">
                FF
              </div>
              <div>
                <p className="text-sm font-black text-secondary">FitFlame Medical Board</p>
                <p className="text-xs text-on-surface-variant font-medium">Vetted for accuracy and metabolic synergy</p>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="max-w-[1000px] mx-auto px-6 -mt-8 md:-mt-12 relative z-10">
          <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl bg-gray-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Article Body Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-[800px] mx-auto px-6 text-left">
            <div className="prose max-w-none text-base md:text-lg text-on-surface-variant font-serif leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => {
                const cleaned = paragraph.trim();
                if (!cleaned) return null;

                // Inline Image matching [IMAGE: key | caption]
                if (cleaned.startsWith('[IMAGE: ') && cleaned.endsWith(']')) {
                  const inner = cleaned.slice(8, -1).trim();
                  const [imageKey, caption] = inner.split('|').map(s => s.trim());
                  const imageUrl = post.inlineImages?.[imageKey];
                  if (imageUrl) {
                    return (
                      <figure key={index} className="my-10 text-center select-none">
                        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 aspect-[16/10] md:aspect-[16/9]">
                          <img
                            src={imageUrl}
                            alt={caption || imageKey.replace(/_/g, ' ')}
                            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        {caption && (
                          <figcaption className="mt-3.5 text-xs md:text-sm text-on-surface-variant/70 font-sans italic">
                            {caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }
                }

                // Simple Heading matching
                if (cleaned.startsWith('### ')) {
                  return (
                    <h2
                      key={index}
                      className="text-2xl md:text-3xl font-black text-secondary mt-12 mb-6"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {cleaned.replace('### ', '')}
                    </h2>
                  );
                }
                if (cleaned.startsWith('#### ')) {
                  return (
                    <h3
                      key={index}
                      className="text-xl md:text-2xl font-black text-primary mt-8 mb-4"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {cleaned.replace('#### ', '')}
                    </h3>
                  );
                }

                // Bullet Lists matching
                if (cleaned.startsWith('* ')) {
                  const lines = cleaned.split('\n');
                  return (
                    <ul key={index} className="list-dash pl-6 space-y-3 mt-4 mb-6 font-sans text-sm md:text-base border-l-2 border-primary/25">
                      {lines.map((line, lIdx) => (
                        <li key={lIdx} className="pl-1 text-on-surface-variant">
                          {parseBoldText(line.replace(/^\*\s+/, ''))}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // Numbered Lists matching
                if (/^\d+\.\s/.test(cleaned)) {
                  const lines = cleaned.split('\n');
                  return (
                    <ol key={index} className="list-decimal pl-6 space-y-4 mt-4 mb-6 font-sans text-sm md:text-base">
                      {lines.map((line, lIdx) => (
                        <li key={lIdx} className="pl-1 text-on-surface-variant">
                          {parseBoldText(line.replace(/^\d+\.\s+/, ''))}
                        </li>
                      ))}
                    </ol>
                  );
                }

                // Render standard paragraph with support for bold tags
                return (
                  <p key={index} className="mb-6 leading-relaxed">
                    {parseBoldText(cleaned)}
                  </p>
                );
              })}
            </div>

            {/* Reading end callout */}
            <div className="mt-16 p-8 bg-[#f8f9fa] rounded-3xl border border-gray-100 text-center font-serif text-sm relative overflow-hidden shadow-sm">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
              <span className="material-symbols-outlined text-primary text-4xl mb-3">local_fire_department</span>
              <p className="font-black text-secondary text-lg mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>You have completed this Insight!</p>
              <p className="text-on-surface-variant mt-1 leading-relaxed max-w-md mx-auto">
                Continue building consistent wellness habits by trying out our clinical calculators and personal diagnostics.
              </p>
            </div>

            {/* Interactive Actions (Copy link, back) */}
            <div className="mt-12 flex flex-wrap gap-4 items-center justify-between pt-8 border-t border-gray-100">
              <button
                onClick={onBack}
                className="px-6 py-3 border border-gray-200 text-secondary hover:bg-gray-50 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer bg-white"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Articles
              </button>

              <button
                onClick={handleCopyLink}
                className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-none shadow-sm ${
                  copied
                    ? 'bg-green-600 text-white'
                    : 'bg-secondary text-white hover:opacity-95'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied Link!' : 'Share Article'}
              </button>
            </div>
          </div>
        </section>

        {/* Related Insights Grid */}
        <section className="bg-[#f8f9fa] py-20 border-t border-gray-100">
          <div className="max-w-[1120px] mx-auto px-6">
            <h3
              className="text-3xl font-black text-secondary mb-12 text-left"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Related Vitality Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.id}
                  onClick={() => onNavigateToPost(rPost.slug)}
                  className="group cursor-pointer bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Related Image */}
                    <div className="overflow-hidden rounded-2xl aspect-[16/10] mb-5 bg-gray-100">
                      <img
                        src={rPost.image}
                        alt={rPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Category */}
                    <span className="inline-block py-0.5 px-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg mb-3">
                      {rPost.category}
                    </span>
                    {/* Title */}
                    <h4
                      className="text-lg font-black text-secondary leading-snug group-hover:text-primary transition-colors mb-2 line-clamp-2"
                      style={{ fontFamily: 'Manrope, sans-serif' }}
                    >
                      {rPost.title}
                    </h4>
                    {/* Excerpt */}
                    <p className="text-on-surface-variant text-xs line-clamp-2 leading-relaxed mb-4">
                      {rPost.excerpt}
                    </p>
                  </div>

                  <span className="text-primary font-black text-xs flex items-center gap-1 mt-2">
                    Read Article <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter / CTA Section */}
        <section className="bg-secondary py-20 relative overflow-hidden text-center">
          <div className="max-w-[800px] mx-auto px-6 relative z-10">
            <div className="inline-block p-3 rounded-2xl bg-primary mb-6 shadow-xl">
              <span className="material-symbols-outlined text-white text-3xl">mail</span>
            </div>
            <h3
              className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight"
              style={{ fontFamily: 'Manrope, sans-serif' }}
            >
              Sign Up for FitFlame Digests
            </h3>
            <p className="text-white/80 text-sm md:text-base max-w-md mx-auto mb-8 font-medium">
              Receive science-backed nutritional, sleep, and performance protocol digests delivered straight to your inbox.
            </p>

            {subscribed ? (
              <div className="bg-green-500 text-white p-4 rounded-xl font-bold inline-block shadow-lg animate-bounce">
                ✓ Successfully signed up for FitFlame insights!
              </div>
            ) : (
              <form onSubmit={handleLocalSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
                <input
                  type="email"
                  className="flex-grow px-5 py-4 rounded-xl border-none text-on-surface focus:ring-4 focus:ring-primary/30 font-semibold bg-white outline-none text-sm"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-4 rounded-xl font-black hover:brightness-110 transition-all active:scale-95 shadow-md cursor-pointer text-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </article>
    </div>
  );
}
