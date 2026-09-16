import React, { useEffect, useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

const CATEGORIES = [
  'All',
  'Water Supply',
  'Road & Infrastructure',
  'Street Light',
  'Sanitation & Waste',
  'Drainage',
  'Health & Hygiene',
  'Tax & Assessment',
  'Encroachment',
  'Other',
];

const STATUSES = [
  'All',
  'Pending',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
];

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filter params
  const [status, setStatus] = useState('All');
  const [category, setCategory] = useState('All');
  const [wardNumber, setWardNumber] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Preview complaints list
  const [previewList, setPreviewList] = useState([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPreview();
  }, [status, category, wardNumber, startDate, endDate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports/dashboard-stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load report statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreview = async () => {
    setLoadingPreview(true);
    try {
      const params = { limit: 10 };
      if (status !== 'All') params.status = status;
      if (category !== 'All') params.category = category;
      if (wardNumber !== 'All') params.wardNumber = wardNumber;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await api.get('/complaints', { params });
      if (res.data.success) {
        setPreviewList(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch preview:', err);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (status !== 'All') params.append('status', status);
      if (category !== 'All') params.append('category', category);
      if (wardNumber !== 'All') params.append('wardNumber', wardNumber);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/reports/complaints/export-csv?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `yewla_complaints_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export CSV report: ' + (err.message || 'Error'));
    } finally {
      setExporting(false);
    }
  };

  const resolutionRate = stats?.cards?.totalComplaints
    ? Math.round((stats.cards.resolvedComplaints / stats.cards.totalComplaints) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">अहवाल व डेटा निर्यात (CSV Reports)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit Analytics, Complaint Resolution Metrics & Government Export
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={exporting}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          {exporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Download Complaints CSV / डेटा डाउनलोड करा</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Grievances</p>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {stats?.cards?.totalComplaints || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
            <span>Logged in system</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-emerald-700">Resolved Grievances</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {stats?.cards?.resolvedComplaints || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{resolutionRate}% Resolution Rate</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-amber-700">Pending / Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {stats?.cards?.pendingComplaints || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-1 font-semibold">
            <Clock className="w-3 h-3" />
            <span>Awaiting action</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-blue-700">In Progress / Assigned</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {stats?.cards?.inProgressComplaints || 0}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-blue-600 mt-1 font-semibold">
            <RefreshCw className="w-3 h-3" />
            <span>Field work active</span>
          </div>
        </div>
      </div>

      {/* Analytics Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Grievances by Category (तक्रार वर्गवारी)</span>
          </h2>
          <div className="space-y-3">
            {stats?.complaintsByCategory?.length ? (
              stats.complaintsByCategory.map((c) => {
                const total = stats.cards?.totalComplaints || 1;
                const pct = Math.round((c.count / total) * 100);
                return (
                  <div key={c._id}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{c._id || 'Unspecified'}</span>
                      <span className="font-bold">
                        {c.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No categories recorded yet</p>
            )}
          </div>
        </div>

        {/* Status Breakdown & Request Metrics */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Service Requests Breakdown (दाखले व अर्ज)</span>
          </h2>
          <div className="space-y-3">
            {stats?.requestsByType?.length ? (
              stats.requestsByType.map((r) => {
                const totalReq = stats.cards?.totalRequests || 1;
                const pct = Math.round((r.count / totalReq) * 100);
                return (
                  <div key={r._id}>
                    <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                      <span>{r._id || 'Standard Application'}</span>
                      <span className="font-bold">
                        {r.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No service requests recorded yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Filter Parameters Section for Export & Preview */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Export & Filter Criteria</span>
          </h3>
          <span className="text-xs text-slate-500">
            Preview showing top matching records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Ward</label>
            <select
              value={wardNumber}
              onChange={(e) => setWardNumber(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="All">All Wards</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Ward {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
          </div>
        </div>

        {/* Live Filter Preview Table */}
        <div className="pt-2 border-t border-slate-100">
          {/* Mobile View (< 768px) */}
          <div className="md:hidden divide-y divide-slate-100">
            {loadingPreview ? (
              <div className="text-center py-6 text-slate-400">Loading preview...</div>
            ) : previewList.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                No complaints match the selected filter.
              </div>
            ) : (
              previewList.map((c) => (
                <div key={c._id} className="py-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.complaintId}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="font-bold text-slate-900 text-xs">{c.title}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{c.citizen?.name || 'Citizen'} • Ward #{c.wardNumber}</span>
                    <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                      {c.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">
                    {new Date(c.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop View (>= 768px) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 min-w-[650px]">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3 py-2 whitespace-nowrap">ID</th>
                  <th className="px-3 py-2 whitespace-nowrap">Title</th>
                  <th className="px-3 py-2 whitespace-nowrap">Citizen</th>
                  <th className="px-3 py-2 whitespace-nowrap">Category</th>
                  <th className="px-3 py-2 whitespace-nowrap">Ward</th>
                  <th className="px-3 py-2 whitespace-nowrap">Status</th>
                  <th className="px-3 py-2 whitespace-nowrap">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingPreview ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-400">
                      Loading preview...
                    </td>
                  </tr>
                ) : previewList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-slate-400">
                      No complaints match the selected filter.
                    </td>
                  </tr>
                ) : (
                  previewList.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {c.complaintId}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-900 max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{c.citizen?.name || 'Citizen'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{c.category}</td>
                      <td className="px-3 py-2 whitespace-nowrap">Ward #{c.wardNumber}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-3 py-2 text-slate-400 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
