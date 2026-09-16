import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  UserCheck,
  X,
  AlertTriangle,
  Clock,
  Send,
  MapPin,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { getImageUrl } from '../utils/imageUrl';
import CitizenProfileModal from '../components/CitizenProfileModal';

export default function Complaints() {
  const [searchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingCitizenId, setViewingCitizenId] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [wardFilter, setWardFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatusFilter(s);
    const c = searchParams.get('category');
    if (c) setCategoryFilter(c);
  }, [searchParams]);

  // Detail & Action Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalHistory, setModalHistory] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [newAssignedTo, setNewAssignedTo] = useState('');
  const [newRemark, setNewRemark] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, [search, statusFilter, categoryFilter, wardFilter, page]);

  const fetchStaff = async () => {
    try {
      const res = await api.get('/users?role=staff');
      if (res.data.success) {
        setStaffMembers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load staff list:', err);
    }
  };

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 10,
      });
      if (search) params.append('search', search);
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (wardFilter !== 'All') params.append('wardNumber', wardFilter);

      const res = await api.get(`/complaints?${params.toString()}`);
      if (res.data.success) {
        setComplaints(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const openComplaintModal = async (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewAssignedTo(complaint.assignedTo?._id || '');
    setNewRemark('');

    try {
      const res = await api.get(`/complaints/${complaint._id}`);
      if (res.data.success) {
        setModalHistory(res.data.data.history || []);
      }
    } catch (err) {
      console.error('Failed to load complaint timeline:', err);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      const payload = {
        status: newStatus,
        adminRemarks: newRemark,
      };
      if (newAssignedTo) payload.assignedTo = newAssignedTo;

      const res = await api.patch(`/complaints/${selectedComplaint._id}/status`, payload);
      if (res.data.success) {
        // Refresh detail history and main table
        const historyRes = await api.get(`/complaints/${selectedComplaint._id}`);
        if (historyRes.data.success) {
          setSelectedComplaint(historyRes.data.data.complaint);
          setModalHistory(historyRes.data.data.history);
        }
        setNewRemark('');
        fetchComplaints();
      }
    } catch (err) {
      alert('Failed to update complaint: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">नागरिक तक्रार निवारण व्यवस्थापन</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grievance Redressal System • Yewla Gram Panchayat
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ID, title, citizen..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="All">All Statuses (सर्व स्थिती)</option>
            <option value="Pending">Pending (प्रलंबित)</option>
            <option value="Under Review">Under Review (तपासणी सुरू)</option>
            <option value="In Progress">In Progress (कामात प्रगती)</option>
            <option value="Resolved">Resolved (निवारण पूर्ण)</option>
            <option value="Rejected">Rejected (नाकारले)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="All">All Categories (सर्व वर्ग)</option>
            <option value="Road">Road (रस्ते)</option>
            <option value="Water">Water (पाणीपुरवठा)</option>
            <option value="Street Light">Street Light (पथदिवे)</option>
            <option value="Drainage">Drainage (सांडपाणी/गटार)</option>
            <option value="Garbage">Garbage (कचरा)</option>
            <option value="Sanitation">Sanitation (स्वच्छता)</option>
            <option value="Electricity">Electricity (वीज)</option>
            <option value="Public Property">Public Property (सार्वजनिक)</option>
          </select>

          {/* Ward Filter */}
          <select
            value={wardFilter}
            onChange={(e) => {
              setWardFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="All">All Wards (सर्व प्रभाग)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => (
              <option key={w} value={w}>
                Ward {w} (प्रभाग {w})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : complaints.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-sm font-semibold text-slate-600">No matching complaints found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <>
            {/* Mobile View (< 768px): Responsive Cards for all mobile screens */}
            <div className="md:hidden divide-y divide-slate-100">
              {complaints.map((c) => (
                <div key={c._id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                  {/* Top Bar: Tracking ID on left, StatusBadge on right */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                      {c.complaintId}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>

                  {/* Category Badge */}
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 max-w-full">
                      {c.category}
                    </span>
                  </div>

                  {/* Complaint Title */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {c.title}
                    </h3>
                    {c.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {c.description}
                      </p>
                    )}
                  </div>

                  {/* Citizen Info & Location (Clickable to view profile & complaints) */}
                  <div
                    onClick={() => c.citizen?._id && setViewingCitizenId(c.citizen._id)}
                    className="flex items-center gap-2.5 bg-slate-50/90 hover:bg-emerald-50/70 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group"
                    title="Click to view citizen profile & complaints / प्रोफाइल पाहण्यासाठी क्लिक करा"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs group-hover:scale-105 transition-transform">
                      {getImageUrl(c.citizen?.avatar) ? (
                        <img
                          src={getImageUrl(c.citizen.avatar)}
                          alt={c.citizen.name}
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
                        <p className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-800 transition-colors">
                          {c.citizen?.name || 'Citizen'}
                        </p>
                        <span className="text-[10px] text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile ↗
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-2">
                        {c.citizen?.mobile && (
                          <span className="font-medium text-slate-600">
                            {c.citizen.mobile}
                          </span>
                        )}
                        <span>•</span>
                        <span className="truncate">Ward {c.wardNumber}</span>
                      </p>
                    </div>
                  </div>

                  {/* Meta: Officer & Date */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      {c.assignedTo ? (
                        <span className="flex items-center gap-1 text-indigo-700 font-semibold">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{c.assignedTo.name}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </div>
                    <span className="text-slate-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Manage Action Button */}
                  <button
                    onClick={() => openComplaintModal(c)}
                    className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Manage / निवारण कार्यवाही</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View (>= 768px): Full Table with Min-Width */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[850px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-5 py-3 whitespace-nowrap">Tracking ID</th>
                    <th className="px-5 py-3 whitespace-nowrap">Citizen</th>
                    <th className="px-5 py-3 whitespace-nowrap">Category & Subject</th>
                    <th className="px-5 py-3 whitespace-nowrap">Ward / Location</th>
                    <th className="px-5 py-3 whitespace-nowrap">Status</th>
                    <th className="px-5 py-3 whitespace-nowrap">Assigned Officer</th>
                    <th className="px-5 py-3 whitespace-nowrap">Reported</th>
                    <th className="px-5 py-3 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {complaints.map((c) => (
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
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs group-hover:scale-105 transition-transform">
                            {getImageUrl(c.citizen?.avatar) ? (
                              <img
                                src={getImageUrl(c.citizen.avatar)}
                                alt={c.citizen.name}
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
                              {c.citizen?.name}
                            </p>
                            <p className="text-[11px] text-slate-400">{c.citizen?.mobile}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 max-w-xs">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1 whitespace-nowrap">
                          {c.category}
                        </span>
                        <p className="font-semibold text-slate-800 truncate">{c.title}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        <p className="font-bold text-slate-800 whitespace-nowrap">Ward {c.wardNumber}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{c.location}</p>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {c.assignedTo ? (
                          <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>{c.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => openComplaintModal(c)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <p className="text-center sm:text-left">
                Showing {complaints.length} of {pagination.total} complaints
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-semibold"
                >
                  Previous
                </button>
                <span className="font-bold text-slate-700 whitespace-nowrap">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Complaint Details & Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {selectedComplaint.complaintId}
                  </span>
                  <StatusBadge status={selectedComplaint.status} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 flex-1 text-xs">
              {/* Citizen & Location summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 overflow-hidden border border-emerald-200 shadow-xs">
                    {getImageUrl(selectedComplaint.citizen?.avatar) ? (
                      <img
                        src={getImageUrl(selectedComplaint.citizen.avatar)}
                        alt={selectedComplaint.citizen.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      selectedComplaint.citizen?.name?.[0]?.toUpperCase() || 'C'
                    )}
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Citizen Information</p>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">
                      {selectedComplaint.citizen?.name}
                    </p>
                    <p className="text-slate-500">{selectedComplaint.citizen?.mobile}</p>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 uppercase font-semibold">Ward & Location</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ward {selectedComplaint.wardNumber}</span>
                  </p>
                  <p className="text-slate-500">{selectedComplaint.location}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Detailed Grievance Description
                </p>
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed">
                  {selectedComplaint.description}
                </div>
              </div>

              {/* Uploaded Photo */}
              {selectedComplaint.photo && (
                <div>
                  <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                    Attached Site Photo
                  </p>
                  <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-black flex items-center justify-center">
                    <img
                      src={
                        selectedComplaint.photo.startsWith('http')
                          ? selectedComplaint.photo
                          : `http://localhost:5000${selectedComplaint.photo}`
                      }
                      alt="Complaint"
                      className="max-h-56 w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Action Form: Update Status, Staff Assignment & Remarks */}
              <form
                onSubmit={handleUpdateStatus}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3"
              >
                <p className="font-bold text-emerald-950 uppercase tracking-wider text-xs">
                  Take Administrative Action
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Update Status / प्रगती स्थिती
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Pending">Pending (प्रलंबित)</option>
                      <option value="Under Review">Under Review (तपासणी सुरू)</option>
                      <option value="Assigned">Assigned (अधिकारी नियुक्त)</option>
                      <option value="In Progress">In Progress (कामात प्रगती)</option>
                      <option value="Resolved">Resolved (निवारण पूर्ण)</option>
                      <option value="Rejected">Rejected (नाकारले)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Assign Staff Member / जबाबदार अधिकारी
                    </label>
                    <select
                      value={newAssignedTo}
                      onChange={(e) => setNewAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Select Officer --</option>
                      {staffMembers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} ({s.designation || 'Staff'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Official Remark / शेरा (Visible to Citizen)
                  </label>
                  <textarea
                    rows={2}
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    placeholder="Enter resolution notes, contractor dispatch details, or action summary..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUpdating ? 'Recording...' : 'Update Status & Notify Citizen'}</span>
                  </button>
                </div>
              </form>

              {/* Complete Audit Trail */}
              <div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-3">
                  Historical Action Log & Audit Trail (पारदर्शकता इतिहास)
                </p>
                <div className="border-l-2 border-slate-200 ml-2 space-y-4 pl-4">
                  {modalHistory.map((item, idx) => (
                    <div key={item._id || idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="flex items-center justify-between">
                        <StatusBadge status={item.newStatus} />
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium text-xs mt-1">
                        {item.remark || 'Status updated'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Action by: {item.changedByName} ({item.changedByRole})
                        {item.assignedToName ? ` • Assigned to: ${item.assignedToName}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end rounded-b-2xl">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Profile & Complaints Modal */}
      <CitizenProfileModal
        citizenId={viewingCitizenId}
        isOpen={!!viewingCitizenId}
        onClose={() => setViewingCitizenId(null)}
      />
    </div>
  );
}
