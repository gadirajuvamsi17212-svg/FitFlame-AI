/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Utensils, Dumbbell, HeartPulse, Brain, ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface AboutViewProps {
  onNavigate?: (page: Page) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setEmail('');
    }
  };

  const scrollToNarrative = () => {
    document.getElementById('narrative-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16 md:mt-20 overflow-x-hidden"
    >
      {/* Hero Section */}
      <header className="hero-gradient relative py-16 md:py-24 overflow-hidden">
        {/* Abstract SVG Decoration */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 100 C 20 0 50 0 100 100" fill="none" stroke="white" strokeWidth="0.5"></path>
            <path d="M0 50 C 30 100 70 0 100 50" fill="none" stroke="white" strokeWidth="0.5"></path>
          </svg>
        </div>

        <div className="relative max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-white font-semibold text-xs mb-6 uppercase tracking-widest">
              Our Mission
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Igniting Health Through Science &amp; Habit.
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed font-sans">
              FitFlame isn't just a platform; it's a movement dedicated to bridging the gap between clinical wellness research and everyday lifestyle application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => onNavigate?.('blog')}
                className="bg-primary text-white px-8 py-4 rounded-lg font-bold hover:shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer text-sm w-full sm:w-auto text-center"
              >
                Explore the Blog
              </button>
              <button
                onClick={scrollToNarrative}
                className="border border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-sm w-full sm:w-auto text-center"
              >
                Meet the Team
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl transform md:rotate-2">
              <img
                alt="Professional wellness stretching"
                className="w-full h-[250px] md:h-[400px] lg:h-[500px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASXZakct_XMscknT-UwzqZeBBTPc3THiSa4ANiT0DN32PCbTDc_4od6jx-bLmuLMJILIrbPfzEmwpG0brU945EWtspuRqYgY4HxvH-d_KYm6bEhU5v8wecG-ixtPiBqwiG-nQoIn8ZuoN3lqBGnJ-5sufCKAvFHnklgxIM3MKlimE6SJBEDE9bV7VPdyP2SNaWQQIi_NNrqfjy69Iz0PRFfaQwJAoytFSQogoD5r3v1WX1Pya2ziMo8oG0YOXoADnZBg6u087cdckC"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl hidden lg:block border border-outline-variant">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Award className="text-primary w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-secondary text-base">Science-Backed</div>
                  <div className="text-sm text-on-surface-variant whitespace-nowrap">100% Peer-Reviewed Content</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Our Pillars of Wellness Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Our Pillars of Wellness
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-on-surface-variant text-base md:text-lg">
              We focus on four foundational components of health to provide a comprehensive roadmap for long-term longevity and mental clarity.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Functional Nutrition */}
            <div className="md:col-span-8 pillar-card bg-white p-6 md:p-8 rounded-2xl border border-outline-variant transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-6 h-full justify-between">
                <div className="flex-1 flex flex-col justify-center text-left">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Utensils className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Functional Nutrition
                  </h3>
                  <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed">
                    Moving beyond calories to understand how micronutrients fuel cellular performance and metabolic health. Our guides are curated by clinical dietitians.
                  </p>
                  <button
                    onClick={() => onNavigate?.('blog')}
                    className="text-primary font-bold inline-flex items-center gap-2 group hover:underline text-sm md:text-base self-start cursor-pointer"
                  >
                    Read our protocols <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden h-48 md:h-auto min-h-[200px]">
                  <img
                    alt="Functional nutrition"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeBmEnLNly72T_3ycQ2gQIRcC__-GYe8Dnvcss_3e_lplQqOqXnUhrxe9rCwXkRbMZBVQir5_5zHhrPV_bnG6w3lCzSkWmMjIgFcvn-OHF0czHc6UaaOh3v6E2WDGSAXRU9IsZOIA5d07ILCJoekiJN9YycK-Vt-FusQFTBGKIh7bHINevoBcelDjGo9YRUuHW6HLcpqKZ1RjK9W9GR6ViY-2sW7Y8k3rwmgAwFlE40DNrqk0iWmPUAftm9Ma3Aa6Lhtj_onLbco5Z"
                  />
                </div>
              </div>
            </div>

            {/* Exercise Routine */}
            <div className="md:col-span-4 pillar-card bg-white p-6 md:p-8 rounded-2xl border border-outline-variant transition-all duration-300 flex flex-col justify-between text-left">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Dumbbell className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-secondary mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Exercise Routine
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed">
                  Optimized training schedules that balance strength, mobility, and cardiovascular health.
                </p>
              </div>
              <div className="w-full h-40 rounded-xl overflow-hidden mt-auto">
                <img
                  alt="Modern gym"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoIsD5Y4613-zRuYNSp2V0QMw4urVmjN4jG9IO1evEEXQ2vJsQI-On1XTqmnJpLf2vcUf2i3SXrz0vBdugy3QCzgMpjEZmSTaF-P4SafbEVk90CQwkzgbb7o-CvVRtGry_ENVdimkXekhzZBR7o7WA2Gxn3bC8xV_fz4VbeWe_P2tzyRlH1r3AdURctAO28WLxyGH3YcmOxhx1-Zitv_crqTOSBvcAodWoT_0zqKooYSpQkW_Q2PwZLNTlD-MO6nw43DKU68PlhkAu"
                />
              </div>
            </div>

            {/* Preventive Health */}
            <div className="md:col-span-4 pillar-card bg-white p-6 md:p-8 rounded-2xl border border-outline-variant transition-all duration-300 flex flex-col justify-between text-left">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <HeartPulse className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-secondary mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Preventive Health
                </h3>
                <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                  Science-backed screenings and proactive habits that extend healthspan and mitigate risks.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-secondary">Biomarker Awareness</span>
                  <span className="text-sm text-primary font-bold">85%</span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* Mental Performance */}
            <div className="md:col-span-8 pillar-card bg-white p-6 md:p-8 rounded-2xl border border-outline-variant transition-all duration-300">
              <div className="flex flex-col md:flex-row-reverse gap-6 h-full justify-between">
                <div className="flex-1 flex flex-col justify-center text-left">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Brain className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-secondary mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Mental Performance
                  </h3>
                  <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed">
                    Integrating cognitive behavioral tools and mindfulness practices to build psychological resilience.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-semibold text-xs">Mindfulness</span>
                    <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary font-semibold text-xs">Cognitive Health</span>
                  </div>
                </div>
                <div className="flex-1 rounded-xl overflow-hidden h-48 md:h-auto min-h-[200px]">
                  <img
                    alt="Mental clarity"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9E-rLh63PUwBR1amQV0s5MrLWnXT11zje4C9gmLGeUsi1_O4cUh9XEYH9xSVDgPj60ER7Wm2E1TmXrLsARbBsfNk4_5P0V-wlY0Zmz26ob4lnvDGZEb5CTWsD5Bs7pFZuKvfOauXpoNrF9MQBOftL1NX6LGjUM9xR2B-9LEU-QAC1wd2pISbr1Ilg2uXCTxg_1pVXV_qcfJm56h8O7FwO2pN6p6psXb1hw91RPzkph1uuEN411F7ghlQB5miL-DM8W1nmwT-F9e3y"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative Section ("Founded on Clarity") */}
      <section id="narrative-section" className="py-20 bg-[#f8f9fa]">
        <div className="max-w-[1120px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img
              alt="Fitness lifestyle"
              className="rounded-2xl shadow-xl w-full h-[250px] md:h-[400px] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYEUEdQTM9Kd0DuJoGk5JTh8derFWgtSkwwAmp_FzzzJmZnMYwMXBl7Az7cs8dvyPj_1iEqNd2yKBwgzwMLVgN4EFacblH1uwWcYQKKQLtfJoCNCDZ4MObNkqD52G9zVFexdZEBdcw_LJEJD_pjLZdiFO1iEnn3WdzhSb3bE1xdEkMoiWzl0W5XWdP0R4ITNaW4xA2qf1V3tn6RJ2c6gP1cv54CxrSbrhCrwV-9KZdv7Qqsi8Oar2VlF0wH6U5bnxgnr_kVqShe2OB"
            />
          </div>
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Founded on Clarity
            </h2>
            <div className="space-y-6 text-base md:text-lg text-on-surface-variant font-serif leading-relaxed">
              <p>
                In an era of "wellness noise," FitFlame was born from the need for a single, reliable source of truth. We realized that people weren't lacking information—they were lacking synthesis.
              </p>
              <p>
                Our team of clinicians, researchers, and professional athletes collaborate to strip away the jargon, leaving you with actionable insights that actually fit into a busy life.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-black text-primary">500k+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mt-1">
                  Active Readers
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-primary">12+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 mt-1">
                  Medical Advisors
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-[1120px] mx-auto px-6 text-center">
          <div className="bg-secondary text-white p-12 md:p-16 rounded-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 relative z-10" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Start Your Journey Today
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto relative z-10 text-base md:text-lg">
              Join our newsletter and receive our "7 Days of Functional Fuel" guide for free.
            </p>

            {success ? (
              <div className="bg-green-50/10 text-green-300 p-4 rounded-lg font-semibold inline-block relative z-10">
                ✓ You have successfully subscribed to FitFlame!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative z-10">
                <input
                  className="flex-grow bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  placeholder="Enter your email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg text-sm cursor-pointer whitespace-nowrap"
                  type="submit"
                >
                  Join FitFlame
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
