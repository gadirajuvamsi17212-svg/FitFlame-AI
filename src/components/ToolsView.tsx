/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DOSHA_QUIZ_QUESTIONS } from '../data';

export default function ToolsView() {
  // --- STATE REGISTERS ---
  const [activeTab, setActiveTab] = useState<'all' | 'quiz' | 'bmi' | 'macros' | 'stress' | 'sleep'>('all');

  // Dosha Quiz State
  const [quizState, setQuizState] = useState<'intro' | 'questions' | 'result'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<'Vata' | 'Pitta' | 'Kapha'[]>([]);
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
  }, [macroWeight, macroGoal, macroActivity]);

  // 4. Stress Assessment Calculation
  const handleStressCalculate = () => {
    // Score is average of answers (1-5 range) mapped to percentage (0-100%)
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

  return (
    <div className="animate-in fade-in duration-500 mt-20 pt-12 pb-16 bg-surface">
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        {/* Banner with featured ayurvedic quiz */}
        <section className="mb-16" id="dosha-section">
          <div className="relative w-full min-h-[460px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl flex items-center p-6 md:p-12">
            {/* Absolute visual background */}
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover"
                alt="Serene yoga by ocean"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1cmXmBLto2pteMRgHJ-9C0FsfID9fmunu9SKAXdWGBf4R978fMRzsKh72_Ek-X3K7zzru85OVudLRE6byBqM_jx2h1of-Ypaoe5MPZRlE9Bl9V9V527wKU__9rMMW3L92zOgaSALaxf2L52TaiEqiIwc3dcl-u4NsuYcE8npOgcsAIkY_Z5gWjzAelvNmumHUrW8lZLsRERRgBMF69PzOKMV6qMbQQwax6N4CksyXfqK6U39I10y_x49Ct_KJ4sTT_y6VE7Q0nueE"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/60 to-transparent" />
            </div>

            {/* Quiz Content Window */}
            <div className="relative z-10 max-w-xl text-white">
              <span className="bg-secondary px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block uppercase tracking-widest text-white shadow-lg font-display">
                Featured Assessment
              </span>

              {/* Dynamic Quiz Router */}
              {quizState === 'intro' && (
                <div className="animate-in fade-in duration-300">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight font-display tracking-tight">
                    Ayurvedic <br />Dosha Quiz
                  </h1>
                  <p className="text-base md:text-lg opacity-90 mb-8 leading-relaxed font-serif">
                    Discover your unique mind-body constitution. Align your nutrition, daily rhythms, and exercises with your natural biological energy profile.
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setQuizState('questions')}
                      className="bg-secondary text-white px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer red-accent-shadow text-sm"
                    >
                      Start Quiz
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}

              {quizState === 'questions' && (
                <div className="bg-primary/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in slide-in-from-bottom duration-300">
                  <div className="flex justify-between items-center mb-4 text-xs font-bold uppercase tracking-wider text-white/75">
                    <span>Question {currentQIndex + 1} of {DOSHA_QUIZ_QUESTIONS.length}</span>
                    <span>Constitutional Bio-Scan</span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full bg-white/20 h-1.5 rounded-full mb-6 overflow-hidden">
                    <div
                      className="bg-secondary h-full transition-all duration-300"
                      style={{ width: `${((currentQIndex + 1) / DOSHA_QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-6 font-display">
                    {DOSHA_QUIZ_QUESTIONS[currentQIndex].question}
                  </h3>
                  <div className="space-y-3">
                    {DOSHA_QUIZ_QUESTIONS[currentQIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(opt.dosha)}
                        className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/50 p-4 rounded-xl text-sm transition-all text-white focus:outline-none cursor-pointer"
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {quizState === 'result' && doshaResult && (
                <div className="bg-primary/95 border border-white/20 p-6 md:p-8 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
                  <span className="bg-green-600 px-3 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white mb-2 inline-block">
                    Scan Completed
                  </span>
                  <p className="text-xs uppercase tracking-widest text-white/70 mb-1 font-bold">Your Primary Bio-Dosha is:</p>
                  <h2 className="text-4xl md:text-5xl font-black text-secondary font-display mb-4">
                    {doshaResult} Type
                  </h2>

                  {/* Dynamic description outputs */}
                  <div className="text-sm text-white/90 mb-6 space-y-3 font-serif leading-relaxed">
                    {doshaResult === 'Vata' && (
                      <p>
                        Vata types are governed by **Air & Ether**. You are likely thin, creative, fast-moving, and lively. When out of balance, Vata can lead to anxiety, dry skin, cold extremities, and digestive irregular bloating.
                      </p>
                    )}
                    {doshaResult === 'Pitta' && (
                      <p>
                        Pitta types are governed by **Fire & Water**. You are driven, muscular, highly focused, and goal-oriented. When out of balance, Pitta leads to irritability, skin inflammation, hot sensations, and hyper-acidity.
                      </p>
                    )}
                    {doshaResult === 'Kapha' && (
                      <p>
                        Kapha types are governed by **Earth & Water**. You are physically strong, calm, thoughtful, and steady. When out of balance, Kapha manifests as lethargy, sluggish digestion, stubborn weight gain, and sinus congestion.
                      </p>
                    )}
                  </div>

                  {/* Summary tip box */}
                  <div className="bg-white/10 p-4 rounded-xl text-xs md:text-sm text-white border border-white/10 mb-6 font-display">
                    {doshaResult === 'Vata' && (
                      <p>
                        💡 **Clinical Protocol:** Favor warm, cooked foods, sweet/sour/salty seasonings, and grounding, low-impact exercise (slow yoga or walking). Avoid cold drafts and excess stimulants.
                      </p>
                    )}
                    {doshaResult === 'Pitta' && (
                      <p>
                        💡 **Clinical Protocol:** Favor cooling whole foods (cucumbers, avocados, sweet fruits), bitter/sweet spices, and moderate cardiovascular training in cool temperatures. Avoid high-heat environments and spicy condiments.
                      </p>
                    )}
                    {doshaResult === 'Kapha' && (
                      <p>
                        💡 **Clinical Protocol:** Favor warm, light, spicy foods (pungent, bitter, astringent categories) and vigorous daily cardiovascular/HIIT exercises. Avoid fatty heavy dairy and long midday naps.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={restartQuiz}
                    className="bg-white text-primary px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Categories selector */}
        <div className="mb-8 border-b border-outline-variant/30 flex gap-4 md:gap-8 overflow-x-auto pb-4 shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`cursor-pointer pb-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none ${
              activeTab === 'all' ? 'text-secondary border-b-2 border-secondary' : 'text-primary/60 hover:text-secondary'
            }`}
          >
            All Utilities
          </button>
          <button
            onClick={() => setActiveTab('bmi')}
            className={`cursor-pointer pb-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none ${
              activeTab === 'bmi' ? 'text-secondary border-b-2 border-secondary' : 'text-primary/60 hover:text-secondary'
            }`}
          >
            BMI & Composition
          </button>
          <button
            onClick={() => setActiveTab('macros')}
            className={`cursor-pointer pb-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none ${
              activeTab === 'macros' ? 'text-secondary border-b-2 border-secondary' : 'text-primary/60 hover:text-secondary'
            }`}
          >
            Macro targets
          </button>
          <button
            onClick={() => setActiveTab('stress')}
            className={`cursor-pointer pb-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none ${
              activeTab === 'stress' ? 'text-secondary border-b-2 border-secondary' : 'text-primary/60 hover:text-secondary'
            }`}
          >
            Stress score
          </button>
          <button
            onClick={() => setActiveTab('sleep')}
            className={`cursor-pointer pb-2 font-bold text-sm uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none ${
              activeTab === 'sleep' ? 'text-secondary border-b-2 border-secondary' : 'text-primary/60 hover:text-secondary'
            }`}
          >
            Sleep hygiene
          </button>
        </div>

        {/* Tools Layout */}
        <section className="space-y-12">
          {/* 1. BMI TOOL */}
          {(activeTab === 'all' || activeTab === 'bmi') && (
            <div
              className="bg-white border border-outline-variant/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-300"
              id="bmi-tool"
            >
              <div className="lg:w-1/2 w-full">
                <span className="material-symbols-outlined text-secondary text-4xl mb-4">monitor_heart</span>
                <h2 className="text-2xl font-extrabold text-primary mb-3 font-display">BMI & Body Composition</h2>
                <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed font-serif">
                  Calculate your Body Mass Index (BMI) using standard medical ratios to categorize weight targets and establish clinical reference benchmarks.
                </p>

                {/* Input Form */}
                <form onSubmit={calculateBMI} className="space-y-4">
                  {/* Units selector */}
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input
                        type="radio"
                        checked={bmiUnit === 'metric'}
                        onChange={() => {
                          setBmiUnit('metric');
                          setBmiWeight('');
                          setBmiHeight('');
                          setBmiVal(null);
                        }}
                        className="text-secondary focus:ring-secondary border-gray-300"
                      />
                      Metric (kg / cm)
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input
                        type="radio"
                        checked={bmiUnit === 'imperial'}
                        onChange={() => {
                          setBmiUnit('imperial');
                          setBmiWeight('');
                          setBmiHeight('');
                          setBmiVal(null);
                        }}
                        className="text-secondary focus:ring-secondary border-gray-300"
                      />
                      Imperial (lbs / in)
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wide text-primary">
                        Weight ({bmiUnit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        placeholder={bmiUnit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                        value={bmiWeight}
                        onChange={(e) => setBmiWeight(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-semibold text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wide text-primary">
                        Height ({bmiUnit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        placeholder={bmiUnit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                        value={bmiHeight}
                        onChange={(e) => setBmiHeight(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-semibold text-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-md text-sm"
                  >
                    Calculate BMI Ratio
                  </button>
                </form>
              </div>

              {/* Display Result Gauge */}
              <div className="lg:w-1/2 w-full bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 h-full flex flex-col justify-center min-h-[220px]">
                {bmiVal === null ? (
                  <div className="text-center text-on-surface-variant/70 font-serif py-10">
                    <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">query_stats</span>
                    <p className="text-sm font-semibold font-display">No computation loaded yet</p>
                    <p className="text-xs mt-1">Enter your specifications to generate a body composite reference.</p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in zoom-in-95 duration-200">
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-wider text-primary/70 mb-1">Your Calculated BMI:</p>
                      <h3 className="text-5xl font-black text-secondary font-display">{bmiVal}</h3>
                      <p className="text-lg font-extrabold text-primary mt-2 font-display">{bmiCategory}</p>
                    </div>

                    {/* Progress Slider Display */}
                    <div className="space-y-2 mt-4">
                      <div className="w-full h-3 bg-gray-200 rounded-full relative overflow-hidden flex">
                        <div className="bg-yellow-400 h-full w-[18.5%]" title="Underweight" />
                        <div className="bg-green-500 h-full w-[25%]" title="Normal" />
                        <div className="bg-orange-400 h-full w-[20%]" title="Overweight" />
                        <div className="bg-red-500 h-full w-[36.5%]" title="Obese" />
                      </div>
                      <div className="flex justify-between text-[10px] text-on-surface-variant/80 font-bold uppercase">
                        <span>18.5 Under</span>
                        <span>24.9 Normal</span>
                        <span>29.9 Over</span>
                        <span>Obese</span>
                      </div>
                    </div>

                    {/* Clinical Insight */}
                    <div className="p-3.5 bg-white border border-outline-variant/30 rounded-lg text-xs md:text-sm text-on-surface-variant leading-relaxed font-serif">
                      {bmiCategory === 'Underweight' && (
                        <p>
                          ⚠️ **Clinical advice:** Your weight index is below the optimal threshold. We recommend focusing on nutrient-dense calorie plans with balanced strength adaptive resistance loads.
                        </p>
                      )}
                      {bmiCategory === 'Normal weight' && (
                        <p>
                          ✓ **Clinical advice:** Congratulations! Your BMI ratio rests safely inside the optimal health bounds. Support this metabolic efficiency through persistent Zone 2 cardio and plant micro-nutrients.
                        </p>
                      )}
                      {bmiCategory === 'Overweight' && (
                        <p>
                          ⚠️ **Clinical advice:** Your ratio rests in the overweight zone. Focus on circadian-compressed nutrition windows (10-hour windows) and moderate metabolic exercise routines to trigger adipose reduction.
                        </p>
                      )}
                      {bmiCategory === 'Obese' && (
                        <p>
                          ⚠️ **Clinical advice:** Your metabolic ratio is in the obese zone. Routine lipid, glycemic, and cardiovascular screenings are advised. Consider working with clinical dietitians to outline therapeutic deficits.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. MACRO CALCULATOR */}
          {(activeTab === 'all' || activeTab === 'macros') && (
            <div
              className="bg-white border border-outline-variant/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-300"
              id="macro-tool"
            >
              <div className="lg:w-1/2 w-full">
                <span className="material-symbols-outlined text-secondary text-4xl mb-4">restaurant</span>
                <h2 className="text-2xl font-extrabold text-primary mb-3 font-display">Macro Target Splits</h2>
                <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed font-serif">
                  Outline customized target nutrition quotas based on your personal health ambitions (loss, balance, gain) and estimated daily energy metrics.
                </p>

                {/* Form Elements */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-primary">
                      Current Body Weight ({bmiUnit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      value={macroWeight}
                      onChange={(e) => setMacroWeight(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-semibold text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-primary">Your Objective Goal</label>
                    <select
                      value={macroGoal}
                      onChange={(e) => setMacroGoal(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg font-semibold text-sm focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="lose">Calorie Deficit (Lose Weight)</option>
                      <option value="maintain">Maintain Balance & Vitality</option>
                      <option value="gain">Calorie Surplus (Build Lean Mass)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wide text-primary">Daily Activity Scale</label>
                    <select
                      value={macroActivity}
                      onChange={(e) => setMacroActivity(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-lg font-semibold text-sm focus:ring-2 focus:ring-secondary focus:border-transparent"
                    >
                      <option value="sedentary">Low / Sedentary (Minimal walk)</option>
                      <option value="moderate">Moderate Training (3-4x weekly)</option>
                      <option value="active">High Performance (Vigorous daily)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Targets visual display */}
              <div className="lg:w-1/2 w-full bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 h-full flex flex-col justify-center min-h-[260px]">
                {macroSplit === null ? (
                  <div className="text-center text-on-surface-variant/70 font-serif py-10">
                    <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">analytics</span>
                    <p className="text-sm font-semibold">Generating splits...</p>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in zoom-in-95 duration-200">
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-wider text-primary/70 mb-1">Target Intake Quota:</p>
                      <h3 className="text-4xl md:text-5xl font-black text-secondary font-display">
                        {macroSplit.calories} <span className="text-lg font-bold text-primary">kcal/day</span>
                      </h3>
                    </div>

                    {/* Macro Bars */}
                    <div className="space-y-4">
                      {/* Protein */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-primary uppercase tracking-wide">Protein (30%)</span>
                          <span className="text-secondary">{macroSplit.protein}g</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>

                      {/* Carbs */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-primary uppercase tracking-wide">Carbohydrates (40%)</span>
                          <span className="text-secondary">{macroSplit.carbs}g</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '40%' }} />
                        </div>
                      </div>

                      {/* Fat */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-primary uppercase tracking-wide">Dietary Fats (30%)</span>
                          <span className="text-secondary">{macroSplit.fat}g</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-yellow-500 h-full rounded-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] uppercase font-bold text-on-surface-variant/80 tracking-wide text-center">
                      *Note: Calculations use baseline metabolic indexes. Consult registered clinical dietitians.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. STRESS SCORE & BREATH REGULATOR */}
          {(activeTab === 'all' || activeTab === 'stress') && (
            <div
              className="bg-white border border-outline-variant/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-300"
              id="stress-tool"
            >
              <div className="lg:w-1/2 w-full">
                <span className="material-symbols-outlined text-secondary text-4xl mb-4">self_improvement</span>
                <h2 className="text-2xl font-extrabold text-primary mb-3 font-display">Stress Score & Breathing</h2>
                <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed font-serif">
                  A physiological self-assessment to map cortisol spikes and chronic pressure. Use our pacing bio-regulator to restore parasympathetic balance.
                </p>

                {/* Checklist Form */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-primary">
                      <span>How often do you feel overwhelmed or racing in thoughts?</span>
                      <span className="text-secondary">{stressQ1} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ1}
                      onChange={(e) => setStressQ1(parseInt(e.target.value, 10))}
                      className="w-full accent-secondary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-primary">
                      <span>Are you experiencing physical fatigue or tight neck muscles?</span>
                      <span className="text-secondary">{stressQ2} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ2}
                      onChange={(e) => setStressQ2(parseInt(e.target.value, 10))}
                      className="w-full accent-secondary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-primary">
                      <span>How irregular or fragmented is your sleep quality?</span>
                      <span className="text-secondary">{stressQ3} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ3}
                      onChange={(e) => setStressQ3(parseInt(e.target.value, 10))}
                      className="w-full accent-secondary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-primary">
                      <span>Do you struggle to focus or experience mood fluctuations?</span>
                      <span className="text-secondary">{stressQ4} / 5</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={stressQ4}
                      onChange={(e) => setStressQ4(parseInt(e.target.value, 10))}
                      className="w-full accent-secondary"
                    />
                  </div>

                  <button
                    onClick={handleStressCalculate}
                    className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:opacity-95 transition-all cursor-pointer text-sm"
                  >
                    Evaluate Cortisol Index
                  </button>
                </div>
              </div>

              {/* Breathing & assessment window */}
              <div className="lg:w-1/2 w-full bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 h-full flex flex-col items-center justify-center min-h-[300px]">
                {stressScore === null ? (
                  <div className="text-center text-on-surface-variant/70 font-serif py-10">
                    <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">psychology</span>
                    <p className="text-sm font-semibold">Generate cortisol stress appraisal first.</p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200">
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-wider text-primary/70 mb-1">Your Stress Load Score:</p>
                      <h4 className="text-3xl md:text-4xl font-black text-secondary font-display">
                        {stressScore}% {stressScore < 40 ? '• Low' : stressScore < 70 ? '• Moderate' : '• Severe'}
                      </h4>
                    </div>

                    {/* Interactive breathing widget */}
                    <div className="w-full border-t border-gray-200 pt-6 flex flex-col items-center gap-4">
                      <p className="text-xs font-extrabold uppercase text-primary tracking-widest text-center">
                        Sympathetic Pacing Breathing Box (4-4-4)
                      </p>

                      {/* Visual Pacing Breathing Sphere */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <div
                          className={`absolute rounded-full bg-secondary/15 border-2 border-secondary/30 transition-all duration-[4000ms] ease-in-out flex items-center justify-center ${
                            breathingActive
                              ? breathingPhase === 'inhale'
                                ? 'w-32 h-32'
                                : breathingPhase === 'hold'
                                ? 'w-32 h-32 bg-primary/20 border-primary/40'
                                : 'w-16 h-16 bg-red-600/10'
                              : 'w-24 h-24'
                          }`}
                        />
                        <div className="relative z-10 text-center">
                          <p className="text-xs font-black uppercase text-primary">
                            {breathingActive ? breathingPhase : 'Standby'}
                          </p>
                          <p className="text-2xl font-black text-secondary mt-1">
                            {breathingActive ? `${breathingSeconds}s` : 'Ready'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setBreathingActive(!breathingActive)}
                        className={`px-6 py-2 rounded-full font-bold text-xs uppercase cursor-pointer transition-all ${
                          breathingActive ? 'bg-primary text-white' : 'bg-secondary text-white shadow-md'
                        }`}
                      >
                        {breathingActive ? 'Stop Breathing Loop' : 'Activate 4-4-4 Loop'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. SLEEP HYGIENE CHECKLIST */}
          {(activeTab === 'all' || activeTab === 'sleep') && (
            <div
              className="bg-white border border-outline-variant/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-300"
              id="sleep-tool"
            >
              <div className="lg:w-1/2 w-full">
                <span className="material-symbols-outlined text-secondary text-4xl mb-4">bedtime</span>
                <h2 className="text-2xl font-extrabold text-primary mb-3 font-display">Sleep Hygiene Checklist</h2>
                <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed font-serif">
                  A high-trust score model evaluating overnight behavior to verify lymphatic clearance and circadian pacemaker synchronization.
                </p>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.noScreens}
                      onChange={() => handleSleepCheckbox('noScreens')}
                      className="mt-1 rounded text-secondary focus:ring-secondary border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-primary">No Screens 1h Before Bed</p>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">Prevents high-lux blue photons from suppressing melatonin synthesis.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.noCaffeine}
                      onChange={() => handleSleepCheckbox('noCaffeine')}
                      className="mt-1 rounded text-secondary focus:ring-secondary border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-primary">No Caffeine After 2:00 PM</p>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">Allows adenosine receptors to bind properly, supporting deep sleep architecture.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.sameWakeTime}
                      onChange={() => handleSleepCheckbox('sameWakeTime')}
                      className="mt-1 rounded text-secondary focus:ring-secondary border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-primary">Consistent Wake Time (±30m)</p>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">Stabilizes endocrine loops and locks down sleep-pressure timing.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.coolDarkRoom}
                      onChange={() => handleSleepCheckbox('coolDarkRoom')}
                      className="mt-1 rounded text-secondary focus:ring-secondary border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-primary">Cool, Blackout Dark Room</p>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">Ideal temperature (65-68°F) to trigger physiological core-temp drop.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer hover:bg-surface-container/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={sleepHabits.morningSun}
                      onChange={() => handleSleepCheckbox('morningSun')}
                      className="mt-1 rounded text-secondary focus:ring-secondary border-gray-300 h-5 w-5 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold text-primary">Morning Outdoor Sunlight (10m)</p>
                      <p className="text-xs text-on-surface-variant/80 mt-0.5">Stimulates suprachiasmatic nucleus signaling for strong cortisol peaks.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Sleep Score visual */}
              <div className="lg:w-1/2 w-full bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 h-full flex flex-col justify-center min-h-[260px]">
                {sleepScore === null ? (
                  <div className="text-center text-on-surface-variant/70 font-serif py-10">
                    <span className="material-symbols-outlined text-4xl text-primary/30 mb-2">hotel</span>
                    <p className="text-sm font-semibold">Check any behavior box to initiate scoring appraisal.</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-center animate-in zoom-in-95 duration-200">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-primary/70 mb-1">Your Sleep Hygiene Quota:</p>
                      <h3 className="text-5xl font-black text-secondary font-display">{sleepScore}%</h3>
                      <p className="text-base font-extrabold text-primary mt-2 font-display">
                        {sleepScore <= 40 ? 'Sluggish Hygiene' : sleepScore <= 80 ? 'Optimal Baseline' : 'Excellent Circadian Shield'}
                      </p>
                    </div>

                    {/* Progress visual bar */}
                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full transition-all duration-300" style={{ width: `${sleepScore}%` }} />
                    </div>

                    <div className="p-3 bg-white border border-outline-variant/30 rounded-xl text-xs md:text-sm text-left text-on-surface-variant font-serif leading-relaxed">
                      {sleepScore < 60 ? (
                        <p>
                          💡 **Wellness suggestion:** Your baseline hygiene has gaps. We recommend setting a strict 10:00 PM digital blackout screen rule.
                        </p>
                      ) : (
                        <p>
                          ✓ **Wellness suggestion:** Excellent circadian habits! Your autonomic nerve pathways and deep sleep brain wave structures are well supported.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Wearable Dashboard Sync mockup card */}
        <section className="bg-primary-container rounded-3xl p-8 md:p-12 mt-20 flex flex-col lg:flex-row items-center gap-12 border border-primary/5">
          <div className="lg:w-1/2 w-full text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary mb-6 leading-tight font-display tracking-tight">
              Your biometrics, <br />
              <span className="text-secondary">perfectly synchronized.</span>
            </h2>
            <p className="text-on-primary-container text-base md:text-lg mb-8 leading-relaxed font-serif">
              Our advanced analytical cloud bridges health metrics gathered via Oura, Fitbit, or Apple Health to visualize real-time biomarker adaptation.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary font-black bg-secondary/10 p-1 rounded-full text-sm">
                  check
                </span>
                <span className="text-primary font-bold text-sm md:text-base">Real-time biometrics evaluation</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary font-black bg-secondary/10 p-1 rounded-full text-sm">
                  check
                </span>
                <span className="text-primary font-bold text-sm md:text-base">Clinical baseline reference records</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary font-black bg-secondary/10 p-1 rounded-full text-sm">
                  check
                </span>
                <span className="text-primary font-bold text-sm md:text-base">AI-driven lifestyle adaptive planning</span>
              </li>
            </ul>
            <button
              onClick={() => alert('Synchronizing wearables with your local database... Connected!')}
              className="bg-primary text-white px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold shadow-xl hover:bg-opacity-95 transition-all cursor-pointer text-sm"
            >
              Access Cloud Dashboard
            </button>
          </div>
          <div className="lg:w-1/2 w-full relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-primary/10">
              <img
                className="w-full h-auto rounded-xl"
                alt="Cloud sync dashboard panel on laptop"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg5bQ_o40ZXabOvX9C4ESt5FdJ1FcOgWnLe3D184z3wPFVwcrUhFKSNxPNbOmuqAD5FCvYAhxIPee7CJMzVxTQ_TgxrhRWPXKan7pLV1fFbr_cGEqFFn8hQ3sZibFw0b0AKrOyYHlVzbcxP3ySpA09Qa-yYcwHc_GMKQPmQTup_ByztH3XFPV0rU21lgkFrTbbwyf0xmdBprh3si4F8698gXKLzH2DWTvXcHu3Yi-RbvgjBSQHSwT0wloezvI0mCdlnrbONcy5ApB5"
              />
            </div>
            {/* Floating widget badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border border-secondary/10 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined font-black">trending_up</span>
                </div>
                <div>
                  <p className="text-[9px] text-on-surface-variant uppercase font-black tracking-widest">Wellness Score</p>
                  <p className="text-xl font-black text-primary">
                    88<span className="text-xs font-bold text-on-surface-variant">/100</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
