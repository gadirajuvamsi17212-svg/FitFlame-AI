/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ContactMessage } from '../types';

interface ContactViewProps {
  onSubscribe: (email: string) => void;
}

export default function ContactView({ onSubscribe }: ContactViewProps) {
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  // Submission UX States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Local message log
  const [savedMessages, setSavedMessages] = useState<ContactMessage[]>([]);

  // Newsletter State
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate server communication latency
    setTimeout(() => {
      const newMessage: ContactMessage = {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toLocaleTimeString(),
      };

      setSavedMessages((prev) => [newMessage, ...prev]);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form variables
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');

      // Fade out success banner after 4 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 4000);
    }, 1500);
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail.trim()) {
      onSubscribe(newsEmail);
      setNewsSuccess(true);
      setNewsEmail('');
      setTimeout(() => setNewsSuccess(false), 3000);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 mt-20">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden bg-surface-container-low border-b border-outline-variant/35">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop relative z-10 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-white font-semibold text-xs mb-6 uppercase tracking-widest">
            Support Center
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-6 tracking-tight font-display">
            Let's Fuel Your Journey
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-serif">
            Have questions about your fitness routine or nutrition plan? Our expert team at FitFlame is here to provide the support you need.
          </p>
        </div>
      </section>

      {/* Main Grid Layout */}
      <section className="py-16 md:py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details (Bento Left) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Experts card */}
            <div className="p-6 md:p-8 rounded-2xl bg-primary text-white shadow-xl flex flex-col justify-between h-64 overflow-hidden relative">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl mb-4 text-secondary">headset_mic</span>
                <h3 className="text-xl md:text-2xl font-bold mb-2 font-display">Speak with Experts</h3>
                <p className="text-sm text-white/80 leading-relaxed font-serif">
                  Get personalized, clinical-grade advice from our certified physical trainers and nutrition specialists.
                </p>
              </div>
              <div className="relative z-10 text-lg md:text-xl font-mono font-bold tracking-wider">
                +1 (800) FIT-FLAME
              </div>
              {/* Decorative Blur circle */}
              <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Support cards (Email & HQ) */}
            <div className="p-6 md:p-8 rounded-2xl border border-outline-variant/40 bg-white flex flex-col gap-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary font-display text-base">Email Support Channel</h4>
                  <p className="text-on-surface-variant text-sm font-serif">support@fitflame.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h4 className="font-bold text-primary font-display text-base">Visit Our Headquarters</h4>
                  <p className="text-on-surface-variant text-sm font-serif">123 Wellness Plaza, Austin, TX 78701</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-on-surface-variant/70 uppercase tracking-widest mb-3">
                  Connect With Us
                </p>
                <div className="flex gap-3">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-secondary hover:border-secondary hover:text-white transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-secondary hover:border-secondary hover:text-white transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-lg">groups</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-secondary hover:border-secondary hover:text-white transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-lg">photo_camera</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Static Map segment */}
            <div className="rounded-2xl overflow-hidden h-48 border border-outline-variant/45 grayscale hover:grayscale-0 transition-all duration-500 shadow-sm relative group bg-gray-50">
              <img
                alt="Map of Austin, Texas"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkaopBI-aryPBf2siPV-rvoA93LxSn7eMk2ag5vLol5LPmOVV03tenTY4AsgPDG35jae53yuPTEhZQzCX3GLy1eWNjhI1jmvDdIJlVYqVfqCEwI9yqwj_EAT9AAHRj5nK2dgzcYYfmwjzBUpvVyJO76p5hFgosydU2Cn8BTvSVHtzhqaHl6hoxu4sFxVe64pO37ASzv5mBrMB-BoKSyJficcNxCRCcsta3hlgEolZiy6WJWT1r663kJbHIEgIv8VcGTXpbD_-oHVfZ"
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-300" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold text-primary uppercase shadow border border-outline-variant/20">
                HQ Location
              </div>
            </div>
          </div>

          {/* Message form (Bento Right) */}
          <div className="lg:col-span-7 bg-white border border-outline-variant/40 rounded-2xl p-6 md:p-10 shadow-sm flex flex-col justify-between h-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-2 font-display">Send a Message</h2>
              <p className="text-on-surface-variant text-sm md:text-base mb-8 font-serif">
                Fill out the secure form below. Our clinical performance team typically replies within 24 hours.
              </p>

              {isSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2 animate-bounce">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Your inquiry was successfully compiled and transmitted!
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all font-semibold text-sm"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-primary uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all font-semibold text-sm"
                      placeholder="john@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wide">Subject Category</label>
                  <select
                    className="w-full px-4 py-3 bg-white rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all font-semibold text-sm"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option>General Inquiry</option>
                    <option>Fitness Coaching</option>
                    <option>Nutrition Support</option>
                    <option>Billing & Premium Questions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-primary uppercase tracking-wide">Detailed Inquiry</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all font-semibold text-sm"
                    placeholder="How can we help you reach your goals?"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-secondary text-white rounded-lg font-bold text-base hover:opacity-95 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">sync</span>
                      Transmitting...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="material-symbols-outlined">send</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Local inbox message log (demonstrating true local state persistence!) */}
            {savedMessages.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase text-primary tracking-widest mb-4">
                  Sent Logs (Stored Locally)
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {savedMessages.map((msg, idx) => (
                    <div key={idx} className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 text-xs">
                      <div className="flex justify-between font-bold text-primary mb-1">
                        <span>{msg.name} ({msg.subject})</span>
                        <span className="text-on-surface-variant/70 font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-on-surface-variant/90 font-serif leading-relaxed line-clamp-2">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stay in the Loop Bottom Panel */}
      <section className="bg-surface-container-low py-16 border-t border-outline-variant/20 mb-12">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-3 font-display">Stay in the loop</h2>
            <p className="text-on-surface-variant text-sm md:text-base font-serif">
              Subscribe to our weekly newsletter for the latest fitness tips, healthy recipes, and exclusive FitFlame updates.
            </p>
          </div>
          <div className="w-full md:w-auto">
            {newsSuccess ? (
              <div className="text-green-600 font-bold px-4 py-2 bg-green-50 rounded-xl text-center">
                ✓ Joined successfully!
              </div>
            ) : (
              <form onSubmit={handleNewsSubmit} className="flex gap-2 w-full max-w-sm">
                <input
                  type="email"
                  className="flex-grow md:w-64 px-4 py-3 rounded-full border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-semibold text-sm"
                  placeholder="Your email address"
                  required
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer text-sm"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
