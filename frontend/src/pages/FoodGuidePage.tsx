import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Apple,
  Search,
  Filter,
  Flame,
  Dna,
  ShieldAlert,
  ChefHat,
  Tag,
  IndianRupee,
} from 'lucide-react';

export const FoodGuidePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [foods, setFoods] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [localOnly, setLocalOnly] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  useEffect(() => {
    loadFoods();
  }, [categoryFilter, localOnly]);

  const loadFoods = async () => {
    try {
      const res = await api.listFoods({
        category: categoryFilter,
        search: searchTerm || undefined,
        localOnly: localOnly || undefined,
      });
      if (res.success && res.data) {
        setFoods(res.data);
      }
    } catch (err) {
      console.error('Failed to load foods:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFoods();
  };

  const categories = [
    { id: 'ALL', label: 'All Foods' },
    { id: 'GRAINS', label: 'Millets & Cereals' },
    { id: 'PULSES', label: 'Pulses & Lentils' },
    { id: 'VEGETABLES', label: 'Vegetables & Greens' },
    { id: 'FRUITS', label: 'Seasonal Fruits' },
    { id: 'DAIRY', label: 'Milk & Curd' },
    { id: 'PROTEIN_OTHER', label: 'Eggs & Other' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-poshan-700">
            <Apple className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('navFoodGuide')} — Local Indian Food Library
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Search and compare nutritional composition, regional language names, estimated market prices (₹), and traditional preparations from Indian dietary databases (ICMR-NIN).
        </p>
      </div>

      {/* Controls & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search in English, Hindi (उदा. रागी), or Kannada (ಉದಾ. ರಾಗಿ)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-poshan-500 focus:outline-none"
          />
        </form>

        {/* Local Checkbox */}
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={localOnly}
            onChange={(e) => setLocalOnly(e.target.checked)}
            className="rounded text-poshan-600 focus:ring-poshan-500 w-4 h-4"
          />
          <span>Locally Available Superfoods Only</span>
        </label>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {foods.map((food) => {
          const name =
            language === 'hi' ? food.nameHi : language === 'kn' ? food.nameKn : food.nameEn;
          const benefits =
            language === 'hi' ? food.benefitsHi : language === 'kn' ? food.benefitsKn : food.benefitsEn;

          return (
            <div
              key={food.id}
              onClick={() => setSelectedFood(food)}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-poshan-400 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-poshan-700 bg-poshan-50 px-2 py-0.5 rounded-md">
                    {food.category}
                  </span>
                  <span className="font-bold text-slate-900 flex items-center">
                    ₹{food.estimatedCostPer100g}
                    <span className="text-[10px] text-slate-400 font-normal ml-0.5">/100g</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-poshan-800 transition">
                  {name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {food.nameEn} • {food.nameHi} • {food.nameKn}
                </p>

                {/* Micro / Macro Nutrients Chips */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                  <div className="bg-amber-50/80 p-2 rounded-lg text-amber-950">
                    <p className="text-slate-500 text-[10px]">Energy</p>
                    <p className="font-bold">{food.energyKcal} kcal</p>
                  </div>
                  <div className="bg-blue-50/80 p-2 rounded-lg text-blue-950">
                    <p className="text-slate-500 text-[10px]">Protein</p>
                    <p className="font-bold">{food.proteinG} g</p>
                  </div>
                  <div className="bg-emerald-50/80 p-2 rounded-lg text-emerald-950">
                    <p className="text-slate-500 text-[10px]">Iron</p>
                    <p className="font-bold">{food.ironMg} mg</p>
                  </div>
                  <div className="bg-purple-50/80 p-2 rounded-lg text-purple-950">
                    <p className="text-slate-500 text-[10px]">Calcium</p>
                    <p className="font-bold">{food.calciumMg} mg</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {benefits}
                </p>
              </div>

              {/* Footer info */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {food.allergens ? (
                  <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                    <ShieldAlert className="w-3 h-3" /> {food.allergens}
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium">No common allergens</span>
                )}
                <span className="font-bold text-poshan-700 group-hover:underline">
                  View Recipes →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedFood(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-bold text-poshan-700 bg-poshan-100 px-2 py-0.5 rounded">
                {selectedFood.category}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                {selectedFood.nameEn}
              </h2>
              <p className="text-xs text-slate-500">
                {selectedFood.nameHi} • {selectedFood.nameKn}
              </p>
            </div>

            {/* Nutrients Full Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">Calories</span>
                <p className="font-bold text-slate-900">{selectedFood.energyKcal} kcal</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">Protein</span>
                <p className="font-bold text-slate-900">{selectedFood.proteinG} g</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">Carbs</span>
                <p className="font-bold text-slate-900">{selectedFood.carbsG} g</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">Iron</span>
                <p className="font-bold text-slate-900">{selectedFood.ironMg} mg</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">Calcium</span>
                <p className="font-bold text-slate-900">{selectedFood.calciumMg} mg</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-slate-400 text-[10px]">Vitamin A</span>
                <p className="font-bold text-slate-900">{selectedFood.vitaminAMcg} mcg</p>
              </div>
            </div>

            {/* Traditional Recipes */}
            {selectedFood.recipeSuggestions && selectedFood.recipeSuggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ChefHat className="w-4 h-4 text-poshan-700" />
                  Recommended Regional Recipes
                </h4>
                <div className="space-y-1.5">
                  {selectedFood.recipeSuggestions.map((rec: string, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-poshan-50/70 border border-poshan-200 text-xs text-poshan-950 font-medium"
                    >
                      🍲 {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
              Values referenced from ICMR-National Institute of Nutrition (NIN) Food Composition Tables.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

