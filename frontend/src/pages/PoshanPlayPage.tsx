import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { speakText, isSpeechSupported } from '../utils/speech';
import {
  Gamepad2,
  Star,
  Trophy,
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Heart,
  Smile,
  ShieldCheck,
} from 'lucide-react';

export const PoshanPlayPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'QUIZ' | 'SORT' | 'PLATE' | 'HANDWASH'>('QUIZ');
  const [stars, setStars] = useState<number>(() => {
    return Number(localStorage.getItem('poshan_stars') || 0);
  });
  const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);

  const awardStar = (praiseEn: string, praiseHi: string, praiseKn: string) => {
    const newStars = stars + 1;
    setStars(newStars);
    localStorage.setItem('poshan_stars', String(newStars));

    const praise =
      language === 'hi' ? praiseHi : language === 'kn' ? praiseKn : praiseEn;
    setFeedback({ message: praise, isSuccess: true });
    speakText(praise, language);
  };

  const notifyTryAgain = (msgEn: string, msgHi: string, msgKn: string) => {
    const msg = language === 'hi' ? msgHi : language === 'kn' ? msgKn : msgEn;
    setFeedback({ message: msg, isSuccess: false });
    speakText(msg, language);
  };

  // Activity 1: Picture Quiz State
  const quizQuestions = [
    {
      id: 1,
      promptEn: 'Which fresh fruit gives us lots of Vitamin C to keep our body strong?',
      promptHi: 'कौन सा ताजा फल हमें मजबूत रखने के लिए बहुत सारा विटामिन सी देता है?',
      promptKn: 'ನಮ್ಮ ದೇಹವನ್ನು ಗಟ್ಟಿಯಾಗಿಡಲು ಯಾವ ಹಣ್ಣು ಹೆಚ್ಚು ವಿಟಮಿನ್ ಸಿ ನೀಡುತ್ತದೆ?',
      options: [
        { labelEn: 'Sweet Guava (Amrood)', labelHi: 'मीठा अमरूद', labelKn: 'ಸೀಬೆಹಣ್ಣು', emoji: '🍈', isCorrect: true },
        { labelEn: 'Fried Chips', labelHi: 'तले हुए चिप्स', labelKn: 'ಚಿಪ್ಸ್', emoji: '🍟', isCorrect: false },
        { labelEn: 'Sugary Cola', labelHi: 'मीठा कोला', labelKn: 'ಸಕ್ಕರೆ ಕೋಲಾ', emoji: '🥤', isCorrect: false },
      ],
    },
    {
      id: 2,
      promptEn: 'Which grain makes our bones and teeth super strong with calcium?',
      promptHi: 'कौन सा अनाज कैल्शियम से हमारी हड्डियों और दांतों को मजबूत बनाता है?',
      promptKn: 'ಯಾವ ಧಾನ್ಯವು ಕ್ಯಾಲ್ಸಿಯಂನಿಂದ ನಮ್ಮ ಮೂಳೆ ಮತ್ತು ಹಲ್ಲುಗಳನ್ನು ಬಲಪಡಿಸುತ್ತದೆ?',
      options: [
        { labelEn: 'Ragi (Finger Millet)', labelHi: 'रागी (मडुआ)', labelKn: 'ರಾಗಿ', emoji: '🌾', isCorrect: true },
        { labelEn: 'White Bread', labelHi: 'सफेद ब्रेड', labelKn: 'ಬಿಳಿ ಬ್ರೆಡ್', emoji: '🍞', isCorrect: false },
        { labelEn: 'Candy / Chocolate', labelHi: 'टॉफी / चॉकलेट', labelKn: 'ಚಾಕೊಲೇಟ್', emoji: '🍫', isCorrect: false },
      ],
    },
    {
      id: 3,
      promptEn: 'What should we always do right before eating our meals?',
      promptHi: 'खाना खाने से ठीक पहले हमें हमेशा क्या करना चाहिए?',
      promptKn: 'ಊಟ ಮಾಡುವ ಮೊದಲು ನಾವು ಯಾವಾಗಲೂ ಏನು ಮಾಡಬೇಕು?',
      options: [
        { labelEn: 'Wash hands with soap for 20 seconds', labelHi: 'साबुन से 20 सेकंड हाथ धोएं', labelKn: 'ಸಾಬೂನಿನಿಂದ 20 ಸೆಕೆಂಡ್ ಕೈ ತೊಳೆಯಿರಿ', emoji: '🧼', isCorrect: true },
        { labelEn: 'Watch television screen', labelHi: 'टीवी स्क्रीन देखें', labelKn: 'ಟಿವಿ ನೋಡುವುದು', emoji: '📺', isCorrect: false },
        { labelEn: 'Wipe hands on clothes', labelHi: 'कपड़ों पर हाथ पोंछें', labelKn: 'ಬಟ್ಟೆಗೆ ಕೈ ಒರೆಸುವುದು', emoji: '👕', isCorrect: false },
      ],
    },
  ];

  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      awardStar('Wonderful! You earned a shiny star! ⭐', 'शाबाश! आपने एक चमकीला सितारा जीता! ⭐', 'ಅದ್ಭುತ! ನೀವು ಒಂದು ಹೊಳೆಯುವ ನಕ್ಷತ್ರ ಗಳಿಸಿದ್ದೀರಿ! ⭐');
      setTimeout(() => {
        if (currentQuizIdx < quizQuestions.length - 1) {
          setCurrentQuizIdx(currentQuizIdx + 1);
          setFeedback(null);
        }
      }, 1500);
    } else {
      notifyTryAgain('Good try! Let us try again.', 'अच्छा प्रयास! दोबारा प्रयास करें।', 'ಉತ್ತಮ ಪ್ರಯತ್ನ! ಇನ್ನೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.');
    }
  };

  // Activity 2: Healthy vs Junk Sorting State
  const foodSortItems = [
    { name: 'Fresh Milk & Curd', emoji: '🥛', type: 'HEALTHY' },
    { name: 'Coloured Sugar Candy', emoji: '🍬', type: 'JUNK' },
    { name: 'Green Moong Dal Sprouts', emoji: '🌱', type: 'HEALTHY' },
    { name: 'Deep Fried Samosa', emoji: '🥟', type: 'JUNK' },
    { name: 'Boiled Egg with Cumin', emoji: '🥚', type: 'HEALTHY' },
    { name: 'Packaged Cream Biscuits', emoji: '🍪', type: 'JUNK' },
  ];
  const [sortIdx, setSortIdx] = useState(0);

  const handleSortChoice = (choice: 'HEALTHY' | 'JUNK') => {
    const item = foodSortItems[sortIdx];
    if (item.type === choice) {
      awardStar('Super! That is right! ⭐', 'बहुत बढ़िया! बिल्कुल सही! ⭐', 'ಸೂಪರ್! ಅದು ಸರಿಯಾಗಿದೆ! ⭐');
      setTimeout(() => {
        setSortIdx((sortIdx + 1) % foodSortItems.length);
        setFeedback(null);
      }, 1200);
    } else {
      notifyTryAgain('Think again! Does this help our body grow?', 'फिर सोचिए! क्या यह हमारे शरीर को बढ़ाता है?', 'ಮತ್ತೊಮ್ಮೆ ಯೋಚಿಸಿ! ಇದು ದೇಹ ಬೆಳೆಯಲು ಸಹಾಯ ಮಾಡುತ್ತದೆಯೇ?');
    }
  };

  // Activity 3: Plate Builder State
  const [plate, setPlate] = useState<string[]>([]);
  const plateIngredients = [
    { name: 'Ragi Mudde (Energy)', emoji: '🌾', group: 'GRAIN' },
    { name: 'Moong Dal (Protein)', emoji: '🥣', group: 'PULSE' },
    { name: 'Palak Greens (Vitamins)', emoji: '🥬', group: 'VEG' },
    { name: 'Fresh Curd (Calcium)', emoji: '🥛', group: 'DAIRY' },
    { name: 'Whole Boiled Egg', emoji: '🥚', group: 'PROTEIN' },
  ];

  const addToPlate = (item: string) => {
    if (!plate.includes(item)) {
      const nextPlate = [...plate, item];
      setPlate(nextPlate);
      if (nextPlate.length >= 4) {
        awardStar('Hooray! You built a complete Rainbow Nutrition Plate! ⭐⭐⭐', 'बधाई हो! आपने एक संपूर्ण इंद्रधनुषी थाली बना ली! ⭐⭐⭐', 'ಅಭಿನಂದನೆಗಳು! ನೀವು ಸಂಪೂರ್ಣ ಪೌಷ್ಟಿಕ ತಟ್ಟೆ ತಯಾರಿಸಿದ್ದೀರಿ! ⭐⭐⭐');
      }
    }
  };

  // Activity 4: Handwashing Sequence
  const handwashSteps = [
    { step: 1, text: 'Wet hands with clean water', emoji: '💧' },
    { step: 2, text: 'Apply soap & rub palms together', emoji: '🧼' },
    { step: 3, text: 'Scrub backs of hands & between fingers', emoji: '🖐️' },
    { step: 4, text: 'Clean fingernails and thumbs', emoji: '👍' },
    { step: 5, text: 'Rinse thoroughly under flowing water', emoji: '🚿' },
    { step: 6, text: 'Dry completely with a clean towel', emoji: '🧺' },
  ];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Star Scoreboard */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Anganwadi Joyful Learning (Ages 3–6)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('poshanPlayTitle')}
          </h1>
          <p className="text-sm text-white/90 max-w-xl">
            {t('gameSubtitle')}
          </p>
        </div>

        {/* Star Counter */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black shadow-md">
            <Trophy className="w-7 h-7 text-amber-900" />
          </div>
          <div>
            <p className="text-xs uppercase font-extrabold tracking-wider text-white/80">
              {t('scoreLabel')}
            </p>
            <p className="text-3xl font-black flex items-center gap-1">
              {stars} <Star className="w-6 h-6 fill-amber-300 text-amber-300 inline" />
            </p>
          </div>
        </div>
      </div>

      {/* Game Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'QUIZ', label: t('pictureQuizTab'), icon: Sparkles, color: 'bg-emerald-500' },
          { id: 'SORT', label: t('sortingGameTab'), icon: Smile, color: 'bg-amber-500' },
          { id: 'PLATE', label: t('plateBuilderTab'), icon: Heart, color: 'bg-rose-500' },
          { id: 'HANDWASH', label: t('handwashGameTab'), icon: ShieldCheck, color: 'bg-blue-500' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setFeedback(null);
              }}
              className={`p-4 rounded-2xl border font-bold text-xs sm:text-sm transition flex flex-col items-center justify-center gap-2 ${
                isActive
                  ? 'bg-white border-poshan-500 text-slate-900 shadow-md ring-2 ring-poshan-500'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl ${tab.color} text-white flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Audio & Visual Encouragement Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-center text-sm font-bold shadow-sm transition animate-bounce ${
            feedback.isSuccess
              ? 'bg-emerald-100 border border-emerald-300 text-emerald-950'
              : 'bg-amber-100 border border-amber-300 text-amber-950'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Active Game Stage */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm min-h-[400px] flex flex-col justify-between">
        {/* TAB 1: PICTURE QUIZ */}
        {activeTab === 'QUIZ' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Question {currentQuizIdx + 1} of {quizQuestions.length}</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {language === 'hi'
                  ? quizQuestions[currentQuizIdx].promptHi
                  : language === 'kn'
                  ? quizQuestions[currentQuizIdx].promptKn
                  : quizQuestions[currentQuizIdx].promptEn}
              </h2>

              {isSpeechSupported() && (
                <button
                  onClick={() => {
                    const text =
                      language === 'hi'
                        ? quizQuestions[currentQuizIdx].promptHi
                        : language === 'kn'
                        ? quizQuestions[currentQuizIdx].promptKn
                        : quizQuestions[currentQuizIdx].promptEn;
                    speakText(text, language);
                  }}
                  className="p-2 rounded-xl bg-poshan-50 hover:bg-poshan-100 text-poshan-700 transition"
                  title="Read question aloud"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Big Interactive Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {quizQuestions[currentQuizIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleQuizAnswer(opt.isCorrect)}
                  className="p-6 rounded-3xl border-2 border-slate-200 hover:border-poshan-500 hover:bg-poshan-50/50 hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center gap-3 shadow-sm group"
                >
                  <span className="text-5xl group-hover:scale-110 transition">
                    {opt.emoji}
                  </span>
                  <span className="font-bold text-sm text-slate-800">
                    {language === 'hi' ? opt.labelHi : language === 'kn' ? opt.labelKn : opt.labelEn}
                  </span>
                </button>
              ))}
            </div>

            {currentQuizIdx > 0 && (
              <button
                onClick={() => {
                  setCurrentQuizIdx(0);
                  setFeedback(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold pt-4"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
            )}
          </div>
        )}

        {/* TAB 2: HEALTHY VS JUNK SORTING */}
        {activeTab === 'SORT' && (
          <div className="space-y-6 max-w-xl mx-auto w-full text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Is this food Healthy Every-Day or Occasional Junk?
            </h2>
            <p className="text-xs text-slate-500">
              Tap the green button for body-building food, or red for junk food!
            </p>

            {/* Food item card */}
            <div className="bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-8 max-w-xs mx-auto shadow-sm space-y-3">
              <span className="text-7xl block animate-pulse">
                {foodSortItems[sortIdx].emoji}
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {foodSortItems[sortIdx].name}
              </h3>
            </div>

            {/* Big Touch Choice Buttons */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
              <button
                onClick={() => handleSortChoice('HEALTHY')}
                className="py-5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-base shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>💚 Healthy Food!</span>
              </button>

              <button
                onClick={() => handleSortChoice('JUNK')}
                className="py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-base shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>🚫 Avoid Junk!</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BUILD RAINBOW PLATE */}
        {activeTab === 'PLATE' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Build a Balanced Indian Rainbow Plate 🌈
            </h2>
            <p className="text-xs text-slate-500">
              Pick at least 4 food groups (Grain, Dal, Veggie, Curd) to fill the thali plate!
            </p>

            {/* Visual Thali Plate Container */}
            <div className="w-64 h-64 mx-auto rounded-full border-8 border-amber-200 bg-amber-50/50 shadow-inner flex flex-wrap items-center justify-center p-4 gap-2 relative">
              {plate.length === 0 ? (
                <span className="text-xs text-slate-400 font-bold">
                  Thali is empty! Tap ingredients below.
                </span>
              ) : (
                plate.map((item, i) => (
                  <span key={i} className="text-3xl p-1 bg-white rounded-full shadow-xs animate-scale-up">
                    {plateIngredients.find((p) => p.name === item)?.emoji}
                  </span>
                ))
              )}
            </div>

            {/* Clickable Food Ingredients */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {plateIngredients.map((ing) => {
                const added = plate.includes(ing.name);
                return (
                  <button
                    key={ing.name}
                    disabled={added}
                    onClick={() => addToPlate(ing.name)}
                    className={`px-4 py-2 rounded-2xl border text-xs font-bold transition flex items-center gap-2 shadow-2xs ${
                      added
                        ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                        : 'bg-white border-poshan-400 text-slate-800 hover:bg-poshan-50 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <span className="text-base">{ing.emoji}</span>
                    <span>{ing.name}</span>
                  </button>
                );
              })}
            </div>

            {plate.length > 0 && (
              <button
                onClick={() => {
                  setPlate([]);
                  setFeedback(null);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Clear Plate
              </button>
            )}
          </div>
        )}

        {/* TAB 4: HANDWASHING STEPS */}
        {activeTab === 'HANDWASH' && (
          <div className="space-y-6 max-w-xl mx-auto w-full text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              6-Step Soap Handwashing Demonstration
            </h2>
            <p className="text-xs text-slate-500">
              Follow along step-by-step to chase away bacteria before snacks!
            </p>

            <div className="bg-blue-50/60 border-2 border-blue-200 rounded-3xl p-8 max-w-sm mx-auto shadow-sm space-y-3">
              <span className="text-6xl block">
                {handwashSteps[currentStep - 1].emoji}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                Step {currentStep} of 6
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {handwashSteps[currentStep - 1].text}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-3">
              {currentStep < 6 ? (
                <button
                  onClick={() => {
                    const next = currentStep + 1;
                    setCurrentStep(next);
                    if (next === 6) {
                      awardStar('Bravo! Clean hands keep tummy happy and disease-free! ⭐', 'शाबाश! साफ हाथ पेट को स्वस्थ रखते हैं! ⭐', 'ಭೇಷ್! ಶುದ್ಧ ಕೈಗಳು ಹೊಟ್ಟೆಯನ್ನು ಆರೋಗ್ಯವಾಗಿಡುತ್ತವೆ! ⭐');
                    }
                  }}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
                >
                  Next Handwashing Step →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setFeedback(null);
                  }}
                  className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-md transition"
                >
                  Replay 6-Steps from Start 🔄
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-6 mt-6 border-t border-slate-100 text-center text-xs text-slate-400">
          Anonymous preschool gamification mode • Progress saved to browser session
        </div>
      </div>
    </div>
  );
};

