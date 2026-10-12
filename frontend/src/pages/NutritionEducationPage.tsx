import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Zap,
  Dna,
  ShieldCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
} from 'lucide-react';

export const NutritionEducationPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [speakingSlug, setSpeakingSlug] = useState<string | null>(null);

  useEffect(() => {
    loadLessons();
  }, [categoryFilter]);

  const loadLessons = async () => {
    try {
      const res = await api.listLessons(categoryFilter === 'ALL' ? undefined : categoryFilter);
      if (res.success && res.data) {
        setLessons(res.data);
        if (res.data.length > 0 && !selectedLesson) {
          // fetch full lesson
          const fullRes = await api.getLessonBySlug(res.data[0].slug);
          if (fullRes.success) setSelectedLesson(fullRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to load lessons:', err);
    }
  };

  const selectLesson = async (slug: string) => {
    stopSpeech();
    setSpeakingSlug(null);
    try {
      const res = await api.getLessonBySlug(slug);
      if (res.success) {
        setSelectedLesson(res.data);
      }
    } catch (err) {
      console.error('Failed to load lesson detail:', err);
    }
  };

  const handleSpeak = (text: string, slug: string) => {
    if (speakingSlug === slug) {
      stopSpeech();
      setSpeakingSlug(null);
    } else {
      setSpeakingSlug(slug);
      speakText(text, language, () => setSpeakingSlug(null));
    }
  };

  const handleQuizSelect = (lessonId: string, optionIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [lessonId]: optionIndex });
  };

  const handleQuizSubmit = (lessonId: string) => {
    setQuizSubmitted({ ...quizSubmitted, [lessonId]: true });
  };

  const categories = [
    { id: 'ALL', label: 'All Lessons' },
    { id: 'ENERGY', label: 'Energy Foods' },
    { id: 'PROTEIN', label: 'Proteins' },
    { id: 'MICRONUTRIENTS', label: 'Vitamins & Iron' },
    { id: 'HYGIENE', label: 'Hygiene & Clean Water' },
    { id: 'FEEDING', label: 'Responsive Feeding' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Intro */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-poshan-100 flex items-center justify-center text-poshan-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('navEducation')}
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Evidence-based nutritional knowledge tailored for Indian Anganwadi centres and families. Includes practical kitchen tips, regional food examples, interactive quizzes, and browser text-to-speech.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === c.id
                  ? 'bg-poshan-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Lessons Menu (Left 4 cols) & Active Lesson View (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Lesson Index */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Available Modules ({lessons.length})
          </h3>
          {lessons.map((l) => {
            const isSelected = selectedLesson?.id === l.id;
            const title =
              language === 'hi' ? l.titleHi : language === 'kn' ? l.titleKn : l.titleEn;
            const summary =
              language === 'hi' ? l.summaryHi : language === 'kn' ? l.summaryKn : l.summaryEn;

            return (
              <button
                key={l.id}
                onClick={() => selectLesson(l.slug)}
                className={`w-full text-left p-4 rounded-2xl border transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-poshan-50 border-poshan-500 shadow-sm ring-1 ring-poshan-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-poshan-700 uppercase tracking-wider">
                      Module {l.orderIndex} • {l.category}
                    </span>
                    <span className="text-slate-400 font-medium">{l.readTimeMin} min read</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Lesson Reading Pane */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {selectedLesson ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-poshan-700 bg-poshan-100 px-2.5 py-0.5 rounded-full">
                    {selectedLesson.category}
                  </span>
                  {isSpeechSupported() && (
                    <button
                      onClick={() => {
                        const title =
                          language === 'hi'
                            ? selectedLesson.titleHi
                            : language === 'kn'
                            ? selectedLesson.titleKn
                            : selectedLesson.titleEn;
                        const summary =
                          language === 'hi'
                            ? selectedLesson.summaryHi
                            : language === 'kn'
                            ? selectedLesson.summaryKn
                            : selectedLesson.summaryEn;
                        handleSpeak(`${title}. ${summary}`, selectedLesson.slug);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        speakingSlug === selectedLesson.slug
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-poshan-50 text-poshan-700 hover:bg-poshan-100'
                      }`}
                    >
                      {speakingSlug === selectedLesson.slug ? (
                        <>
                          <VolumeX className="w-4 h-4" /> Stop Reading
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" /> Read Aloud (Audio)
                        </>
                      )}
                    </button>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {language === 'hi'
                    ? selectedLesson.titleHi
                    : language === 'kn'
                    ? selectedLesson.titleKn
                    : selectedLesson.titleEn}
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  {language === 'hi'
                    ? selectedLesson.summaryHi
                    : language === 'kn'
                    ? selectedLesson.summaryKn
                    : selectedLesson.summaryEn}
                </p>
              </div>

              {/* Lesson Structured Sections */}
              {selectedLesson.content?.sections && (
                <div className="space-y-5">
                  {selectedLesson.content.sections.map((sec: any, idx: number) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-poshan-800 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        {sec.heading}
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed pl-8">
                        {sec.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Indian Food Examples */}
              {selectedLesson.content?.foodExamples && (
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-poshan-800">
                    Locally Available Indian Examples
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedLesson.content.foodExamples.map((ex: string) => (
                      <span
                        key={ex}
                        className="bg-white border border-emerald-200 text-slate-800 text-xs font-medium px-3 py-1 rounded-lg shadow-2xs"
                      >
                        ✓ {ex}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Kitchen Tip */}
              {selectedLesson.content?.practicalTip && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-1">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Practical Anganwadi &amp; Kitchen Tip
                  </h4>
                  <p className="text-sm text-amber-950 font-medium">
                    💡 {selectedLesson.content.practicalTip}
                  </p>
                </div>
              )}

              {/* Knowledge Check Quiz */}
              {selectedLesson.content?.quiz && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <HelpCircle className="w-5 h-5 text-poshan-700" />
                    <span>Quick Knowledge Check</span>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">
                    {selectedLesson.content.quiz.question}
                  </p>

                  <div className="space-y-2">
                    {selectedLesson.content.quiz.options.map((opt: string, optIdx: number) => {
                      const isSelected = quizAnswers[selectedLesson.id] === optIdx;
                      const isSubmitted = quizSubmitted[selectedLesson.id];
                      const isCorrect = optIdx === selectedLesson.content.quiz.correctIndex;

                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';
                      if (isSelected) {
                        btnStyle = 'bg-poshan-50 border-poshan-600 text-poshan-900 font-bold';
                      }
                      if (isSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-500 text-rose-900 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isSubmitted}
                          onClick={() => handleQuizSelect(selectedLesson.id, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                          {isSubmitted && isSelected && !isCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted[selectedLesson.id] ? (
                    <button
                      disabled={quizAnswers[selectedLesson.id] === undefined}
                      onClick={() => handleQuizSubmit(selectedLesson.id)}
                      className="px-4 py-2 bg-poshan-700 hover:bg-poshan-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Check Answer
                    </button>
                  ) : (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-800">
                        {quizAnswers[selectedLesson.id] === selectedLesson.content.quiz.correctIndex
                          ? '🎉 Correct! Well done.'
                          : 'ℹ️ Explanation:'}
                      </p>
                      <p>{selectedLesson.content.quiz.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              Select a lesson from the left panel to begin reading.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

