/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  credential: string;
  bio: string;
  img: string;
}

export default function AboutView() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const team: TeamMember[] = [
    {
      name: "Dr. Clara Sterling",
      role: "Chief Wellness Officer",
      credential: "MD, PhD in Metabolic Science",
      bio: "Former clinical researcher at Johns Hopkins, Clara leads the medical advisory board, ensuring every wellness protocol is 100% peer-reviewed.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuASXZakct_XMscknT-UwzqZeBBTPc3THiSa4ANiT0DN32PCbTDc_4od6jx-bLmuLMJILIrbPfzEmwpG0brU945EWtspuRqYgY4HxvH-d_KYm6bEhU5v8wecG-ixtPiBqwiG-nQoIn8ZuoN3lqBGnJ-5sufCKAvFHnklgxIM3MKlimE6SJBEDE9bV7VPdyP2SNaWQQIi_NNrqfjy69Iz0PRFfaQwJAoytFSQogoD5r3v1WX1Pya2ziMo8oG0YOXoADnZBg6u087cdckC"
    },
    {
      name: "Marcus Vance",
      role: "Director of Human Performance",
      credential: "MSc in Kinesiology, Olympic Coach",
      bio: "Marcus designs our progressive athletic routines, combining Zone 2 cardiac endurance with high-load neuro-muscular adaptation.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYEUEdQTM9Kd0DuJoGk5JTh8derFWgtSkwwAmp_FzzzJmZnMYwMXBl7Az7cs8dvyPj_1iEqNd2yKBwgzwMLVgN4EFacblH1uwWcYQKKQLtfJoCNCDZ4MObNkqD52G9zVFexdZEBdcw_LJEJD_pjLZdiFO1iEnn3WdzhSb3bE1xdEkMoiWzl0W5XWdP0R4ITNaW4xA2qf1V3tn6RJ2c6gP1cv54CxrSbrhCrwV-9KZdv7Qqsi8Oar2VlF0wH6U5bnxgnr_kVqShe2OB"
    },
    {
      name: "Aisha Rahal",
      role: "Lead Functional Dietitian",
      credential: "MS, RD, LDN",
      bio: "Aisha curates our nutritional strategies, selecting micronutrient compounds that downregulate cellular stress and improve mitochondrial output.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeBmEnLNly72T_3ycQ2gQIRcC__-GYe8Dnvcss_3e_lplQqOqXnUhrxe9rCwXkRbMZBVQir5_5zHhrPV_bnG6w3lCzSkWmMjIgFcvn-OHF0czHc6UaaOh3v6E2WDGSAXRU9IsZOIA5d07ILCJoekiJN9YycK-Vt-FusQFTBGKIh7bHINevoBcelDjGo9YRUuHW6HLcpqKZ1RjK9W9GR6ViY-2sW7Y8k3rwmgAwFlE40DNrqk0iWmPUAftm9Ma3Aa6Lhtj_onLbco5Z"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setEmail('');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 mt-16 md:mt-20">
      {/* Intro Banner */}
      <section className="bg-surface-container py-16 md:py-24 border-b border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary text-white font-semibold text-xs mb-6 uppercase tracking-widest">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6 font-display tracking-tight">
            Igniting Health Through Science & Habit
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed font-serif">
            At FitFlame, we believe that elite health shouldn't be a mystery reserved for lab technicians and biohacking specialists. Our mission is to democratize high-clarity wellness research, converting complex clinical findings into sustainable, high-impact everyday habits.
          </p>
        </div>
      </section>

      {/* Narrative block */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                alt="Meditation overlooking shore"
                className="w-full h-[400px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9E-rLh63PUwBR1amQV0s5MrLWnXT11zje4C9gmLGeUsi1_O4cUh9XEYH9xSVDgPj60ER7Wm2E1TmXrLsARbBsfNk4_5P0V-wlY0Zmz26ob4lnvDGZEb5CTWsD5Bs7pFZuKvfOauXpoNrF9MQBOftL1NX6LGjUM9xR2B-9LEU-QAC1wd2pISbr1Ilg2uXCTxg_1pVXV_qcfJm56h8O7FwO2pN6p6psXb1hw91RPzkph1uuEN411F7ghlQB5miL-DM8W1nmwT-F9e3y"
              />
            </div>
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -right-4 bg-primary text-white p-6 rounded-xl shadow-xl hidden sm:block">
              <div className="text-3xl font-black text-secondary">100%</div>
              <div className="text-xs uppercase tracking-widest font-bold">Evidence-Based</div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary font-display">
              Bridging Clinical Science and Daily Living
            </h2>
            <div className="h-1 w-20 bg-secondary" />
            <div className="space-y-6 text-base md:text-lg text-on-surface-variant font-serif leading-relaxed">
              <p>
                In the modern landscape, we are overwhelmed by conflicting health recommendations and endless "wellness noise." FitFlame compiles, evaluates, and filters studies to deliver high-integrity guidance on metabolic flexibility, cognitive architecture, and sleep hygiene.
              </p>
              <p>
                Whether it is our precise biomarker awareness frameworks or functional nutrition protocols, we make sure every article, quiz, and metric calculator has a strong clinical foundation. No speculative trends—just proven bio-pathways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Advisory / Team Section */}
      <section className="py-16 md:py-24 bg-surface-container-low" id="team-section">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4 font-display">
              Our Expert Clinical Advisors
            </h2>
            <div className="w-20 h-1 bg-secondary mx-auto mb-6" />
            <p className="text-on-surface-variant text-base md:text-lg">
              FitFlame protocols are curated and vetted by a multi-disciplinary network of physicians, professional athletic trainers, and registered dietitians.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    alt={member.name}
                    className="w-full h-full object-cover"
                    src={member.img}
                  />
                  <div className="absolute bottom-4 left-4 bg-primary/95 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                    {member.credential}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-primary font-display mb-1">{member.name}</h3>
                    <p className="text-secondary text-sm font-bold uppercase tracking-wide mb-4">{member.role}</p>
                    <p className="text-on-surface-variant text-sm font-serif leading-relaxed mb-6">
                      {member.bio}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex gap-4">
                    <span className="material-symbols-outlined text-primary/40 hover:text-secondary cursor-pointer">verified_user</span>
                    <span className="material-symbols-outlined text-primary/40 hover:text-secondary cursor-pointer">share</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Council Stats */}
      <section className="py-16 bg-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,59,90,0.15),transparent)] pointer-events-none" />
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl md:text-5xl font-black text-secondary">500k+</div>
            <div className="text-xs uppercase tracking-widest font-bold mt-2 text-white/70">Active Readers</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-secondary">100%</div>
            <div className="text-xs uppercase tracking-widest font-bold mt-2 text-white/70">Peer-Reviewed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-secondary">12+</div>
            <div className="text-xs uppercase tracking-widest font-bold mt-2 text-white/70">Medical Advisors</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-secondary">24/7</div>
            <div className="text-xs uppercase tracking-widest font-bold mt-2 text-white/70">Habit Guidance</div>
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-margin-desktop text-center">
          <div className="bg-surface-container-low border border-outline-variant/30 p-8 md:p-12 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-extrabold text-primary mb-4 font-display">Join the Health Revolution</h2>
            <p className="text-on-surface-variant max-w-md mx-auto mb-8 font-serif leading-relaxed text-sm md:text-base">
              Subscribe to the weekly FitFlame digest to receive clinical breakdowns, metabolic nutrition strategies, and longevity protocols direct to your inbox.
            </p>
            {success ? (
              <div className="text-green-600 font-bold p-3 bg-green-50 rounded-lg inline-block animate-bounce">
                ✓ Thank you! You have successfully subscribed to the FitFlame newsletter.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  className="flex-grow px-4 py-3 bg-white border border-outline-variant rounded-lg text-on-surface placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Enter your email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all shadow-md cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
