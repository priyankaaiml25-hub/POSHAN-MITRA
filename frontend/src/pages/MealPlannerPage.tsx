import React, { useState } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Calculator,
  Printer,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChefHat,
  IndianRupee,
} from 'lucide-react';

export const MealPlannerPage: React.FC = () => {
  const { language, t } = useLanguage();

  // User form state
  const [budgetInr, setBudgetInr] = useState<number>(120);
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [dietaryType, setDietaryType] = useState<string>('VEGETARIAN');
  const [mealType, setMealType] = useState<string>('LUNCH');
  const [preferredGrain, setPreferredGrain] = useState<string>('RAGI');

  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<any | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.generateMealPlan({
        budgetInr,
        dietaryType,
        familyMembers,
        mealType,
        preferredGrain,
      });
      if (res.success && res.data) {
        setPlanResult(res.data);
      }
    } catch (err) {
      console.error('Failed to generate meal plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-poshan-700">
              <Calculator className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('mealPlannerTitle')}
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Signature Rule-Based Optimizer: Balance energy millets, plant/animal proteins, and dark leafy greens within your family budget without requiring external AI APIs.
          </p>
        </div>

        {planResult && (
          <button
            onClick={handlePrint}
            className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            {t('printPlanBtn')}
          </button>
        )}
      </div>

      {/* Input Control Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 cols: Parameter Controls */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 no-print">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Planning Criteria
            </h2>
            <span className="text-[11px] font-bold text-poshan-700 bg-poshan-50 px-2 py-0.5 rounded">
              Rule-Based Optimizer
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Daily Budget Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>{t('budgetSliderLabel')}</span>
                <span className="text-base font-extrabold text-poshan-700">₹{budgetInr}</span>
              </div>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={budgetInr}
                onChange={(e) => setBudgetInr(Number(e.target.value))}
                className="w-full accent-poshan-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹30 (Minimal)</span>
                <span>₹250 (Moderate)</span>
                <span>₹500 (Abundant)</span>
              </div>
            </div>

            {/* Family Members Count */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('familyMembersCount')} ({familyMembers} persons)
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 4, 6, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFamilyMembers(num)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition ${
                      familyMembers === num
                        ? 'bg-poshan-700 text-white shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('dietaryPreference')}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'VEGETARIAN', label: 'Vegetarian' },
                  { id: 'EGGITARIAN', label: 'Eggitarian' },
                  { id: 'NON_VEGETARIAN', label: 'Non-Veg' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDietaryType(d.id)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition text-center ${
                      dietaryType === d.id
                        ? 'bg-poshan-700 text-white shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meal Type
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-poshan-500"
              >
                <option value="BREAKFAST">Breakfast (Morning Nourishment)</option>
                <option value="LUNCH">Lunch (Midday Sustained Energy)</option>
                <option value="DINNER">Dinner (Digestible Night Meal)</option>
                <option value="FULL_DAY">Full Day (3-Meal Integrated Plan)</option>
              </select>
            </div>

            {/* Preferred Grain */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Staple Grain Preference
              </label>
              <select
                value={preferredGrain}
                onChange={(e) => setPreferredGrain(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-poshan-500"
              >
                <option value="RAGI">Ragi (Finger Millet - High Calcium)</option>
                <option value="RICE">Parboiled Rice (Digestible Carb)</option>
                <option value="JOWAR">Jowar / Millets (Gluten-Free Fiber)</option>
                <option value="WHEAT">Whole Wheat (Atta / Chapati)</option>
                <option value="ANY">Any / Auto-Balanced</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-poshan-700 hover:bg-poshan-800 text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              {loading ? 'Optimizing...' : t('generatePlanBtn')}
            </button>
          </form>

          {/* Educational Note */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-950 leading-relaxed">
            <p className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              Local Cost Modeling:
            </p>
            <p className="mt-0.5">
              Cost approximations are calibrated to average public market rates in Karnataka and South Indian districts.
            </p>
          </div>
        </div>

        {/* Right 8 cols: Generated Meal Plan Display */}
        <div className="lg:col-span-8 space-y-6">
          {planResult ? (
            <div className="space-y-6">
              {/* Cost & Budget Summary Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-poshan-700 bg-poshan-50 px-2.5 py-1 rounded-full">
                      {planResult.title}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">
                      Nutritionally Balanced Meal Suggestion
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated Cost</p>
                      <p className="text-2xl font-black text-slate-900">
                        ₹{planResult.estimatedCostInr}
                      </p>
                    </div>

                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        planResult.isWithinBudget
                          ? 'bg-emerald-100 text-poshan-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {planResult.isWithinBudget ? 'Within Budget' : 'Slightly Over Budget'}
                    </div>
                  </div>
                </div>

                {/* Food Group Contributions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Food Group Balance Coverage
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {planResult.nutritionalBalanceSummary.map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-poshan-50/60 border border-poshan-100 text-xs text-poshan-950 font-medium flex items-center gap-2"
                      >
                        <span className="text-poshan-600">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meals Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Meal Composition &amp; Preparation Steps
                </h3>

                {planResult.meals.map((meal: any, idx: number) => {
                  const mealTitle =
                    language === 'hi'
                      ? meal.nameHi
                      : language === 'kn'
                      ? meal.nameKn
                      : meal.name;

                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[11px] font-bold text-poshan-700 uppercase tracking-wider bg-poshan-50 px-2 py-0.5 rounded">
                            {meal.mealType}
                          </span>
                          <h4 className="text-xl font-bold text-slate-900 mt-1">
                            {mealTitle}
                          </h4>
                          <p className="text-xs text-slate-400">
                            {meal.grain} • {meal.protein} • {meal.vegetable}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{meal.prepTimeMin} mins preparation</span>
                        </div>
                      </div>

                      {/* Recipe Instructions */}
                      <div className="space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <ChefHat className="w-4 h-4 text-poshan-700" />
                          Step-by-Step Cooking Guide
                        </h5>
                        <ol className="space-y-1.5 list-decimal list-inside text-xs text-slate-700 leading-relaxed pl-1">
                          {meal.instructions.map((step: string, sIdx: number) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Allergens Notice */}
                      {meal.allergens && meal.allergens.length > 0 && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>
                            <strong>Allergen Notice:</strong> Contains {meal.allergens.join(', ')}. Substitute with roasted gram/lentils if child is allergic.
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Shopping List Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-poshan-700" />
                    {t('shoppingListTitle')} ({familyMembers} Portions)
                  </h3>
                  <span className="text-xs font-bold text-poshan-700">
                    Est. Market Value: ₹{planResult.estimatedCostInr}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">Item / Ingredient</th>
                        <th className="py-2 px-3">Required Quantity</th>
                        <th className="py-2 px-3 text-right">Approx. Cost (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {planResult.shoppingList.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {item.item}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {item.quantityFormatted}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                            ₹{item.estimatedCostInr}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 leading-relaxed">
                <p>
                  <strong>Notice:</strong> {planResult.disclaimer}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-poshan-50 text-poshan-700 mx-auto flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Ready to Generate Family Meal Plan
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Adjust your family members count and budget in the left control panel, then click <strong>"Generate Balanced Meal Plan"</strong> to view transparent rule-based suggestions and shopping lists.
              </p>
              <button
                onClick={handleGenerate}
                className="mt-2 px-6 py-2.5 rounded-xl bg-poshan-700 hover:bg-poshan-800 text-white text-xs font-bold transition shadow-sm"
              >
                Generate Default 4-Person Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

