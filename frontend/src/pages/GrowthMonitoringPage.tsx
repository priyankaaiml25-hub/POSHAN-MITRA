import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PlusCircle,
  Calendar,
  User,
  ShieldAlert,
  Info,
  Scale,
  Ruler,
  HelpCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const GrowthMonitoringPage: React.FC = () => {
  const { user, fastLogin } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [childDetails, setChildDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New Measurement Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [measurementDate, setMeasurementDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setLoading(true);
    try {
      if (!user) {
        await fastLogin('WORKER');
      }

      const res = await api.listChildren();
      if (res.success && res.data.length > 0) {
        setChildren(res.data);
        const queryChildId = searchParams.get('childId');
        const defaultId = queryChildId || res.data[0].id;
        setSelectedChildId(defaultId);
        loadChildHistory(defaultId);
      }
    } catch (err) {
      console.error('Failed to initialize growth records:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadChildHistory = async (id: string) => {
    try {
      const res = await api.getChildById(id);
      if (res.success && res.data) {
        setChildDetails(res.data);
      }
    } catch (err) {
      console.error('Failed to load child:', err);
    }
  };

  const handleSelectChild = (id: string) => {
    setSelectedChildId(id);
    loadChildHistory(id);
  };

  const handleAddMeasurement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const wt = parseFloat(weightKg);
      const ht = parseFloat(heightCm);

      if (isNaN(wt) || wt <= 0.5 || wt > 40) {
        throw new Error('Weight must be between 0.5 kg and 40 kg.');
      }
      if (isNaN(ht) || ht < 40 || ht > 130) {
        throw new Error('Height must be between 40 cm and 130 cm.');
      }

      const res = await api.addMeasurement({
        childId: selectedChildId,
        measurementDate: new Date(measurementDate).toISOString(),
        weightKg: wt,
        heightCm: ht,
        reviewNotes: reviewNotes || undefined,
      });

      if (res.success) {
        setShowModal(false);
        setWeightKg('');
        setHeightCm('');
        setReviewNotes('');
        // Reload details and list
        await loadChildHistory(selectedChildId);
        const refreshedList = await api.listChildren();
        if (refreshedList.success) setChildren(refreshedList.data);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to record measurement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare chart data from child's measurement history
  const chartData = childDetails?.measurements?.map((m: any) => ({
    date: new Date(m.measurementDate).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }),
    weightKg: m.weightKg,
    heightCm: m.heightCm,
    waz: m.waz,
    haz: m.haz,
    whz: m.whz,
  })) || [];

  const latestM = childDetails?.measurements?.[childDetails?.measurements?.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Privacy Badge */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-poshan-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('growthMonitoringTitle')}
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {t('pseudonymousNotice')}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-poshan-700 hover:bg-poshan-800 text-white text-xs font-bold shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          Record New Measurement
        </button>
      </div>

      {/* Child Selector Carousel / Dropdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('selectChild')}:
          </span>
          <select
            value={selectedChildId}
            onChange={(e) => handleSelectChild(e.target.value)}
            className="p-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-poshan-500 font-mono"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.referenceId} ({c.gender}) {c.needsReview ? '⚠️ [Needs Review]' : '✓ [Normal]'}
              </option>
            ))}
          </select>
        </div>

        {childDetails && (
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>
              <strong>DOB:</strong> {new Date(childDetails.dateOfBirth).toLocaleDateString()}
            </span>
            <span>
              <strong>Gender:</strong> {childDetails.gender}
            </span>
            <span>
              <strong>Centre:</strong> {childDetails.centre?.name}
            </span>
          </div>
        )}
      </div>

      {/* Main Content: Current Nutritional Status & Longitudinal Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 cols: Latest Status & WHO Z-Scores */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Screening Evaluation
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Ref: {childDetails?.referenceId}
            </span>
          </div>

          {latestM ? (
            <div className="space-y-4">
              {/* Review Alert or Normal */}
              {latestM.needsReview ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Prioritize Anganwadi Review</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {latestM.reviewNotes || 'One or more anthropometric indicators falls below WHO -2 Standard Deviations.'}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1">
                  <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Normal Growth Pattern</span>
                  </div>
                  <p className="text-xs">
                    Weight and height trajectory conform to expected WHO healthy development percentiles.
                  </p>
                </div>
              )}

              {/* Anthropometrics summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-slate-500" />
                    Weight
                  </span>
                  <p className="text-xl font-black text-slate-900">
                    {latestM.weightKg} kg
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    WAZ: {latestM.waz ?? 'N/A'} SD
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-slate-500" />
                    Height
                  </span>
                  <p className="text-xl font-black text-slate-900">
                    {latestM.heightCm} cm
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    HAZ: {latestM.haz ?? 'N/A'} SD
                  </p>
                </div>
              </div>

              {/* Detailed WHO Category Indicators */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">{t('wazLabel')}:</span>
                  <span className="font-bold text-slate-800">
                    {latestM.statusWaz?.replace('_', ' ') || 'NORMAL'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">{t('hazLabel')}:</span>
                  <span className="font-bold text-slate-800">
                    {latestM.statusHaz?.replace('_', ' ') || 'NORMAL'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">{t('whzLabel')}:</span>
                  <span className="font-bold text-slate-800">
                    {latestM.statusWhz?.replace('_', ' ') || 'NORMAL'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 border border-slate-100">
                <p>
                  <strong>Recorded:</strong> {new Date(latestM.measurementDate).toLocaleDateString()} by {latestM.recordedBy}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No measurements logged yet for this child.
            </div>
          )}

          {/* Screening Disclaimer */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[10px] text-amber-950 leading-relaxed">
            <p className="font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              Standard Screening Disclaimer:
            </p>
            <p className="mt-0.5">
              Calculated using WHO 2006 reference standards. Designed for Anganwadi screening prioritization and referral. Not an autonomous clinical diagnostic determination.
            </p>
          </div>
        </div>

        {/* Right 8 cols: Longitudinal Growth Trend Charts */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Longitudinal Growth Curves (WHO Standards)
              </h2>
              <p className="text-xs text-slate-500">
                Tracking weight progression and Z-score deviation over time
              </p>
            </div>
            <span className="text-xs font-semibold text-poshan-700 bg-poshan-50 px-2.5 py-1 rounded-full">
              {chartData.length} Data Points Plotted
            </span>
          </div>

          {/* Chart 1: Weight and Height Progression */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Weight (kg) and Height (cm) History
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'kg', position: 'insideLeft', fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} label={{ value: 'cm', position: 'insideRight', fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="left" type="monotone" dataKey="weightKg" stroke="#1E5E3A" strokeWidth={3} name="Weight (kg)" dot={{ r: 5 }} />
                  <Line yAxisId="right" type="monotone" dataKey="heightCm" stroke="#E65100" strokeWidth={2} name="Height (cm)" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: WHO Z-Score Trajectory */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                WHO Z-Score Deviations (WAZ, HAZ, WHZ)
              </h4>
              <span className="text-[11px] text-slate-400">
                Threshold: &lt; -2 SD indicates review
              </span>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[-4, 3]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="waz" stroke="#2563EB" strokeWidth={2} name="WAZ (Weight-for-Age)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="haz" stroke="#16A34A" strokeWidth={2} name="HAZ (Height-for-Age)" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="whz" stroke="#9333EA" strokeWidth={2} name="WHZ (Weight-for-Height)" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Record Measurement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-bold text-poshan-700 bg-poshan-100 px-2 py-0.5 rounded">
                Anthropometric Entry
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Record Growth for {childDetails?.referenceId}
              </h3>
              <p className="text-xs text-slate-500">
                Enter calibrated weight and height to compute WHO Z-scores automatically.
              </p>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {submitError}
              </div>
            )}

            <form onSubmit={handleAddMeasurement} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Measurement Date</label>
                <input
                  type="date"
                  required
                  value={measurementDate}
                  onChange={(e) => setMeasurementDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    placeholder="e.g. 12.4"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium font-mono"
                  />
                </div>

                <div>
                  <label className="block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 88.5"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Anganwadi Worker Observation / Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Verified using calibrated Seca infant scale; child cheerful and active."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-poshan-700 hover:bg-poshan-800 text-white font-bold transition shadow-sm"
                >
                  {isSubmitting ? 'Computing...' : 'Save & Calculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

