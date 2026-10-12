import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  FileBarChart2,
  Download,
  Printer,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Award,
  Calendar,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const CommunityImpactPage: React.FC = () => {
  const { t } = useLanguage();
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await api.getCommunityImpactReport();
      if (res.success && res.data) {
        setReport(res.data);
      }
    } catch (err) {
      console.error('Failed to load impact report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const kpis = report?.kpis;

  const pieData = [
    { name: 'Normal Trajectory', value: (kpis?.totalMeasurementsRecorded || 18) - (kpis?.measurementsFlaggedForReview || 4), color: '#1E5E3A' },
    { name: 'Flagged for Review', value: kpis?.measurementsFlaggedForReview || 4, color: '#F59E0B' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Actions */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-poshan-700">
              <FileBarChart2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('navImpactReports')} — Anganwadi Community Analytics
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Aggregate monitoring metrics evaluating child growth surveillance, nutrition education coverage, and welfare task resolution across Kaveri Anganwadi Centre #14.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <a
            href={api.getExportCsvUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Export Aggregate CSV
          </a>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-poshan-700 hover:bg-poshan-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* College Jury Evaluation Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Demonstration Dataset Notice:</strong> {report?.disclaimer || 'All metrics represent simulated evaluation records for college project demonstration and pilot verification.'}
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Enrolled Children
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {kpis?.enrolledChildren ?? 6}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Active pseudonymous preschool records
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Measurements Logged
          </span>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {kpis?.totalMeasurementsRecorded ?? 18}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Longitudinal anthropometric entries
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Welfare Follow-ups Resolved
          </span>
          <p className="text-3xl font-black text-poshan-700 mt-2">
            {kpis?.completedFollowUps ?? 3} / {kpis?.totalFollowUpTasks ?? 5}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {kpis?.followUpResolutionRate ?? 60}% resolution benchmark
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Review Workload
          </span>
          <p className="text-3xl font-black text-amber-700 mt-2">
            {kpis?.measurementsFlaggedForReview ?? 2} Flagged
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized for ANM &amp; nutrition review
          </p>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Activity Trends Bar Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Anganwadi Workload Trends
              </h3>
              <p className="text-xs text-slate-500">
                Tracking monthly growth weigh-ins vs counselling sessions
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Last 5 Months
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={report?.monthlyTrends || []}
                margin={{ top: 15, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="measurements" fill="#1E5E3A" name="Weigh-Ins Recorded" radius={[4, 4, 0, 0]} />
                <Bar dataKey="followupsCompleted" fill="#E65100" name="Tasks Resolved" radius={[4, 4, 0, 0]} />
                <Bar dataKey="counsellingSessions" fill="#0284C7" name="Parent Counselling" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nutritional Screening Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              WHO Screening Ratio
            </h3>
            <p className="text-xs text-slate-500">
              Proportion of measurements flagged for review
            </p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value} records</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

