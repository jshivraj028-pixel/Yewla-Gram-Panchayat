import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Clock, Eye, X, Send } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import CitizenProfileModal from '../components/CitizenProfileModal';
import { getImageUrl } from '../utils/imageUrl';

export default function Requests() {
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [search, setSearch] = useState('');
  const [viewingCitizenId, setViewingCitizenId] = useState(null);

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setStatusFilter(s);
  }, [searchParams]);

  // Action Modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionStatus, setActionStatus] = useState('Approved');
  const [actionRemark, setActionRemark] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, search]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await api.get(`/requests?${params.toString()}`);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setIsProcessing(true);
    try {
      const res = await api.patch(`/requests/${selectedRequest._id}/status`, {
        status: actionStatus,
        remarks: actionRemark,
      });

      if (res.data.success) {
        setSelectedRequest(null);
        setActionRemark('');
        fetchRequests();
      }
    } catch (err) {
      alert('Failed to process request: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">नागरिक दाखले व सेवा अर्ज पडताळणी</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Service Requests & Verification Queue • Yewla Gram Panchayat
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search Application ID, subject, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="All">All Statuses (सर्व अर्ज)</option>
          <option value="Submitted">Submitted (प्राप्त)</option>
          <option value="Under Review">Under Review (तपासणी सुरू)</option>
          <option value="Processing">Processing (कार्यवाही सुरू)</option>
          <option value="Approved">Approved (मंजूर)</option>
          <option value="Rejected">Rejected (नाकारले)</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-sm font-semibold text-slate-600">No service requests found</p>
          </div>
        ) : (
          <>
            {/* Mobile View (< 768px): Responsive Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {requests.map((r) => (
                <div key={r._id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                  {/* Top Row: Application ID on left, StatusBadge on right (Never overflows!) */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                      {r.requestId}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>

                  {/* Service Type Tag */}
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 max-w-full">
                      {r.requestType}
                    </span>
                  </div>

                  {/* Subject & Remarks */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                      {r.subject}
                    </h3>
                    {r.remarks && (
                      <p className="text-[11px] text-amber-800 mt-1.5 bg-amber-50/90 p-2.5 rounded-lg border border-amber-200/80">
                        <span className="font-semibold">Officer:</span> {r.remarks}
                      </p>
                    )}
                  </div>

                  {/* Citizen info (Click to view profile & complaints) */}
                  <div
                    onClick={() => r.citizen?._id && setViewingCitizenId(r.citizen._id)}
                    className="flex items-center gap-2.5 bg-slate-50/90 hover:bg-emerald-50/70 p-2.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group"
                    title="Click to view citizen profile & complaints / प्रोफाइल पाहण्यासाठी क्लिक करा"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs group-hover:scale-105 transition-transform">
                      {getImageUrl(r.citizen?.avatar) ? (
                        <img
                          src={getImageUrl(r.citizen.avatar)}
                          alt={r.citizen.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        r.citizen?.name?.[0]?.toUpperCase() || 'C'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-800 transition-colors">
                          {r.citizen?.name || 'Citizen'}
                        </p>
                        <span className="text-[10px] text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile ↗
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Ward {r.citizen?.wardNumber} • {r.citizen?.mobile}
                      </p>
                    </div>
                  </div>

                  {/* Date & Process Button */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <span className="text-slate-400 text-[11px]">
                      Applied: {new Date(r.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRequest(r);
                        setActionStatus(r.status === 'Submitted' ? 'Approved' : r.status);
                        setActionRemark(r.remarks || '');
                      }}
                      className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Process Application / कार्यवाही करा</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop / Tablet View (>= 768px): Full Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-5 py-3 whitespace-nowrap">Application ID</th>
                    <th className="px-5 py-3 whitespace-nowrap">Citizen</th>
                    <th className="px-5 py-3 whitespace-nowrap">Service Type</th>
                    <th className="px-5 py-3 whitespace-nowrap">Subject & Remarks</th>
                    <th className="px-5 py-3 whitespace-nowrap">Status</th>
                    <th className="px-5 py-3 whitespace-nowrap">Date</th>
                    <th className="px-5 py-3 text-right whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {requests.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-bold text-slate-900 font-mono whitespace-nowrap">{r.requestId}</td>
                      <td className="px-5 py-3">
                        <div
                          onClick={() => r.citizen?._id && setViewingCitizenId(r.citizen._id)}
                          className="flex items-center gap-2.5 cursor-pointer group hover:opacity-90"
                          title="Click to view citizen profile & complaints / प्रोफाइल पाहण्यासाठी क्लिक करा"
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs group-hover:scale-105 transition-transform">
                            {getImageUrl(r.citizen?.avatar) ? (
                              <img
                                src={getImageUrl(r.citizen.avatar)}
                                alt={r.citizen.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              r.citizen?.name?.[0]?.toUpperCase() || 'C'
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{r.citizen?.name}</p>
                            <p className="text-[11px] text-slate-400">
                              Ward {r.citizen?.wardNumber} • {r.citizen?.mobile}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-bold text-emerald-800 whitespace-nowrap">{r.requestType}</td>
                      <td className="px-5 py-3 max-w-xs">
                        <p className="font-semibold text-slate-800 truncate">{r.subject}</p>
                        {r.remarks && (
                          <p className="text-[11px] text-amber-700 truncate">Officer: {r.remarks}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedRequest(r);
                            setActionStatus(r.status === 'Submitted' ? 'Approved' : r.status);
                            setActionRemark(r.remarks || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Process</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono font-bold text-emerald-700">
                  {selectedRequest.requestId}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedRequest.requestType}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 overflow-hidden border border-emerald-200 shadow-xs">
                  {getImageUrl(selectedRequest.citizen?.avatar) ? (
                    <img
                      src={getImageUrl(selectedRequest.citizen.avatar)}
                      alt={selectedRequest.citizen.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    selectedRequest.citizen?.name?.[0]?.toUpperCase() || 'C'
                  )}
                </div>
                <div>
                  <p className="text-slate-400 font-semibold text-[10px] uppercase">Applicant</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedRequest.citizen?.name} (Ward {selectedRequest.citizen?.wardNumber})
                  </p>
                  <p className="text-slate-500">{selectedRequest.citizen?.mobile}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-500 font-semibold">Application Details</p>
                <p className="text-slate-800 font-medium mt-1 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  {selectedRequest.details}
                </p>
              </div>

              <form onSubmit={handleProcess} className="space-y-3 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Decision Status / निर्णय स्थिती
                  </label>
                  <select
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-white"
                  >
                    <option value="Under Review">Under Review (कागदपत्रे तपासणी सुरू)</option>
                    <option value="Processing">Processing (मंजुरी कार्यवाही सुरू)</option>
                    <option value="Approved">Approve Application (अर्ज मंजूर)</option>
                    <option value="Rejected">Reject Application (अर्ज नाकारण्यात आला)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Endorsement Remark / आदेश व शेरा
                  </label>
                  <textarea
                    rows={3}
                    value={actionRemark}
                    onChange={(e) => setActionRemark(e.target.value)}
                    placeholder="Enter official sign-off notes or rejection reason..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    {isProcessing ? 'Updating...' : 'Confirm Decision'}
                  </button>
                </div>
              </form>
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
