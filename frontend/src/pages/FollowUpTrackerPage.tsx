import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  CheckSquare,
  PlusCircle,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Trash2,
  Check,
} from 'lucide-react';

export const FollowUpTrackerPage: React.FC = () => {
  const { user, fastLogin } = useAuth();
  const { t } = useLanguage();

  const [tasks, setTasks] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State for New Task
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('NUTRITION_COUNSELLING');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  );
  const [childId, setChildId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Complete Task Modal state
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter, priorityFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!user) {
        await fastLogin('WORKER');
      }

      const [tasksRes, childrenRes] = await Promise.all([
        api.listTasks({
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          priority: priorityFilter === 'ALL' ? undefined : priorityFilter,
        }),
        api.listChildren(),
      ]);

      if (tasksRes.success) setTasks(tasksRes.data);
      if (childrenRes.success) setChildren(childrenRes.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createTask({
        title,
        description: description || undefined,
        category,
        priority,
        dueDate: new Date(dueDate).toISOString(),
        childId: childId || undefined,
      });

      if (res.success) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setChildId('');
        await loadData();
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      const res = await api.updateTask(id, {
        status: 'COMPLETED',
        completionNotes: completionNotes || 'Counselling session and follow-up completed successfully.',
      });
      if (res.success) {
        setCompletingTaskId(null);
        setCompletionNotes('');
        await loadData();
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this follow-up task record?')) {
      try {
        const res = await api.deleteTask(id);
        if (res.success) await loadData();
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.child?.referenceId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-poshan-700">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('navFollowUps')} — Anganwadi Task Management
            </h1>
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Coordinate home nutrition counselling, growth remeasurements, parent workshops, and primary healthcare ANM/ASHA referrals with complete audit history.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-poshan-700 hover:bg-poshan-800 text-white text-xs font-bold shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          {t('addNewTaskBtn')}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by task title or Child Ref ID (e.g. CH-BLR-004)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-1 focus:ring-poshan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filters */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Filters */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task List Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Priority / Status</th>
                <th className="py-3 px-4">Task Title &amp; Description</th>
                <th className="py-3 px-4">Child Ref</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No follow-up tasks found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => {
                  const isCompleted = t.status === 'COMPLETED';

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              t.priority === 'HIGH' || t.priority === 'URGENT'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {t.priority}
                          </span>
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                isCompleted
                                  ? 'text-emerald-700'
                                  : 'text-amber-800'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                              )}
                              {t.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <p className={`font-bold text-slate-900 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                          {t.title}
                        </p>
                        {t.description && (
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            {t.description}
                          </p>
                        )}
                        {t.completionNotes && (
                          <p className="text-emerald-800 text-[11px] mt-1 font-medium bg-emerald-50 p-1.5 rounded-md">
                            ✓ <strong>Resolution Notes:</strong> {t.completionNotes}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {t.child?.referenceId || 'Centre General'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                        {t.category.replace(/_/g, ' ')}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(t.dueDate).toLocaleDateString()}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isCompleted && (
                            <button
                              onClick={() => setCompletingTaskId(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                              title="Mark task completed"
                            >
                              <Check className="w-3 h-3" /> Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-xs font-bold text-poshan-700 bg-poshan-100 px-2 py-0.5 rounded">
                Anganwadi Follow-Up
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Schedule New Welfare Task
              </h3>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home visit for iron syrup counselling"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block mb-1">Associate Child (Optional)</label>
                <select
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-medium font-mono"
                >
                  <option value="">General Anganwadi Follow-up</option>
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.referenceId} ({c.gender})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="NUTRITION_COUNSELLING">Nutrition Counselling</option>
                    <option value="GROWTH_MONITORING">Growth Monitoring</option>
                    <option value="PARENT_EDUCATION">Parent Education</option>
                    <option value="ASHA_ANM_REFERRAL">ASHA/ANM Referral</option>
                    <option value="ADMIN_FOLLOWUP">Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 font-medium"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High Priority</option>
                    <option value="URGENT">Urgent Action</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block mb-1">Instructions / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Details on what to review with caregiver..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 font-medium"
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
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Task Modal */}
      {completingTaskId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-bold text-slate-900">
              Confirm Task Completion
            </h3>
            <p className="text-xs text-slate-500">
              Record brief notes explaining the outcome of this follow-up for audit logs.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Mother agreed to introduce boiled egg and ragi porridge; child scheduled for re-weigh in 15 days."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-poshan-500"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCompletingTaskId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteTask(completingTaskId)}
                className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm"
              >
                Save &amp; Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

