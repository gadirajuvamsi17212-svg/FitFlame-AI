/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DOSHA_QUIZ_QUESTIONS } from '../data';

type ActiveModal = 'quiz' | 'bmi' | 'macros' | 'stress' | 'sleep' | 'notify' | 'gopro' | 'dashboard' | null;

export default function ToolsView() {
  // --- STATE REGISTERS ---
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Dosha Quiz State
  const [quizState, setQuizState] = useState<'intro' | 'questions' | 'result'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<('Vata' | 'Pitta' | 'Kapha')[]>([]);
  const [doshaResult, setDoshaResult] = useState<'Vata' | 'Pitta' | 'Kapha' | null>(null);

  // BMI State
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiVal, setBmiVal] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');

  // Macro State
  const [macroWeight, setMacroWeight] = useState('70');
  const [macroGoal, setMacroGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');
  const [macroActivity, setMacroActivity] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [macroSplit, setMacroSplit] = useState<{ calories: number; protein: number; carbs: number; fat: number } | null>(null);

  // Stress State
  const [stressQ1, setStressQ1] = useState(3);
  const [stressQ2, setStressQ2] = useState(3);
  const [stressQ3, setStressQ3] = useState(3);
  const [stressQ4, setStressQ4] = useState(3);
  const [stressScore, setStressScore] = useState<number | null>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(4);

  // Sleep State
  const [sleepHabits, setSleepHabits] = useState({
    noScreens: false,
    noCaffeine: false,
    sameWakeTime: false,
    coolDarkRoom: false,
    morningSun: false,
  });
  const [sleepScore, setSleepScore] = useState<number | null>(null);

  // Coming soon state
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  // Pro features state
  const [proPlan, setProPlan] = useState<'monthly' | 'annual'>('annual');
  const [proSuccess, setProSuccess] = useState(false);

  // Dashboard Sync Simulation State
  const [dashboardSyncing, setDashboardSyncing] = useState(false);
  const [dashboardSuccess, setDashboardSuccess] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Never');

  // --- INTERACTIVE COMPUTATIONS ---

  // 1. Dosha Quiz tabulation
  const handleAnswerSelect = (dosha: 'Vata' | 'Pitta' | 'Kapha') => {
    const updatedAnswers = [...answers, dosha];
    setAnswers(updatedAnswers);

    if (currentQIndex + 1 < DOSHA_QUIZ_QUESTIONS.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate dominant Dosha
      const counts = updatedAnswers.reduce(
        (acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        },
        { Vata: 0, Pitta: 0, Kapha: 0 }
      );

      let dominant: 'Vata' | 'Pitta' | 'Kapha' = 'Vata';
      if (counts.Pitta > counts[dominant]) dominant = 'Pitta';
      if (counts.Kapha > counts[dominant]) dominant = 'Kapha';

      setDoshaResult(dominant);
      setQuizState('result');
    }
  };

  const restartQuiz = () => {
    setQuizState('intro');
    setCurrentQIndex(0);
    setAnswers([]);
    setDoshaResult(null);
  };

  // 2. BMI Calculation
  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(bmiWeight);
    const h = parseFloat(bmiHeight);
    if (!w || !h) return;

    let computed = 0;
    if (bmiUnit === 'metric') {
      computed = w / Math.pow(h / 100, 2);
    } else {
      computed = (w / Math.pow(h, 2)) * 703;
    }

    const value = parseFloat(computed.toFixed(1));
    setBmiVal(value);

    if (value < 18.5) setBmiCategory('Underweight');
    else if (value >= 18.5 && value < 24.9) setBmiCategory('Normal weight');
    else if (value >= 25 && value < 29.9) setBmiCategory('Overweight');
    else setBmiCategory('Obese');
  };

  // 3. Macro Calculation
  useEffect(() => {
    const wt = parseFloat(macroWeight);
    if (!wt || isNaN(wt)) return;

    // Estimate BMR
    const weightInKg = bmiUnit === 'metric' ? wt : wt * 0.453592;
    const baseBMR = 10 * weightInKg + 625; // Simple Harris-Benedict baseline

    // Activity multiplier
    let activityMultiplier = 1.2;
    if (macroActivity === 'moderate') activityMultiplier = 1.375;
    if (macroActivity === 'active') activityMultiplier = 1.55;

    let targetCalories = Math.round(baseBMR * activityMultiplier);

    // Goal adjustments
    if (macroGoal === 'lose') targetCalories -= 450;
    if (macroGoal === 'gain') targetCalories += 350;

    // Macro distributions (e.g. Protein 30%, Carbs 40%, Fat 30%)
    const proteinGrams = Math.round((targetCalories * 0.3) / 4);
    const carbsGrams = Math.round((targetCalories * 0.4) / 4);
    const fatGrams = Math.round((targetCalories * 0.3) / 9);

    setMacroSplit({
      calories: targetCalories,
      protein: proteinGrams,
      carbs: carbsGrams,
      fat: fatGrams,
    });
  }, [macroWeight, macroGoal, macroActivity, bmiUnit]);

  // 4. Stress Assessment Calculation
  const handleStressCalculate = () => {
    const sum = stressQ1 + stressQ2 + stressQ3 + stressQ4;
    const maxPoss = 20;
    const percentage = Math.round((sum / maxPoss) * 100);
    setStressScore(percentage);
  };

  // Stress relief breathing timer loop
  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingSeconds((prev) => {
          if (prev <= 1) {
            // Swap phases in 4-4-4 cycle
            setBreathingPhase((phase) => {
              if (phase === 'inhale') return 'hold';
              if (phase === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathingSeconds(4);
      setBreathingPhase('inhale');
    }

    return () => clearInterval(interval);
  }, [breathingActive]);

  // 5. Sleep Quality Calculation
  const handleSleepCheckbox = (habit: keyof typeof sleepHabits) => {
    const updated = { ...sleepHabits, [habit]: !sleepHabits[habit] };
    setSleepHabits(updated);

    // Calculate score
    const checkedCount = Object.values(updated).filter(Boolean).length;
    const score = Math.round((checkedCount / 5) * 100);
    setSleepScore(score);
  };

  // Coming soon submit
  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyEmail.trim()) {
      setNotifySubmitted(true);
      setTimeout(() => {
        setNotifyEmail('');
      }, 3000);
    }
  };

  // Pro submission
  const handleProSubmit = () => {
    setProSuccess(true);
  };

  // Dashboard Sync Simulation
  const handleDashboardSync = () => {
    setDashboardSyncing(true);
    setDashboardSuccess(false);
    setTimeout(() => {
      setDashboardSyncing(false);
      setDashboardSuccess(true);
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 2000);
  };

  return (
    <div className="animate-in fade-in duration-500 mt-20 pt-12 pb-16 bg-surface">
      <main className="max-w-[1120px] mx-auto px-6">
        
        {/* Hero Section / Featured Quiz */}
        <section className="mb-16" id="dosha-section">
          <div className="relative w-full min-h-[460px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl flex items-center p-8 md:p-12">
            <div className="absolute inset-0 z-0">
              <img 
                className="w-full h-full object-cover" 
                alt="A serene outdoor scene of a healthy lifestyle with a woman practicing yoga by the deep blue ocean. High-end photography with soft natural morning light." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1cmXmBLto2pteMRgHJ-9C0FsfID9fmunu9SKAXdWGBf4R978fMRzsKh72_Ek-X3K7zzru85OVudLRE6byBqM_jx2h1of-Ypaoe5MPZRlE9Bl9V9V527wKU__9rMMW3L92zOgaSALaxf2L52TaiEqiIwc3dcl-u4NsuYcE8npOgcsAIkY_Z5gWjzAelvNmumHUrW8lZLsRERRgBMF69PzOKMV6qMbQQwax6N4CksyXfqK6U39I10y_x49Ct_KJ4sTT_y6VE7Q0nueE"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b3b98]/95 via-[#3b3b98]/50 to-transparent"></div>
            </div>
            
            <div className="relative z-10 max-w-2xl text-white text-left">
              <span className="bg-[#eb3b5a] px-4 py-1 rounded-full text-xs font-bold mb-6 inline-block uppercase tracking-widest text-white shadow-lg">
                Featured Assessment
              </span>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Ayurvedic <br />Dosha Quiz
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed font-medium max-w-lg">
                Discover your unique mind-body constitution. Align your nutrition and lifestyle with your natural energy profile.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    setQuizState('intro');
                    setActiveModal('quiz');
                  }}
                  className="bg-[#eb3b5a] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all group shadow-[0_10px_25px_-5px_rgba(235,59,90,0.3)] cursor-pointer text-sm md:text-base"
                >
                  Start Quiz 
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <button 
                  onClick={() => {
                    setQuizState('intro');
                    setActiveModal('quiz');
                  }}
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all text-white cursor-pointer text-sm md:text-base"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Grid Section */}
        <section className="mb-20 text-left">
          <h2 className="text-4xl font-black text-[#3b3b98] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Explore Wellness Tools</h2>
          <p className="text-on-surface-variant text-lg mb-10">Scientific and holistic assessments for your health journey.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: BMI & Body Comp */}
            <div 
              onClick={() => setActiveModal('bmi')}
              className="bg-white/90 border border-[#3b3b98]/10 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer border-t-4 border-t-transparent hover:border-t-[#eb3b5a]"
              id="bmi-tool"
            >
              <div className="w-14 h-14 bg-[#eb3b5a]/10 rounded-lg flex items-center justify-center mb-6 text-[#eb3b5a] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl font-bold">monitor_heart</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#3b3b98] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>BMI &amp; Body Comp</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed text-sm md:text-base">
                Calculate your Body Mass Index and understand your body composition ratios for better goal setting.
              </p>
              <div className="flex items-center text-[#eb3b5a] font-bold group-hover:translate-x-2 transition-transform text-sm md:text-base mt-auto">
                Calculate Now <span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
              </div>
            </div>

            {/* Card 2: Macro Calculator */}
            <div 
              onClick={() => setActiveModal('macros')}
              className="bg-white/90 border border-[#3b3b98]/10 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer border-t-4 border-t-transparent hover:border-t-[#eb3b5a]"
              id="macro-tool"
            >
              <div className="w-14 h-14 bg-[#eb3b5a]/10 rounded-lg flex items-center justify-center mb-6 text-[#eb3b5a] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl font-bold">restaurant</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#3b3b98] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Macro Calculator</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed text-sm md:text-base">
                Get personalized protein, carb, and fat targets based on your specific activity level and fitness objectives.
              </p>
              <div className="flex items-center text-[#eb3b5a] font-bold group-hover:translate-x-2 transition-transform text-sm md:text-base mt-auto">
                Get Started <span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
              </div>
            </div>

            {/* Card 3: Stress Score */}
            <div 
              onClick={() => setActiveModal('stress')}
              className="bg-white/90 border border-[#3b3b98]/10 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer border-t-4 border-t-transparent hover:border-t-[#eb3b5a]"
              id="stress-tool"
            >
              <div className="w-14 h-14 bg-[#eb3b5a]/10 rounded-lg flex items-center justify-center mb-6 text-[#eb3b5a] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl font-bold">self_improvement</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#3b3b98] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Stress Score</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed text-sm md:text-base">
                A psychological assessment to measure your current stress levels and receive actionable mindfulness tips.
              </p>
              <div className="flex items-center text-[#eb3b5a] font-bold group-hover:translate-x-2 transition-transform text-sm md:text-base mt-auto">
                Check Stress <span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
              </div>
            </div>

            {/* Card 4: Sleep Quality Tool */}
            <div 
              onClick={() => setActiveModal('sleep')}
              className="bg-white/90 border border-[#3b3b98]/10 backdrop-blur-sm rounded-xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer border-t-4 border-t-transparent hover:border-t-[#eb3b5a]"
              id="sleep-tool"
            >
              <div className="w-14 h-14 bg-[#eb3b5a]/10 rounded-lg flex items-center justify-center mb-6 text-[#eb3b5a] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl font-bold">bedtime</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#3b3b98] mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Sleep Quality Tool</h3>
              <p className="text-on-surface-variant mb-6 leading-relaxed text-sm md:text-base">
                Track your sleep hygiene habits and receive a weekly quality score with personalized improvement plans.
              </p>
              <div className="flex items-center text-[#eb3b5a] font-bold group-hover:translate-x-2 transition-transform text-sm md:text-base mt-auto">
                Audit Sleep <span className="material-symbols-outlined ml-2 text-sm">open_in_new</span>
              </div>
            </div>

            {/* Card 5: Coming Soon */}
            <div 
              onClick={() => {
                setNotifySubmitted(false);
                setActiveModal('notify');
              }}
              className="bg-[#F8F9FA] rounded-xl p-8 hover:shadow-lg transition-all group cursor-pointer border-dashed border-2 border-[#3b3b98]/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-white/50 rounded-lg flex items-center justify-center mb-6 text-[#3b3b98]/30">
                  <span className="material-symbols-outlined text-3xl font-bold">add_circle</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#3b3b98]/40 mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Coming Soon</h3>
                <p className="text-on-surface-variant/60 mb-6 leading-relaxed text-sm md:text-base">
                  Hormone Tracking and Metabolic Health assessments coming soon to your dashboard.
                </p>
              </div>
              <div className="flex items-center text-[#3b3b98]/40 font-bold text-sm md:text-base">
                Notify Me
              </div>
            </div>

            {/* Card 6: Premium (Pro Only) */}
            <div 
              onClick={() => {
                setProSuccess(false);
                setActiveModal('gopro');
              }}
              className="bg-gradient-to-br from-[#3b3b98] to-[#2a2a72] rounded-xl p-8 shadow-2xl text-white relative overflow-hidden group cursor-pointer border-2 border-[#3b3b98] flex flex-col justify-between"
            >
              <div className="relative z-10">
                <span className="bg-[#eb3b5a] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mb-3 inline-block">
                  Pro Only
                </span>
                <h3 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Premium Analysis</h3>
                <p className="opacity-80 mb-6 leading-relaxed text-sm md:text-base">
                  Unlock advanced genetic mapping and blood panel integration for the ultimate blueprint.
                </p>
              </div>
              <div className="relative z-10">
                <button className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none">
                  Go Pro
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-6 -right-6 text-9xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform text-white">
                verified_user
              </span>
            </div>

          </div>
        </section>

        {/* Dashboard Sync Mockup Section */}
        <section className="bg-[#f0f0ff] rounded-3xl p-8 md:p-12 mt-20 flex flex-col lg:flex-row items-center gap-12 border border-[#3b3b98]/5 text-left">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-black text-[#3b3b98] mb-6 leading-tight animate-pulse" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Your data, <br />
              <span className="text-[#eb3b5a]">perfectly visualized.</span>
            </h2>
            <p className="text-[#3b3b98] text-base md:text-lg mb-8 leading-relaxed font-medium">
              Synchronize your assessment results with your wearable devices. Visualize your journey toward peak health with our intelligent data engine.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#eb3b5a] font-black bg-[#eb3b5a]/10 p-1 rounded-full text-sm">check</span>
                <span className="text-[#3b3b98] font-bold text-sm md:text-base">Real-time biometrics tracking</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#eb3b5a] font-black bg-[#eb3b5a]/10 p-1 rounded-full text-sm">check</span>
                <span className="text-[#3b3b98] font-bold text-sm md:text-base">Historical data comparison</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#eb3b5a] font-black bg-[#eb3b5a]/10 p-1 rounded-full text-sm">check</span>
                <span className="text-[#3b3b98] font-bold text-sm md:text-base">AI-driven lifestyle recommendations</span>
              </li>
            </ul>
            <button 
              onClick={() => {
                setDashboardSuccess(false);
                setDashboardSyncing(false);
                setActiveModal('dashboard');
              }}
              className="bg-[#3b3b98] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-opacity-90 active:scale-95 transition-all cursor-pointer text-sm md:text-base border-none"
            >
              Access Dashboard
            </button>
          </div>
          
          <div className="lg:w-1/2 relative w-full flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-[#3b3b98]/10 w-full max-w-lg">
              <img 
                className="w-full h-auto rounded-xl" 
                alt="A clean and modern UI dashboard mockup featuring data visualization charts. Professional navy blue and white theme." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5bQ_o40ZXabOvX9C4ESt5FdJ1FcOgWnLe3D184z3wPFVwcrUhFKSNxPNbOmuqAD5FCvYAhxIPee7CJMzVxTQ_TgxrhRWPXKan7pLV1fFbr_cGEqFFn8hQ3sZibFw0b0AKrOyYHlVzbcxP3ySpA09Qa-yYcwHc_GMKQPmQTup_ByztH3XFPV0rU21lgkFrTbbwyf0xmdBprh3si4F8698gXKLzH2DWTvXcHu3Yi-RbvgjBSQHSwT0wloezvI0mCdlnrbONcy5ApB5"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-8 left-4 md:-left-8 bg-white p-5 rounded-2xl shadow-2xl border border-[#eb3b5a]/10 hidden sm:block animate-bounce duration-1000">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#eb3b5a]/10 rounded-full flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined font-black">trending_up</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest text-left">Health Score</p>
                  <p className="text-2xl font-black text-[#3b3b98]">
                    88<span className="text-sm font-bold text-on-surface-variant">/100</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* =======================================================
          IMMERSIVE OVERLAY MODALS / DRAWERS
         ======================================================= */}

      {/* 1. DOSHA QUIZ MODAL */}
      {activeModal === 'quiz' && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Header section with Close button */}
            <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-gray-100 bg-[#f8f9fa] shrink-0 text-left">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#eb3b5a]/10 flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined">psychology</span>
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Ayurvedic Dosha Quiz</h2>
                  <p className="text-xs text-on-surface-variant font-bold">Mind-Body Constitution Assessment</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-grow overflow-y-auto px-6 md:px-12 py-8 text-left">
              {quizState === 'intro' && (
                <div className="animate-in fade-in duration-300">
                  <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-8 bg-gray-100 shadow-md">
                    <img
                      alt="Ayurvedic medicine"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1cmXmBLto2pteMRgHJ-9C0FsfID9fmunu9SKAXdWGBf4R978fMRzsKh72_Ek-X3K7zzru85OVudLRE6byBqM_jx2h1of-Ypaoe5MPZRlE9Bl9V9V527wKU__9rMMW3L92zOgaSALaxf2L52TaiEqiIwc3dcl-u4NsuYcE8npOgcsAIkY_Z5gWjzAelvNmumHUrW8lZLsRERRgBMF69PzOKMV6qMbQQwax6N4CksyXfqK6U39I10y_x49Ct_KJ4sTT_y6VE7Q0nueE"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-[#3b3b98] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>What are Doshas?</h3>
                  <p className="text-on-surface-variant leading-relaxed mb-6">
                    In Ayurvedic philosophy, the five elements of nature (Space, Air, Fire, Water, Earth) combine in the human body as three biological energies, or **Doshas**: **Vata** (wind), **Pitta** (fire), and **Kapha** (earth).
                  </p>
                  <p className="text-on-surface-variant leading-relaxed mb-8">
                    Everyone has a unique proportion of all three. Knowing your dominant Dosha reveals customized paths for optimal nutrition, fitness, stress management, and restorative sleep.
                  </p>
                  <button
                    onClick={() => setQuizState('questions')}
                    className="bg-[#eb3b5a] text-white px-8 py-4 rounded-full font-bold hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer border-none text-sm md:text-base"
                  >
                    Start Analysis Now
                  </button>
                </div>
              )}

              {quizState === 'questions' && (
                <div className="animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-[#3b3b98]/75">
                    <span>Question {currentQIndex + 1} of {DOSHA_QUIZ_QUESTIONS.length}</span>
                    <span className="text-[#eb3b5a]">Bio-Scan Active</span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full bg-gray-100 h-2.5 rounded-full mb-8 overflow-hidden">
                    <div
                      className="bg-[#eb3b5a] h-full transition-all duration-300"
                      style={{ width: `${((currentQIndex + 1) / DOSHA_QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-8 text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {DOSHA_QUIZ_QUESTIONS[currentQIndex].question}
                  </h3>
                  <div className="space-y-4">
                    {DOSHA_QUIZ_QUESTIONS[currentQIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(opt.dosha)}
                        className="w-full text-left bg-[#F8F9FA] hover:bg-[#3b3b98]/5 border border-gray-200 hover:border-[#3b3b98]/40 p-5 rounded-xl text-sm md:text-base transition-all text-[#3b3b98] font-medium focus:outline-none cursor-pointer flex justify-between items-center"
                      >
                        <span>{opt.text}</span>
                        <span className="material-symbols-outlined text-gray-300 text-lg">circle</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizState === 'result' && doshaResult && (
                <div className="bg-white rounded-2xl animate-in zoom-in-95 duration-300 space-y-6">
                  <div className="bg-green-500 text-white py-2 px-4 rounded-lg font-bold inline-block text-xs uppercase tracking-wider shadow-md">
                    ✓ Complete Analysis Generated
                  </div>
                  <p className="text-xs uppercase tracking-widest text-[#3b3b98]/70 font-bold mb-0">Your Dominant Mind-Body Constitution:</p>
                  <h2 className="text-4xl md:text-5xl font-black text-[#eb3b5a]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {doshaResult} Dominant
                  </h2>

                  <div className="prose text-on-surface-variant space-y-4 leading-relaxed">
                    {doshaResult === 'Vata' && (
                      <p>
                        <strong>Vata (Space & Air)</strong> energy represents movement, flexibility, and creativity. You are likely light-framed, active, spontaneous, and intellectually quick. When in balance, you are joyful and innovative. When out of balance, Vata leads to anxiety, dry skin, gas/bloating, and insomnia.
                      </p>
                    )}
                    {doshaResult === 'Pitta' && (
                      <p>
                        <strong>Pitta (Fire & Water)</strong> energy represents transformation, digestion, and intelligence. You are likely athletic, precise, focused, and ambitious. When in balance, you are a natural leader. When out of balance, Pitta leads to irritation, acid reflux, skin rashes, and over-competitiveness.
                      </p>
                    )}
                    {doshaResult === 'Kapha' && (
                      <p>
                        <strong>Kapha (Earth & Water)</strong> energy represents lubrication, structure, and stability. You are likely strong-built, calm, patient, caring, and reliable. When in balance, you are loving and supportive. When out of balance, Kapha leads to lethargy, sinus congestion, weight gain, and possessiveness.
                      </p>
                    )}
                  </div>

                  <div className="p-6 bg-[#f8f9fa] rounded-xl border border-gray-200 text-sm leading-relaxed space-y-3">
                    <h4 className="font-bold text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>💡 Personalized Integrative Protocol</h4>
                    {doshaResult === 'Vata' && (
                      <p>
                        <strong>Diet:</strong> Warm, nourishing, easily digestible foods. Rich stews, soups, cooked grains, and healthy fats. Avoid cold drinks, raw salads, and dry crackers.<br />
                        <strong>Fitness:</strong> Slow, grounding exercises. Hatha yoga, walking in nature, and light strength training. Avoid excessive high-impact cardio.
                      </p>
                    )}
                    {doshaResult === 'Pitta' && (
                      <p>
                        <strong>Diet:</strong> Cool, refreshing, mildly spiced foods. Fresh vegetables, sweet fruits (melons, berries), cucumbers, mint, and coconut oil. Avoid hot chili, garlic, and vinegar.<br />
                        <strong>Fitness:</strong> Workouts in cool settings. Swimming, moderate jogging, and cycling. Avoid competing intensely under direct hot sunlight.
                      </p>
                    )}
                    {doshaResult === 'Kapha' && (
                      <p>
                        <strong>Diet:</strong> Warm, light, spicy, and astringent foods. Abundant leafy greens, ginger, hot tea, and light legumes. Avoid heavy dairy, sweets, and processed fats.<br />
                        <strong>Fitness:</strong> Vigorous, high-energy movement. HIIT, power yoga, fast dancing, or martial arts. Avoid long afternoon naps or static routines.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={restartQuiz}
                    className="bg-[#3b3b98] text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-all cursor-pointer border-none"
                  >
                    Retake Bio-Analysis
                  </button>
                </div>
              )}
            </div>

            {/* Footer newsletter / quick share section */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Clinical assessment. Powered by FitFlame Science.
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md border-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. BMI & BODY COMP MODAL */}
      {activeModal === 'bmi' && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-gray-100 bg-[#f8f9fa] shrink-0 text-left">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#eb3b5a]/10 flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined">monitor_heart</span>
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>BMI &amp; Body Comp Calculator</h2>
                  <p className="text-xs text-on-surface-variant font-bold">Standard Body Composition Ratios</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto px-6 md:px-12 py-8 text-left space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#3b3b98] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Calculate Body Mass Index</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  BMI is a convenient clinical metric indicating whether an adult falls into an optimal weight classification corresponding to their overall height.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Inputs */}
                <form onSubmit={calculateBMI} className="space-y-6">
                  {/* Unit Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#3b3b98]">System Units</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="bmi-unit"
                          checked={bmiUnit === 'metric'}
                          onChange={() => {
                            setBmiUnit('metric');
                            setBmiWeight('');
                            setBmiHeight('');
                            setBmiVal(null);
                          }}
                          className="text-[#eb3b5a] focus:ring-[#eb3b5a] border-gray-300"
                        />
                        Metric (kg / cm)
                      </label>
                      <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="bmi-unit"
                          checked={bmiUnit === 'imperial'}
                          onChange={() => {
                            setBmiUnit('imperial');
                            setBmiWeight('');
                            setBmiHeight('');
                            setBmiVal(null);
                          }}
                          className="text-[#eb3b5a] focus:ring-[#eb3b5a] border-gray-300"
                        />
                        Imperial (lbs / in)
                      </label>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#3b3b98]">
                      Weight ({bmiUnit === 'metric' ? 'Kilograms' : 'Pounds'})
                    </label>
                    <input
                      type="number"
                      placeholder={bmiUnit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                      value={bmiWeight}
                      onChange={(e) => setBmiWeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#eb3b5a] focus:border-transparent outline-none font-semibold text-sm bg-[#F8F9FA]"
                      required
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#3b3b98]">
                      Height ({bmiUnit === 'metric' ? 'Centimeters' : 'Inches'})
                    </label>
                    <input
                      type="number"
                      placeholder={bmiUnit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                      value={bmiHeight}
                      onChange={(e) => setBmiHeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#eb3b5a] focus:border-transparent outline-none font-semibold text-sm bg-[#F8F9FA]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#eb3b5a] text-white font-bold rounded-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-md text-sm border-none"
                  >
                    Calculate BMI Ratio
                  </button>
                </form>

                {/* Gauge & Results */}
                <div className="bg-[#F8F9FA] p-6 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[300px]">
                  {bmiVal === null ? (
                    <div className="text-center text-on-surface-variant/70 space-y-2">
                      <span className="material-symbols-outlined text-4xl text-[#3b3b98]/30">query_stats</span>
                      <p className="text-sm font-semibold font-display text-[#3b3b98]">No compilation loaded</p>
                      <p className="text-xs">Enter your details and click calculate to review results.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in zoom-in-95 duration-200">
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-wider text-[#3b3b98]/70 mb-1">Your Index Ratio:</p>
                        <h3 className="text-5xl font-black text-[#eb3b5a]" style={{ fontFamily: 'Manrope, sans-serif' }}>{bmiVal}</h3>
                        <p className="text-lg font-extrabold text-[#3b3b98] mt-2">{bmiCategory}</p>
                      </div>

                      {/* Visual Progress gauge */}
                      <div className="space-y-2">
                        <div className="w-full h-3 bg-gray-200 rounded-full relative overflow-hidden flex">
                          <div className="bg-yellow-400 h-full w-[18.5%]" title="Underweight" />
                          <div className="bg-green-500 h-full w-[25%]" title="Normal" />
                          <div className="bg-orange-400 h-full w-[20%]" title="Overweight" />
                          <div className="bg-red-500 h-full w-[36.5%]" title="Obese" />
                        </div>
                        <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase">
                          <span>18.5 Under</span>
                          <span>24.9 Normal</span>
                          <span>29.9 Over</span>
                          <span>Obese</span>
                        </div>
                      </div>

                      {/* Summary callout box */}
                      <div className="p-4 bg-white rounded-lg border border-gray-100 text-xs md:text-sm text-on-surface-variant leading-relaxed">
                        {bmiCategory === 'Underweight' && (
                          <p>
                            ⚠️ <strong>Clinical Notice:</strong> Your physical ratio falls slightly below optimal baseline heights. Consider talking with our board to organize a nutrient-dense dietary surplus plan.
                          </p>
                        )}
                        {bmiCategory === 'Normal weight' && (
                          <p>
                            ✓ <strong>Clinical Notice:</strong> Congratulations! You are currently resting in the optimal health ratio window. Continue to support metabolic balance with physical exercises and vitamins.
                          </p>
                        )}
                        {bmiCategory === 'Overweight' && (
                          <p>
                            ⚠️ <strong>Clinical Notice:</strong> Your ratio sits slightly above standard. To stimulate lipolysis, consider combining a mild caloric compression window with Zone 2 aerobic training.
                          </p>
                        )}
                        {bmiCategory === 'Obese' && (
                          <p>
                            ⚠️ <strong>Clinical Notice:</strong> Your weight-to-height ratio resides in the clinical obese zone. Regular biomarker monitoring (cholesterol, glucose levels) is highly advised.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Clinical assessment. Powered by FitFlame Science.
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md border-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MACRO CALCULATOR MODAL */}
      {activeModal === 'macros' && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-gray-100 bg-[#f8f9fa] shrink-0 text-left">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#eb3b5a]/10 flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined">restaurant</span>
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Macro Calculator</h2>
                  <p className="text-xs text-on-surface-variant font-bold">Personalized Macro Target Splits</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto px-6 md:px-12 py-8 text-left space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#3b3b98] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Determine Daily Macro targets</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Real-time energetic modeling. Adjusting your body weight, objectives, and training scale will recalculate protein, carb, and fat balances.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Inputs */}
                <div className="space-y-6">
                  {/* Weight input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#3b3b98]">
                      Your Weight ({bmiUnit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      value={macroWeight}
                      onChange={(e) => setMacroWeight(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#eb3b5a] focus:border-transparent outline-none font-semibold text-sm bg-[#F8F9FA]"
                      required
                    />
                  </div>

                  {/* Objective Goal */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#3b3b98]">Your Fitness Objective</label>
                    <select
                      value={macroGoal}
                      onChange={(e) => setMacroGoal(e.target.value as any)}
                      className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-lg font-semibold text-sm focus:ring-2 focus:ring-[#eb3b5a]"
                    >
                      <option value="lose">Calorie Deficit (Fat Loss)</option>
                      <option value="maintain">Maintain Current Mass</option>
                      <option value="gain">Calorie Surplus (Lean Muscle)</option>
                    </select>
                  </div>

                  {/* Daily Activity Scale */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-[#3b3b98]">Activity Scale</label>
                    <select
                      value={macroActivity}
                      onChange={(e) => setMacroActivity(e.target.value as any)}
                      className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-lg font-semibold text-sm focus:ring-2 focus:ring-[#eb3b5a]"
                    >
                      <option value="sedentary">Low/Sedentary (Minimal walk)</option>
                      <option value="moderate">Moderate Training (3-4x weekly)</option>
                      <option value="active">High Performance (Vigorous daily)</option>
                    </select>
                  </div>
                </div>

                {/* Output chart/bars */}
                <div className="bg-[#F8F9FA] p-6 rounded-xl border border-gray-100 min-h-[300px] flex flex-col justify-center">
                  {macroSplit === null ? (
                    <div className="text-center text-[#3b3b98]/40">
                      <p>Calculating splits...</p>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in zoom-in-95 duration-200">
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-wider text-[#3b3b98]/70 mb-1">Target Intake Quota:</p>
                        <h3 className="text-4xl md:text-5xl font-black text-[#eb3b5a]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {macroSplit.calories} <span className="text-lg font-bold text-[#3b3b98]">kcal/day</span>
                        </h3>
                      </div>

                      {/* Progress Bars */}
                      <div className="space-y-4">
                        {/* Protein */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#3b3b98] uppercase tracking-wide">Protein (30%)</span>
                            <span className="text-[#eb3b5a]">{macroSplit.protein}g</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-[#eb3b5a] h-full rounded-full" style={{ width: '30%' }} />
                          </div>
                          <p className="text-[10px] text-on-surface-variant/70 text-right">Provides {macroSplit.protein * 4} kcal</p>
                        </div>

                        {/* Carbs */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#3b3b98] uppercase tracking-wide">Carbohydrates (40%)</span>
                            <span className="text-[#eb3b5a]">{macroSplit.carbs}g</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-[#3b3b98] h-full rounded-full" style={{ width: '40%' }} />
                          </div>
                          <p className="text-[10px] text-on-surface-variant/70 text-right">Provides {macroSplit.carbs * 4} kcal</p>
                        </div>

                        {/* Fats */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-[#3b3b98] uppercase tracking-wide">Dietary Fats (30%)</span>
                            <span className="text-[#eb3b5a]">{macroSplit.fat}g</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full rounded-full" style={{ width: '30%' }} />
                          </div>
                          <p className="text-[10px] text-on-surface-variant/70 text-right">Provides {macroSplit.fat * 9} kcal</p>
                        </div>
                      </div>

                      <p className="text-[10px] text-on-surface-variant leading-normal text-center">
                        *Values computed using adaptive clinical BMR standards. Nutrition density should be favored.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Clinical assessment. Powered by FitFlame Science.
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md border-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. STRESS SCORE & BREATHING MODAL */}
      {activeModal === 'stress' && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-gray-100 bg-[#f8f9fa] shrink-0 text-left">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#eb3b5a]/10 flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined">self_improvement</span>
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Stress Score &amp; Breathing</h2>
                  <p className="text-xs text-on-surface-variant font-bold">Autonomic Balance Appraisal</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBreathingActive(false);
                  setActiveModal(null);
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto px-6 md:px-12 py-8 text-left space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#3b3b98] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Stress Appraisal &amp; Pacing</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Map potential cortisol surges using our simple psychological self-assessment. Then, use the interactive 4-4-4 breathing pacing loop to immediately slow down racing thoughts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Sliders */}
                <div className="space-y-5">
                  <h4 className="text-sm font-black uppercase text-[#3b3b98] tracking-wider">Self-Assessment Metrics</h4>
                  
                  {/* Q1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-[#3b3b98]">
                      <span>Overwhelmed or racing in thoughts?</span>
                      <span className="text-[#eb3b5a]">{stressQ1} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ1}
                      onChange={(e) => setStressQ1(parseInt(e.target.value, 10))}
                      className="w-full accent-[#eb3b5a] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Q2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-[#3b3b98]">
                      <span>Physical tension or neck fatigue?</span>
                      <span className="text-[#eb3b5a]">{stressQ2} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ2}
                      onChange={(e) => setStressQ2(parseInt(e.target.value, 10))}
                      className="w-full accent-[#eb3b5a] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Q3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-[#3b3b98]">
                      <span>Sleep fragmentation / waking?</span>
                      <span className="text-[#eb3b5a]">{stressQ3} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ3}
                      onChange={(e) => setStressQ3(parseInt(e.target.value, 10))}
                      className="w-full accent-[#eb3b5a] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Q4 */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-[#3b3b98]">
                      <span>Mood fluctuations or poor focus?</span>
                      <span className="text-[#eb3b5a]">{stressQ4} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ4}
                      onChange={(e) => setStressQ4(parseInt(e.target.value, 10))}
                      className="w-full accent-[#eb3b5a] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={handleStressCalculate}
                    className="w-full py-3 bg-[#eb3b5a] text-white font-bold rounded-lg hover:opacity-95 transition-all cursor-pointer text-sm border-none shadow-sm"
                  >
                    Evaluate Cortisol Index
                  </button>
                </div>

                {/* Breathing display / dynamic sphere */}
                <div className="bg-[#F8F9FA] p-6 rounded-xl border border-gray-100 flex flex-col items-center justify-center min-h-[320px]">
                  {stressScore === null ? (
                    <div className="text-center text-on-surface-variant/70 space-y-2">
                      <span className="material-symbols-outlined text-4xl text-[#3b3b98]/30">psychology</span>
                      <p className="text-sm font-semibold font-display text-[#3b3b98]">Cortisol Score Pending</p>
                      <p className="text-xs">Submit the stress metrics first to calculate baseline adrenaline ratios.</p>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200">
                      <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-wider text-[#3b3b98]/70 mb-1">Estimated Stress Load:</p>
                        <h4 className="text-2xl md:text-3xl font-black text-[#eb3b5a]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {stressScore}% {stressScore < 40 ? '• Low' : stressScore < 70 ? '• Moderate' : '• High Cortisol'}
                        </h4>
                      </div>

                      {/* Interactive breathing loop widget */}
                      <div className="w-full border-t border-gray-200 pt-5 flex flex-col items-center gap-4">
                        <p className="text-[10px] font-black uppercase text-[#3b3b98] tracking-widest text-center">
                          4-4-4 Tactical Breath Regulator
                        </p>

                        {/* Breathing sphere */}
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          <div
                            className={`absolute rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center ${
                              breathingActive
                                ? breathingPhase === 'inhale'
                                  ? 'w-32 h-32 bg-[#eb3b5a]/20 border-2 border-[#eb3b5a]'
                                  : breathingPhase === 'hold'
                                  ? 'w-32 h-32 bg-[#3b3b98]/20 border-2 border-[#3b3b98] shadow-lg shadow-[#3b3b98]/20'
                                  : 'w-16 h-16 bg-[#eb3b5a]/10 border border-[#eb3b5a]/40'
                                : 'w-24 h-24 bg-gray-200 border border-gray-300'
                            }`}
                          />
                          <div className="relative z-10 text-center">
                            <p className="text-xs font-black uppercase text-[#3b3b98]">
                              {breathingActive ? breathingPhase : 'Standby'}
                            </p>
                            <p className="text-2xl font-black text-[#eb3b5a] mt-1">
                              {breathingActive ? `${breathingSeconds}s` : 'Ready'}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setBreathingActive(!breathingActive)}
                          className={`px-5 py-2 rounded-full font-bold text-xs uppercase cursor-pointer transition-all border-none ${
                            breathingActive ? 'bg-[#3b3b98] text-white' : 'bg-[#eb3b5a] text-white shadow-md'
                          }`}
                        >
                          {breathingActive ? 'Stop Breathing Loop' : 'Activate 4-4-4 Loop'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Clinical assessment. Powered by FitFlame Science.
              </span>
              <button
                onClick={() => {
                  setBreathingActive(false);
                  setActiveModal(null);
                }}
                className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md border-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SLEEP QUALITY MODAL */}
      {activeModal === 'sleep' && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-gray-100 bg-[#f8f9fa] shrink-0 text-left">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#eb3b5a]/10 flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined">bedtime</span>
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Sleep Quality Assessment</h2>
                  <p className="text-xs text-on-surface-variant font-bold">Circadian Hygiene Verification</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto px-6 md:px-12 py-8 text-left space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#3b3b98] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Analyze Circadian Syncing</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Evaluate overnight habits to confirm optimal lymphatic drainage, melatonin release pathways, and restorative deep-wave cycles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Checklist checkboxes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-black uppercase text-[#3b3b98] tracking-wider mb-2">Check Habit Compliance</h4>
                  
                  {/* Item 1 */}
                  <label className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.noScreens}
                      onChange={() => handleSleepCheckbox('noScreens')}
                      className="mt-1 rounded text-[#eb3b5a] focus:ring-[#eb3b5a] border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#3b3b98]">No Screen Photons 1h Prior</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Prevents high-lux blue light suppressing natural melatonin synthesis.</p>
                    </div>
                  </label>

                  {/* Item 2 */}
                  <label className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.noCaffeine}
                      onChange={() => handleSleepCheckbox('noCaffeine')}
                      className="mt-1 rounded text-[#eb3b5a] focus:ring-[#eb3b5a] border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#3b3b98]">No Caffeine After 2:00 PM</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Ensures adenosine accumulation in brain receptors for fast sleep onset.</p>
                    </div>
                  </label>

                  {/* Item 3 */}
                  <label className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.sameWakeTime}
                      onChange={() => handleSleepCheckbox('sameWakeTime')}
                      className="mt-1 rounded text-[#eb3b5a] focus:ring-[#eb3b5a] border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#3b3b98]">Consistent Wake Times (±30m)</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Locks down diurnal clock pacing for consistent cortisol and hormone release.</p>
                    </div>
                  </label>

                  {/* Item 4 */}
                  <label className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.coolDarkRoom}
                      onChange={() => handleSleepCheckbox('coolDarkRoom')}
                      className="mt-1 rounded text-[#eb3b5a] focus:ring-[#eb3b5a] border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#3b3b98]">Cool, Blackout Room (65°F)</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Allows core body temperature drop required for delta-wave sleep cycles.</p>
                    </div>
                  </label>

                  {/* Item 5 */}
                  <label className="flex items-start gap-3 p-3 bg-[#F8F9FA] rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.morningSun}
                      onChange={() => handleSleepCheckbox('morningSun')}
                      className="mt-1 rounded text-[#eb3b5a] focus:ring-[#eb3b5a] border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#3b3b98]">Outdoor Morning Sun (10m)</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Stimulates optic receptors to reset diurnal hypothalamic intervals.</p>
                    </div>
                  </label>
                </div>

                {/* Score results */}
                <div className="bg-[#F8F9FA] p-6 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[300px]">
                  {sleepScore === null ? (
                    <div className="text-center text-on-surface-variant/70 space-y-2">
                      <span className="material-symbols-outlined text-4xl text-[#3b3b98]/30">hotel</span>
                      <p className="text-sm font-semibold font-display text-[#3b3b98]">Compliance Tracker Standby</p>
                      <p className="text-xs">Check any habit boxes to trigger live diagnostic scoring algorithms.</p>
                    </div>
                  ) : (
                    <div className="space-y-6 text-center animate-in zoom-in-95 duration-200">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-[#3b3b98]/70 mb-1">Your Circadian Score:</p>
                        <h3 className="text-5xl font-black text-[#eb3b5a]" style={{ fontFamily: 'Manrope, sans-serif' }}>{sleepScore}%</h3>
                        <p className="text-base font-bold text-[#3b3b98] mt-2">
                          {sleepScore <= 40 ? 'Disrupted Circadian Sync' : sleepScore <= 80 ? 'Good Rest Baseline' : 'Elite Circadian Architecture'}
                        </p>
                      </div>

                      {/* Bar indicator */}
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div className="bg-[#eb3b5a] h-full rounded-full transition-all duration-300" style={{ width: `${sleepScore}%` }} />
                      </div>

                      {/* Bullet tip box */}
                      <div className="p-4 bg-white rounded-lg border border-gray-100 text-xs md:text-sm text-left text-on-surface-variant">
                        {sleepScore < 60 ? (
                          <p>
                            💡 <strong>Action suggestion:</strong> Gaps detected. We advise a strict screen curfew starting at 9:30 PM, plus placing dark tape over ambient standby LEDs.
                          </p>
                        ) : (
                          <p>
                            ✓ <strong>Action suggestion:</strong> Excellent work! Your melatonin release signals, pineal pathways, and cognitive restoration systems are optimally synchronized.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Clinical assessment. Powered by FitFlame Science.
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md border-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. COMING SOON NOTIFY ME MODAL */}
      {activeModal === 'notify' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-8 text-center relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-on-surface-variant/70 hover:text-[#3b3b98] material-symbols-outlined cursor-pointer border-none bg-transparent"
            >
              close
            </button>

            <div className="space-y-6">
              <div className="w-14 h-14 bg-[#eb3b5a]/10 text-[#eb3b5a] rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl font-bold">add_circle</span>
              </div>
              
              <div>
                <h3 className="text-2xl font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Keep Me Posted</h3>
                <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                  Enter your email address. We will alert you immediately when hormone profiling and dynamic glucose monitoring tools launch on the dashboard.
                </p>
              </div>

              {notifySubmitted ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 animate-in fade-in duration-300 text-sm font-semibold">
                  ✓ Success! You are on the VIP waitlist.
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="space-y-3">
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#eb3b5a] focus:border-transparent outline-none font-semibold text-sm bg-[#F8F9FA]"
                    placeholder="name@example.com"
                    required
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#eb3b5a] text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer text-sm border-none shadow-[0_10px_25px_-5px_rgba(235,59,90,0.3)]"
                  >
                    Subscribe waitlist
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. GO PRO MODAL */}
      {activeModal === 'gopro' && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-gray-100 bg-[#f8f9fa] shrink-0 text-left">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#eb3b5a]/10 flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined">verified_user</span>
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>FitFlame Premium Access</h2>
                  <p className="text-xs text-on-surface-variant font-bold">Unlocking Personalized Epigenetic Analyses</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setProSuccess(false);
                  setActiveModal(null);
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto px-6 md:px-12 py-8 text-left space-y-8">
              {proSuccess ? (
                <div className="text-center py-12 space-y-6 animate-in fade-in duration-300">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl font-bold animate-bounce">
                    ✓
                  </div>
                  <h3 className="text-3xl font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Welcome to FitFlame Pro!</h3>
                  <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Your account has been successfully upgraded to FitFlame Pro. Complete biomarker synchronization, genetic profiling, and private clinical consultations are now fully activated.
                  </p>
                  <button
                    onClick={() => {
                      setProSuccess(false);
                      setActiveModal(null);
                    }}
                    className="bg-[#eb3b5a] text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none shadow-md"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-2xl font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Our Comprehensive Genetic &amp; Blood Blueprint</h3>
                    <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                      Go beyond standard guidelines. Access high-resolution diagnostic panels matching genetic SNPs and deep blood panels directly to your biometrics engine.
                    </p>
                  </div>

                  {/* Pricing grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Plan 1 */}
                    <div 
                      onClick={() => setProPlan('monthly')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                        proPlan === 'monthly' ? 'border-[#eb3b5a] bg-[#eb3b5a]/5' : 'border-gray-200 bg-[#F8F9FA] hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-[#3b3b98]">Monthly Plan</span>
                        {proPlan === 'monthly' && <span className="w-4 h-4 bg-[#eb3b5a] rounded-full border-2 border-white" />}
                      </div>
                      <p className="text-2xl font-black text-[#3b3b98]">$19.99 <span className="text-xs font-bold text-on-surface-variant">/ mo</span></p>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">Perfect for short-term diagnostic scans and dynamic macro-tuning protocols.</p>
                    </div>

                    {/* Plan 2 */}
                    <div 
                      onClick={() => setProPlan('annual')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all relative ${
                        proPlan === 'annual' ? 'border-[#eb3b5a] bg-[#eb3b5a]/5' : 'border-gray-200 bg-[#F8F9FA] hover:border-gray-300'
                      }`}
                    >
                      <span className="absolute top-3 right-3 bg-[#eb3b5a] text-white text-[9px] font-bold py-0.5 px-2 rounded-full">
                        Save 25%
                      </span>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-[#3b3b98]">Annual Longevity Blueprint</span>
                        {proPlan === 'annual' && <span className="w-4 h-4 bg-[#eb3b5a] rounded-full border-2 border-white" />}
                      </div>
                      <p className="text-2xl font-black text-[#3b3b98]">$14.99 <span className="text-xs font-bold text-on-surface-variant">/ mo billed yearly</span></p>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">Our most popular protocol containing two comprehensive genetic assays and persistent board sync.</p>
                    </div>
                  </div>

                  {/* Included features checklist */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h4 className="text-xs font-black text-[#3b3b98] uppercase tracking-wider">What's included in FitFlame Pro</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-on-surface-variant">
                        <span className="material-symbols-outlined text-green-500 font-bold text-sm">check_circle</span>
                        <span>Full DNA saliva profiling package</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-on-surface-variant">
                        <span className="material-symbols-outlined text-green-500 font-bold text-sm">check_circle</span>
                        <span>Direct Apple, Oura, Fitbit APIs</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-on-surface-variant">
                        <span className="material-symbols-outlined text-green-500 font-bold text-sm">check_circle</span>
                        <span>Weekly metabolic blood panels</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs font-bold text-on-surface-variant">
                        <span className="material-symbols-outlined text-green-500 font-bold text-sm">check_circle</span>
                        <span>1-on-1 certified clinical dietitians</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProSubmit}
                    className="w-full py-4 mt-6 bg-[#eb3b5a] text-white font-black rounded-lg hover:brightness-110 active:scale-95 transition-all text-sm border-none shadow-md cursor-pointer"
                  >
                    Confirm upgrade to FitFlame Pro
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Clinical assessment. Powered by FitFlame Science.
              </span>
              <button
                onClick={() => {
                  setProSuccess(false);
                  setActiveModal(null);
                }}
                className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md border-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. CLOUD DASHBOARD SYNC MODAL */}
      {activeModal === 'dashboard' && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col justify-between relative animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex justify-between items-center px-6 md:px-8 py-5 border-b border-gray-100 bg-[#f8f9fa] shrink-0 text-left">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-[#eb3b5a]/10 flex items-center justify-center text-[#eb3b5a]">
                  <span className="material-symbols-outlined">grid_view</span>
                </span>
                <div>
                  <h2 className="text-lg font-black text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>FitFlame Biometrics Engine</h2>
                  <p className="text-xs text-on-surface-variant font-bold">Synchronized Multi-Device Live Feed</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDashboardSuccess(false);
                  setDashboardSyncing(false);
                  setActiveModal(null);
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center cursor-pointer text-on-surface transition-colors focus:outline-none border-none"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto px-6 md:px-12 py-8 text-left space-y-8">
              
              {/* Introduction bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F0F0FF] p-6 rounded-2xl border border-[#3b3b98]/10">
                <div>
                  <h3 className="text-xl font-bold text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Wearable Hardware Synced</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Last API handshake with your cloud: <strong>{lastSyncTime === 'Never' ? 'None today' : lastSyncTime}</strong></p>
                </div>
                <button
                  onClick={handleDashboardSync}
                  disabled={dashboardSyncing}
                  className="bg-[#3b3b98] text-white font-bold py-2.5 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all text-xs disabled:opacity-50 cursor-pointer border-none flex items-center gap-1.5 shadow-sm"
                >
                  <span className={`material-symbols-outlined text-sm ${dashboardSyncing ? 'animate-spin' : ''}`}>sync</span>
                  {dashboardSyncing ? 'Syncing Wearables...' : 'Sync Wearables'}
                </button>
              </div>

              {/* Grid of live biometrics cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <div className="p-5 bg-[#F8F9FA] rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Resting Heart Rate</span>
                    <span className="material-symbols-outlined text-red-500 font-bold">favorite</span>
                  </div>
                  <p className="text-3xl font-black text-[#3b3b98] font-display">58 <span className="text-xs font-bold text-on-surface-variant">bpm</span></p>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mt-2">
                    <span className="material-symbols-outlined text-sm font-bold">arrow_downward</span>
                    <span>-4% (lower load vs yesterday)</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-5 bg-[#F8F9FA] rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Active Energy</span>
                    <span className="material-symbols-outlined text-orange-500 font-bold">local_fire_department</span>
                  </div>
                  <p className="text-3xl font-black text-[#3b3b98] font-display">840 <span className="text-xs font-bold text-on-surface-variant">kcal</span></p>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mt-2">
                    <span className="material-symbols-outlined text-sm font-bold">arrow_upward</span>
                    <span>+12% (surpassed daily baseline)</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-5 bg-[#F8F9FA] rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-black text-on-surface-variant uppercase tracking-wider">Deep Restorative Sleep</span>
                    <span className="material-symbols-outlined text-indigo-500 font-bold">bedtime</span>
                  </div>
                  <p className="text-3xl font-black text-[#3b3b98] font-display">2h 15m</p>
                  <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold mt-2">
                    <span className="material-symbols-outlined text-sm font-bold">arrow_upward</span>
                    <span>+20% (long deep-wave sequence)</span>
                  </div>
                </div>
              </div>

              {/* Data Visualization graphs (Gorgeous SVG curves) */}
              <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="font-bold text-base text-[#3b3b98]" style={{ fontFamily: 'Manrope, sans-serif' }}>Weekly Biomarker Trajectory</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wider font-bold">Composite Autonomic State Index</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-[#eb3b5a]"><span className="w-2.5 h-2.5 rounded-full bg-[#eb3b5a]" /> Actual Score</span>
                    <span className="flex items-center gap-1.5 text-[#3b3b98]"><span className="w-2.5 h-2.5 rounded-full bg-[#3b3b98]" /> Baseline Target</span>
                  </div>
                </div>

                {/* Clean inline SVG Chart */}
                <div className="relative w-full h-48 bg-white border border-gray-100 rounded-xl px-4 py-6">
                  <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f3f9" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f3f9" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f3f9" strokeWidth="1" strokeDasharray="3,3" />
                    
                    {/* SVG Curve for Baseline Target (indigo) */}
                    <path
                      d="M 0 50 Q 125 45 250 52 T 500 48"
                      fill="none"
                      stroke="#3b3b98"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                    />

                    {/* SVG Curve for Actual Score (Vibrant Red) */}
                    <path
                      d="M 0 65 C 80 55, 120 20, 200 40 C 280 60, 360 10, 500 15"
                      fill="none"
                      stroke="#eb3b5a"
                      strokeWidth="3.5"
                    />

                    {/* Interactive nodes on actual curve */}
                    <circle cx="200" cy="40" r="4.5" fill="#eb3b5a" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="500" cy="15" r="4.5" fill="#eb3b5a" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                  
                  {/* Chart X axis markers */}
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-2 px-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed (Dosha Exam)</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun (Optimal)</span>
                  </div>
                </div>
              </div>

              {/* Hardware devices sync list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5bQ_o40ZXabOvX9C4ESt5FdJ1FcOgWnLe3D184z3wPFVwcrUhFKSNxPNbOmuqAD5FCvYAhxIPee7CJMzVxTQ_TgxrhRWPXKan7pLV1fFbr_cGEqFFn8hQ3sZibFw0b0AKrOyYHlVzbcxP3ySpA09Qa-yYcwHc_GMKQPmQTup_ByztH3XFPV0rU21lgkFrTbbwyf0xmdBprh3si4F8698gXKLzH2DWTvXcHu3Yi-RbvgjBSQHSwT0wloezvI0mCdlnrbONcy5ApB5" alt="Oura" className="w-8 h-8 rounded-full object-contain bg-gray-50 p-1" />
                    <div>
                      <p className="text-xs font-bold text-[#3b3b98]">Oura Ring API</p>
                      <p className="text-[9px] text-green-600 font-bold uppercase">● Live Connected</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-green-600 text-sm font-bold">check_circle</span>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5bQ_o40ZXabOvX9C4ESt5FdJ1FcOgWnLe3D184z3wPFVwcrUhFKSNxPNbOmuqAD5FCvYAhxIPee7CJMzVxTQ_TgxrhRWPXKan7pLV1fFbr_cGEqFFn8hQ3sZibFw0b0AKrOyYHlVzbcxP3ySpA09Qa-yYcwHc_GMKQPmQTup_ByztH3XFPV0rU21lgkFrTbbwyf0xmdBprh3si4F8698gXKLzH2DWTvXcHu3Yi-RbvgjBSQHSwT0wloezvI0mCdlnrbONcy5ApB5" alt="Apple Health" className="w-8 h-8 rounded-full object-contain bg-gray-50 p-1" />
                    <div>
                      <p className="text-xs font-bold text-[#3b3b98]">Apple HealthKit</p>
                      <p className="text-[9px] text-green-600 font-bold uppercase">● Live Connected</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-green-600 text-sm font-bold">check_circle</span>
                </div>

                <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5bQ_o40ZXabOvX9C4ESt5FdJ1FcOgWnLe3D184z3wPFVwcrUhFKSNxPNbOmuqAD5FCvYAhxIPee7CJMzVxTQ_TgxrhRWPXKan7pLV1fFbr_cGEqFFn8hQ3sZibFw0b0AKrOyYHlVzbcxP3ySpA09Qa-yYcwHc_GMKQPmQTup_ByztH3XFPV0rU21lgkFrTbbwyf0xmdBprh3si4F8698gXKLzH2DWTvXcHu3Yi-RbvgjBSQHSwT0wloezvI0mCdlnrbONcy5ApB5" alt="Fitbit" className="w-8 h-8 rounded-full object-contain bg-gray-50 p-1" />
                    <div>
                      <p className="text-xs font-bold text-[#3b3b98]">Fitbit Sync</p>
                      <p className="text-[9px] text-green-600 font-bold uppercase">● Live Connected</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-green-600 text-sm font-bold">check_circle</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 py-4 border-t border-gray-100 bg-white shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Clinical assessment. Powered by FitFlame Science.
              </span>
              <button
                onClick={() => {
                  setDashboardSuccess(false);
                  setDashboardSyncing(false);
                  setActiveModal(null);
                }}
                className="bg-[#eb3b5a] text-white px-6 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md border-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
