import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  FileCheck,
  Megaphone,
  Hammer,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getImageUrl } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';
import CitizenProfileModal from '../components/CitizenProfileModal';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCitizenId, setViewingCitizenId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        api.get('/reports/dashboard-stats'),
        api.get('/complaints?limit=5'),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (complaintsRes.data.success) {
        setRecentComplaints(complaintsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = stats?.cards || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-md bg-emerald-700/60 text-emerald-200 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
            Administrative Overview
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-2 leading-tight">येवला ग्रामपंचायत मुख्य नियंत्रण कक्ष</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time citizen grievance resolution, service workflows & infrastructure oversight.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/complaints"
            className="text-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            Review Pending ({cards.pendingComplaints || 0})
          </Link>
          <Link
            to="/notices"
            className="text-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Publish Notice
          </Link>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Citizens"
          value={cards.totalCitizens}
          subtitle={`${cards.activeCitizens || 0} active accounts`}
          icon={Users}
          color="emerald"
          to={isAdmin ? '/users' : '/reports'}
        />
        <StatCard
          title="Pending Complaints"
          value={cards.pendingComplaints}
          subtitle="Action required by ward team"
          icon={Clock}
          color="amber"
          to="/complaints?status=Pending"
        />
        <StatCard
          title="Resolved Complaints"
          value={cards.resolvedComplaints}
          subtitle={`Out of ${cards.totalComplaints || 0} total grievances`}
          icon={CheckCircle2}
          color="blue"
          to="/complaints?status=Resolved"
        />
        <StatCard
          title="Pending Service Requests"
          value={cards.pendingRequests}
          subtitle={`${cards.approvedRequests || 0} certificates approved`}
          icon={FileCheck}
          color="purple"
          to="/requests"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Development Projects"
          value={cards.activeProjects}
          subtitle="Roads, Water & Solar infrastructure"
          icon={Hammer}
          color="emerald"
          to="/projects"
        />
        <StatCard
          title="Published Notices"
          value={cards.totalNotices}
          subtitle="Current public circulars & alerts"
          icon={Megaphone}
          color="blue"
          to="/notices"
        />
        <StatCard
          title="Gram Sabha & Events"
          value={cards.totalEvents}
          subtitle="Scheduled meetings & camps"
          icon={TrendingUp}
          color="rose"
          to="/events"
        />
      </div>

      {/* Middle Grid: Breakdown Charts & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints by Category Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Complaints by Category
            </h2>
            <Link to="/complaints" className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats?.complaintsByCategory?.length > 0 ? (
              stats.complaintsByCategory.map((cat) => {
                const total = cards.totalComplaints || 1;
                const pct = Math.round((cat.count / total) * 100);
                return (
                  <Link
                    key={cat._id}
                    to={`/complaints?category=${encodeURIComponent(cat._id)}`}
                    className="block p-1.5 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700 group-hover:text-emerald-800 transition-colors">{cat._id}</span>
                      <span className="text-slate-500">
                        {cat.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all group-hover:bg-emerald-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-xs text-slate-500">No categorized complaints recorded yet.</p>
            )}
          </div>
        </div>

        {/* Complaints by Status Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Resolution Pipeline Status
            </h2>
            <Link to="/complaints" className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5">
              <span>Filter</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {stats?.complaintsByStatus?.map((st) => (
              <Link
                key={st._id}
                to={`/complaints?status=${encodeURIComponent(st._id)}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-slate-100/70 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <StatusBadge status={st._id} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-800">{st.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Service Requests Overview */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Service Applications By Type
            </h2>
            <Link to="/requests" className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats?.requestsByType?.length > 0 ? (
              stats.requestsByType.map((req) => (
                <Link
                  key={req._id}
                  to="/requests"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <span className="text-xs font-medium text-slate-700 group-hover:text-emerald-800 truncate mr-2">
                    {req._id}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {req.count}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-500">No applications received yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">Recent Citizen Grievances</h2>
            <p className="text-xs text-slate-500 mt-0.5">Latest issues reported by ward citizens</p>
          </div>
          <Link
            to="/complaints"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile View (< 768px): Responsive Cards for all phone sizes */}
        <div className="md:hidden divide-y divide-slate-100">
          {recentComplaints.length === 0 ? (
            <p className="p-6 text-center text-xs text-slate-400">No grievances recorded yet.</p>
          ) : (
            recentComplaints.map((c) => (
              <div key={c._id} className="p-4 space-y-2.5 hover:bg-slate-50/70 transition-colors">
                {/* Header: ID on left, Status on right */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                    {c.complaintId}
                  </span>
                  <StatusBadge status={c.status} />
                </div>

                {/* Category Badge */}
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 max-w-full">
                    {c.category}
                  </span>
                </div>

                {/* Citizen Info (Clickable to view profile & complaints) */}
                <div
                  onClick={() => c.citizen?._id && setViewingCitizenId(c.citizen._id)}
                  className="flex items-center gap-2.5 bg-slate-50/80 hover:bg-emerald-50/70 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group"
                  title="Click to view citizen profile & complaints / प्रोफाइल पाहण्यासाठी क्लिक करा"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs group-hover:scale-105 transition-transform">
                    {getImageUrl(c.citizen?.avatar) ? (
                      <img
                        src={getImageUrl(c.citizen.avatar)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      c.citizen?.name?.[0]?.toUpperCase() || 'C'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-xs truncate leading-tight group-hover:text-emerald-800 transition-colors">
                        {c.citizen?.name || 'Citizen'}
                      </p>
                      <span className="text-[10px] text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile ↗
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {c.citizen?.mobile ? (
                        <span className="font-medium text-slate-600">{c.citizen.mobile}</span>
                      ) : (
                        'No mobile'
                      )}
                    </p>
                  </div>
                </div>

                {/* Location & Date Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                  <span className="truncate max-w-[200px] font-medium text-slate-600">
                    Ward {c.wardNumber} • {c.location}
                  </span>
                  <span className="whitespace-nowrap text-slate-400">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop / Tablet View (>= 768px): Full Table with Min-Width */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3 whitespace-nowrap">Tracking ID</th>
                <th className="px-5 py-3 whitespace-nowrap">Citizen</th>
                <th className="px-5 py-3 whitespace-nowrap">Category</th>
                <th className="px-5 py-3 whitespace-nowrap">Location</th>
                <th className="px-5 py-3 whitespace-nowrap">Status</th>
                <th className="px-5 py-3 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {recentComplaints.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3 font-bold text-slate-900 font-mono whitespace-nowrap">
                    {c.complaintId}
                  </td>
                  <td className="px-5 py-3">
                    <div
                      onClick={() => c.citizen?._id && setViewingCitizenId(c.citizen._id)}
                      className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90"
                      title="Click to view citizen profile & complaints / प्रोफाइल पाहण्यासाठी क्लिक करा"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs group-hover:scale-105 transition-transform">
                        {getImageUrl(c.citizen?.avatar) ? (
                          <img
                            src={getImageUrl(c.citizen.avatar)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          c.citizen?.name?.[0]?.toUpperCase() || 'C'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                          {c.citizen?.name || 'Citizen'}
                        </p>
                        <p className="text-[11px] text-slate-400">{c.citizen?.mobile}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    <span className="font-semibold text-slate-800 whitespace-nowrap">Ward {c.wardNumber}</span>
                    <span className="text-slate-400 mx-1">•</span>
                    <span className="text-[11px] text-slate-500">{c.location}</span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Citizen Profile & Complaints Modal */}
      <CitizenProfileModal
        citizenId={viewingCitizenId}
        isOpen={!!viewingCitizenId}
        onClose={() => setViewingCitizenId(null)}
      />
    </div>
  );
}
