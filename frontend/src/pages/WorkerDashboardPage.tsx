import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Users,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  TrendingUp,
  Download,
  Filter,
  Search,
  BookOpen,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const WorkerDashboardPage: React.FC = () => {
  const { user, fastLogin } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReviewOnly, setFilterReviewOnly] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [filterReviewOnly]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // If user isn't logged in, log in as demo worker automatically for seamless preview
      if (!user) {
        await fastLogin('WORKER');
      }

      const [childrenRes, tasksRes, reportRes] = await Promise.all([
        api.listChildren({ reviewOnly: filterReviewOnly }),
        api.listTasks(),
        api.getCommunityImpactReport(),
      ]);

      if (childrenRes.success) setChildren(childrenRes.data);
      if (tasksRes.success) setTasks(tasksRes.data);
      if (reportRes.success) setReport(reportRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'PENDING' || t.status === 'IN_PROGRESS');
  const reviewNeededChildren = children.filter((c) => c.needsReview);

  const filteredChildren = children.filter((c) =>
    c.referenceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Centre info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('dashboardTitle')}
            </h1>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              Demo Mode: Fictional Data
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Centre: <strong className="text-slate-700">Kaveri Anganwadi Centre #14</strong> (Bengaluru Urban) • Assigned Worker: <strong className="text-slate-700">{user?.name || 'Sunita Devi'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/growth-monitoring"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-poshan-700 hover:bg-poshan-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            {t('addMeasurementBtn')}
          </Link>
          <Link
            to="/follow-ups"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            {t('addNewTaskBtn')}
          </Link>
          <a
            href={api.getExportCsvUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" />
            Export Aggregate CSV
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled children */}
        <Link
          to="/growth-monitoring"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-poshan-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('enrolledChildren')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {report?.kpis?.enrolledChildren ?? 6}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">100%</span> active pseudonymous records
          </p>
        </Link>

        {/* Needing Review */}
        <Link
          to="/growth-monitoring?filter=review"
          className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm hover:border-amber-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              {t('reviewNeededBadge')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-900 mt-2">
            {report?.kpis?.measurementsFlaggedForReview ?? reviewNeededChildren.length}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Flagged by WHO 2006 Z-scores (&lt; -2 SD)
          </p>
        </Link>

        {/* Pending Follow-ups */}
        <Link
          to="/follow-ups"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('pendingTasksLabel')}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {pendingTasks.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Counselling &amp; measurement visits
          </p>
        </Link>

        {/* Follow-up Resolution Rate */}
        <Link
          to="/impact-reports"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resolution Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-poshan-700 mt-2">
            {report?.kpis?.followUpResolutionRate ?? 78}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Target benchmark: &ge; 80% resolution
          </p>
        </Link>
      </div>

      {/* Main Grid: Priority Growth Reviews & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Children Growth Roster & Reviews */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Child Anthropometric Monitoring Roster
              </h2>
              <p className="text-xs text-slate-500">
                Pseudonymous IDs with validated WHO 2006 status indicators
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Ref ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-poshan-500"
                />
              </div>

              <button
                onClick={() => setFilterReviewOnly(!filterReviewOnly)}
                className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 ${
                  filterReviewOnly
                    ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Toggle review needed only"
              >
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Review Flagged</span>
              </button>
            </div>
          </div>

          {/* Child Roster Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Child Ref ID</th>
                  <th className="py-2.5 px-3">Gender / Age</th>
                  <th className="py-2.5 px-3">Latest Wt / Ht</th>
                  <th className="py-2.5 px-3">WHO Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredChildren.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No child records found matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredChildren.map((c) => {
                    const m = c.latestMeasurement;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {c.referenceId}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {c.gender} • {new Date(c.dateOfBirth).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          {m ? `${m.weightKg} kg / ${m.heightCm} cm` : 'No data'}
                        </td>
                        <td className="py-3 px-3">
                          {c.needsReview ? (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Needs Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-poshan-800 font-medium px-2 py-0.5 rounded-full text-[11px]">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Normal
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            to={`/growth-monitoring?childId=${c.id}`}
                            className="font-bold text-poshan-700 hover:text-poshan-900 hover:underline"
                          >
                            View Curve →
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
            <span>Showing {filteredChildren.length} registered children</span>
            <Link
              to="/growth-monitoring"
              className="text-poshan-700 font-semibold hover:underline flex items-center gap-1"
            >
              Open Full Growth Module <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right 5 cols: Pending Welfare Tasks & Monthly Activity Chart */}
        <div className="lg:col-span-5 space-y-6">
          {/* Priority Welfare Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-poshan-700" />
                Active Welfare Tasks
              </h2>
              <Link
                to="/follow-ups"
                className="text-xs font-semibold text-poshan-700 hover:underline"
              >
                View All ({tasks.length})
              </Link>
            </div>

            <div className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-2 bg-slate-50/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        task.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : task.priority === 'URGENT'
                          ? 'bg-red-200 text-red-900'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  {task.child && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      Ref: {task.child.referenceId}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Link
              to="/follow-ups"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition"
            >
              Manage &amp; Complete Tasks <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Activity Trend Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Monthly Anganwadi Workload Trend
            </h3>
            <p className="text-xs text-slate-500">
              Measurements logged vs Follow-up counselling sessions completed
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={report?.monthlyTrends || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="measurements" fill="#1E5E3A" name="Measurements" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="followupsCompleted" fill="#E65100" name="Follow-ups Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

