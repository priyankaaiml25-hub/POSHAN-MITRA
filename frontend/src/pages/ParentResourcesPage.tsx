import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import {
  Heart,
  Volume2,
  VolumeX,
  Baby,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Utensils,
} from 'lucide-react';

export const ParentResourcesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const handleSpeak = (text: string, key: string) => {
    if (speakingKey === key) {
      stopSpeech();
      setSpeakingKey(null);
    } else {
      setSpeakingKey(key);
      speakText(text, language, () => setSpeakingKey(null));
    }
  };

  const weaningStages = [
    {
      age: '6 to 8 Months',
      titleEn: 'First Tastes: Smooth & Mashed Solids',
      titleHi: 'पहला स्वाद: नरम और मसला हुआ ठोस आहार',
      titleKn: 'ಮೊದಲ ರುಚಿ: ನಯವಾಗಿ ಕಿವುಚಿದ ಆಹಾರ',
      descEn: 'Continue breastfeeding on demand. Introduce 2-3 tablespoons of thick ragi porridge with milk/water, mashed ripe banana, or soft moong dal water with a drop of ghee.',
      descHi: 'स्तनपान जारी रखें। 2-3 चम्मच गाढ़ा रागी दलिया, मसला हुआ केला, या घी के साथ मूंग दाल का पानी दें।',
      descKn: 'ಎದೆಹಾಲು ಮುಂದುವರಿಸಿ. 2-3 ಚಮಚ ಗಟ್ಟಿ ರಾಗಿ ಅಂಬಲಿ, ಬಾಳೆಹಣ್ಣು ಕಿವುಚಿ ಅಥವಾ ಹೆಸರುಬೇಳೆ ನೀರು ಕೊಡಿ.',
      texture: 'Smooth puree & thick soft mash',
      frequency: '2 to 3 small meals daily',
    },
    {
      age: '9 to 11 Months',
      titleEn: 'Finger Foods & Coarse Textures',
      titleHi: 'फिंगर फूड्स और दानेदार बनावट',
      titleKn: 'ಬೆರಳಿನ ಆಹಾರಗಳು ಮತ್ತು ತರಿತರಿಯಾದ ಪದಾರ್ಥ',
      descEn: 'Coarsely mashed khichdi, small soft boiled carrot sticks the baby can grasp, well-steamed idli pieces soaked in mild dal, and soft curd.',
      descHi: 'दरदरी मसली हुई खिचड़ी, उबली हुई गाजर के नरम टुकड़े, और दाल में भीगी हुई इडली।',
      descKn: 'ಕಿವುಚಿದ ಕಿಚಡಿ, ಮೃದುವಾದ ಬೇಯಿಸಿದ ಕ್ಯಾರೆಟ್ ತುಂಡುಗಳು ಮತ್ತು ಬೇಳೆಯಲ್ಲಿ ನೆನೆಸಿದ ಇಡ್ಲಿ.',
      texture: 'Finely chopped or coarse mash',
      frequency: '3 to 4 meals + 1 snack',
    },
    {
      age: '12 to 24 Months',
      titleEn: 'Family Diet with Nutrient Boosts',
      titleHi: 'पारिवारिक भोजन और पोषण वृद्धि',
      titleKn: 'ಮನೆಯ ಸಾಮಾನ್ಯ ಊಟ ಮತ್ತು ಪೋಷಕಾಂಶ ವರ್ಧನೆ',
      descEn: 'Child eats modified family meals: Ragi mudde with non-spicy spinach dal, chapati soaked in dal or milk, boiled egg pieces, papaya, and whole milk.',
      descHi: 'बच्चा हल्का मसालेदार पारिवारिक भोजन कर सकता है: रागी मुड्डे, दाल-रोटी, अंडा और पपीता।',
      descKn: 'ಮನೆಯ ಸದಸ್ಯರ ಜೊತೆ ಊಟ: ರಾಗಿ ಮುದ್ದೆ, ಪಾಲಕ್ ಬೇಳೆ ಸಾರು, ಮೊಟ್ಟೆ ಮತ್ತು ಪಪ್ಪಾಯಿ.',
      texture: 'Family food, lightly mashed if needed',
      frequency: '3 wholesome meals + 2 healthy snacks',
    },
  ];

  const parentingTips = [
    {
      title: 'Tackling Picky Eating with Patience',
      tip: 'Never force a toddler to empty the plate. It takes up to 10 to 15 calm exposures for a young child to accept a new green leafy vegetable. Serve colorful food in small cheerful bowls.',
    },
    {
      title: 'Limiting Ultra-Processed Packaged Snacks',
      tip: 'Coloured candies, bakery cream biscuits, and fried packaged chips dull the child’s natural appetite for wholesome grains and lead to micro-nutrient deficiencies (hidden hunger).',
    },
    {
      title: 'Zero Screens During Mealtime',
      tip: 'Eating in front of phones or television prevents the child from feeling natural stomach satiety cues. Talk with your child about the textures, colors, and fun shapes on their plate.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
            <Heart className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('navParentResources')} — Nurturing Toddler Nutrition
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Practical age-appropriate feeding guides, developmental food textures, overcoming toddler eating challenges, and home kitchen health practices.
        </p>
      </div>

      {/* Age-Appropriate Weaning Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Baby className="w-5 h-5 text-poshan-700" />
            Complementary Feeding Stages (6 Months to 2 Years)
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            WHO Infant &amp; Young Child Feeding (IYCF)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weaningStages.map((stage, idx) => {
            const title =
              language === 'hi'
                ? stage.titleHi
                : language === 'kn'
                ? stage.titleKn
                : stage.titleEn;
            const desc =
              language === 'hi'
                ? stage.descHi
                : language === 'kn'
                ? stage.descKn
                : stage.descEn;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-poshan-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-poshan-700 bg-poshan-50 px-2.5 py-1 rounded-full">
                      {stage.age}
                    </span>
                    {isSpeechSupported() && (
                      <button
                        onClick={() => handleSpeak(`${title}. ${desc}`, `wean-${idx}`)}
                        className={`p-1.5 rounded-lg transition ${
                          speakingKey === `wean-${idx}`
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-50 text-slate-500 hover:text-poshan-700'
                        }`}
                      >
                        {speakingKey === `wean-${idx}` ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold text-slate-500">Texture:</span>
                    <span>{stage.texture}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold text-slate-500">Frequency:</span>
                    <span>{stage.frequency}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practical Parenting Advice */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Smile className="w-5 h-5 text-amber-600" />
          Practical Advice for Calm &amp; Cheerful Meals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {parentingTips.map((tip, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2"
            >
              <h4 className="text-sm font-bold text-amber-950">
                {tip.title}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {tip.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

