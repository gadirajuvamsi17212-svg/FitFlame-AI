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

  // Micro-interaction Focus States
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate server communication latency (1.5s as requested by layout script)
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
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-[#F8F9FA]" id="contact-hero">
        <div className="max-w-[1280px] mx-auto px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#3B3B98] mb-6 tracking-tight">
            Let's Fuel Your Journey
          </h1>
          <p className="text-xl text-[#44474E] max-w-2xl mx-auto leading-relaxed">
            Have questions about your fitness routine or nutrition plan? Our expert team at FitFlame is here to provide the support you need.
          </p>
        </div>
      </section>

      {/* Main Content: Bento Grid Layout */}
      <section className="py-16 px-8 max-w-[1280px] mx-auto" id="contact-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info Column (Bento Left) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Card 1: Reach Out */}
            <div className="p-8 rounded-xl bg-[#3B3B98] text-white shadow-xl flex flex-col justify-between h-64 overflow-hidden relative" id="info-card-speak">
              <div className="relative z-10 text-left">
                <span className="material-symbols-outlined text-4xl mb-4 text-[#EB3B5A]">headset_mic</span>
                <h3 className="text-2xl font-bold mb-2">Speak with Experts</h3>
                <p className="opacity-90">Get personalized advice from our certified trainers and nutritionists.</p>
              </div>
              <div className="relative z-10 text-xl font-mono font-bold text-left">+1 (800) FIT-FLAME</div>
              {/* Decorative Abstract Shape */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#EB3B5A]/20 rounded-full blur-2xl"></div>
            </div>

            {/* Info Card 2: Email & Social */}
            <div className="p-8 rounded-xl border border-[#C4C6D0] bg-white flex flex-col gap-6 text-left" id="info-card-details">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F1F2F6] flex items-center justify-center text-[#EB3B5A] shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#3B3B98]">Email Us</h4>
                  <p className="text-[#44474E]">support@fitflame.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F1F2F6] flex items-center justify-center text-[#EB3B5A] shrink-0">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#3B3B98]">Visit Our HQ</h4>
                  <p className="text-[#44474E]">123 Wellness Plaza, Austin, TX 78701</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#C4C6D0]">
                <p className="text-sm font-bold text-[#74777F] uppercase tracking-widest mb-4">Connect With Us</p>
                <div className="flex gap-4">
                  <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full border border-[#C4C6D0] flex items-center justify-center text-[#3B3B98] hover:bg-[#EB3B5A] hover:border-[#EB3B5A] hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">share</span>
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full border border-[#C4C6D0] flex items-center justify-center text-[#3B3B98] hover:bg-[#EB3B5A] hover:border-[#EB3B5A] hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">groups</span>
                  </a>
                  <a href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full border border-[#C4C6D0] flex items-center justify-center text-[#3B3B98] hover:bg-[#EB3B5A] hover:border-[#EB3B5A] hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-xl">camera</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Map/Location Teaser */}
            <div className="rounded-xl overflow-hidden h-48 border border-[#C4C6D0] grayscale hover:grayscale-0 transition-all duration-500 shadow-sm" id="map-teaser">
              <img 
                alt="Map of Austin, Texas" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkaopBI-aryPBf2siPV-rvoA93LxSn7eMk2ag5vLol5LPmOVV03tenTY4AsgPDG35jae53yuPTEhZQzCX3GLy1eWNjhI1jmvDdIJlVYqVfqCEwI9yqwj_EAT9AAHRj5nK2dgzcYYfmwjzBUpvVyJO76p5hFgosydU2Cn8BTvSVHtzhqaHl6hoxu4sFxVe64pO37ASzv5mBrMB-BoKSyJficcNxCRCcsta3hlgEolZiy6WJWT1r663kJbHIEgIv8VcGTXpbD_-oHVfZ"
                referrerPolicy="no-referrer"
              />
            </div>

          </div>

          {/* Contact Form Column (Bento Right) */}
          <div className="lg:col-span-7 bg-white border border-[#C4C6D0] rounded-xl p-8 md:p-12 shadow-sm text-left flex flex-col justify-between" id="contact-form-card">
            <div>
              <h2 className="text-3xl font-bold text-[#3B3B98] mb-2">Send a Message</h2>
              <p className="text-[#44474E] mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>

              {isSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2 animate-bounce">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Sent Successfully! Your message has been compiled.
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className={`text-sm font-bold transition-colors duration-200 ${focusedField === 'name' ? 'text-[#EB3B5A]' : 'text-[#3B3B98]'}`}>
                      Full Name
                    </label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-[#C4C6D0] focus:border-[#EB3B5A] focus:ring-1 focus:ring-[#EB3B5A] outline-none transition-all font-semibold text-sm" 
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <label className={`text-sm font-bold transition-colors duration-200 ${focusedField === 'email' ? 'text-[#EB3B5A]' : 'text-[#3B3B98]'}`}>
                      Email Address
                    </label>
                    <input 
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border border-[#C4C6D0] focus:border-[#EB3B5A] focus:ring-1 focus:ring-[#EB3B5A] outline-none transition-all font-semibold text-sm" 
                      placeholder="john@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className={`text-sm font-bold transition-colors duration-200 ${focusedField === 'subject' ? 'text-[#EB3B5A]' : 'text-[#3B3B98]'}`}>
                    Subject
                  </label>
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-[#C4C6D0] focus:border-[#EB3B5A] focus:ring-1 focus:ring-[#EB3B5A] outline-none transition-all bg-white font-semibold text-sm cursor-pointer"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Fitness Coaching">Fitness Coaching</option>
                    <option value="Nutrition Support">Nutrition Support</option>
                    <option value="Billing Questions">Billing Questions</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className={`text-sm font-bold transition-colors duration-200 ${focusedField === 'message' ? 'text-[#EB3B5A]' : 'text-[#3B3B98]'}`}>
                    Message
                  </label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-lg border border-[#C4C6D0] focus:border-[#EB3B5A] focus:ring-1 focus:ring-[#EB3B5A] outline-none transition-all font-semibold text-sm" 
                    placeholder="How can we help you reach your goals?" 
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 bg-[#EB3B5A] text-white rounded-lg font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 ${isSuccess ? 'bg-green-600' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                      Sending...
                    </>
                  ) : isSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Sent Successfully
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

            {/* Local inbox message log (demonstrating durable/reactive local state representation!) */}
            {savedMessages.length > 0 && (
              <div className="mt-8 pt-8 border-t border-[#C4C6D0]">
                <h4 className="text-xs font-bold uppercase text-[#3B3B98] tracking-widest mb-4">
                  Sent Logs (Stored Locally)
                </h4>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                  {savedMessages.map((msg, idx) => (
                    <div key={idx} className="bg-[#F8F9FA] p-4 rounded-lg border border-[#C4C6D0]/50 text-xs">
                      <div className="flex justify-between font-bold text-[#3B3B98] mb-1">
                        <span>{msg.name} ({msg.subject})</span>
                        <span className="text-[#44474E] font-mono">{msg.timestamp}</span>
                      </div>
                      <p className="text-[#44474E] leading-relaxed line-clamp-2">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#F8F9FA] py-20 border-t border-[#C4C6D0]/30 mb-16" id="newsletter-section">
        <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-[#3B3B98] mb-4">Stay in the loop</h2>
            <p className="text-[#44474E]">Subscribe to our weekly newsletter for the latest fitness tips, healthy recipes, and exclusive FitFlame updates.</p>
          </div>
          <div className="w-full md:w-auto">
            {newsSuccess ? (
              <div className="text-green-600 font-bold px-6 py-3 bg-green-50 rounded-full text-center border border-green-200">
                ✓ Joined successfully!
              </div>
            ) : (
              <form onSubmit={handleNewsSubmit} className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
                <input 
                  type="email"
                  className="flex-grow md:w-80 px-6 py-3 rounded-full border border-[#C4C6D0] focus:ring-2 focus:ring-[#EB3B5A] focus:border-transparent outline-none font-semibold text-sm" 
                  placeholder="Your email address"
                  required
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                />
                <button 
                  type="submit"
                  className="bg-[#EB3B5A] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all cursor-pointer text-sm"
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

