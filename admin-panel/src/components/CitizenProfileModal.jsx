import React, { useEffect, useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Send,
  Trash2,
  Shield,
  FileText,
  ExternalLink,
} from 'lucide-react';
import api from '../services/api';
import StatusBadge from './StatusBadge';
import { getImageUrl } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';

export default function CitizenProfileModal({ citizenId, isOpen, onClose }) {
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [openCommentsMap, setOpenCommentsMap] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});
  const [likingMap, setLikingMap] = useState({});

  useEffect(() => {
    if (isOpen && citizenId) {
      fetchCitizenProfile();
    } else {
      setProfileData(null);
    }
  }, [isOpen, citizenId]);

  const fetchCitizenProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users/${citizenId}/profile`);
      if (res.data.success) {
        setProfileData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load citizen profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (complaintId) => {
    if (likingMap[complaintId]) return;
    setLikingMap((prev) => ({ ...prev, [complaintId]: true }));

    try {
      const res = await api.post(`/complaints/${complaintId}/like`);
      if (res.data.success) {
        const { likes } = res.data.data;
        setProfileData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            complaints: prev.complaints.map((c) =>
              c._id === complaintId ? { ...c, likes } : c
            ),
          };
        });
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setLikingMap((prev) => ({ ...prev, [complaintId]: false }));
    }
  };

  const handleAddComment = async (e, complaintId) => {
    e.preventDefault();
    const text = commentInputs[complaintId]?.trim();
    if (!text || submittingComment[complaintId]) return;

    setSubmittingComment((prev) => ({ ...prev, [complaintId]: true }));
    try {
      const res = await api.post(`/complaints/${complaintId}/comments`, { text });
      if (res.data.success) {
        const updatedComments = res.data.data;
        setProfileData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            complaints: prev.complaints.map((c) =>
              c._id === complaintId ? { ...c, comments: updatedComments } : c
            ),
          };
        });
        setCommentInputs((prev) => ({ ...prev, [complaintId]: '' }));
      }
    } catch (err) {
      alert('Failed to post comment: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [complaintId]: false }));
    }
  };

  const handleDeleteComment = async (complaintId, commentId) => {
    if (!window.confirm('Delete this comment? / ही कमेंट हटवायची आहे का?')) return;

    try {
      const res = await api.delete(`/complaints/${complaintId}/comments/${commentId}`);
      if (res.data.success) {
        const updatedComments = res.data.data;
        setProfileData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            complaints: prev.complaints.map((c) =>
              c._id === complaintId ? { ...c, comments: updatedComments } : c
            ),
          };
        });
      }
    } catch (err) {
      alert('Failed to delete comment: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleCommentsSection = (complaintId) => {
    setOpenCommentsMap((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }));
  };

  if (!isOpen) return null;

  const citizen = profileData?.user;
  const stats = profileData?.stats || {};
  const complaints = profileData?.complaints || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 my-auto overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              नागरिक प्रोफाइल व तक्रार इतिहास
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">(Citizen Profile)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 text-xs">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !citizen ? (
            <div className="text-center py-12 text-slate-400">
              User details could not be found.
            </div>
          ) : (
            <>
              {/* Profile Card Banner */}
              <div className="bg-gradient-to-br from-emerald-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-sm">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg shrink-0 overflow-hidden border-2 border-emerald-300 shadow-md">
                      {getImageUrl(citizen.avatar) ? (
                        <img
                          src={getImageUrl(citizen.avatar)}
                          alt={citizen.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        citizen.name?.[0]?.toUpperCase() || 'C'
                      )}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold leading-tight text-white">
                        {citizen.name}
                      </h3>
                      {citizen.marathiName && (
                        <p className="text-xs text-emerald-200">{citizen.marathiName}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/80 text-white border border-emerald-400/40">
                          Ward #{citizen.wardNumber || 'N/A'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                          {citizen.role?.toUpperCase()}
                        </span>
                        {citizen.isActive ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Active Account
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            Blocked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    {citizen.mobile ? (
                      <a
                        href={`tel:${citizen.mobile}`}
                        className="text-white hover:text-emerald-200 font-mono font-medium hover:underline"
                      >
                        {citizen.mobile}
                      </a>
                    ) : (
                      <span className="text-slate-400">No Mobile</span>
                    )}
                  </div>
                  {citizen.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="text-slate-200 truncate">{citizen.email}</span>
                    </div>
                  )}
                  {citizen.address && (
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="text-slate-200 truncate">{citizen.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Citizen Stats Counter */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">एकूण तक्रारी</p>
                  <p className="text-lg font-black text-slate-900 mt-0.5">
                    {stats.totalComplaints || 0}
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase">निवारण पूर्ण</p>
                  <p className="text-lg font-black text-emerald-800 mt-0.5">
                    {stats.resolvedComplaints || 0}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                  <p className="text-[10px] font-bold text-amber-700 uppercase">प्रलंबित</p>
                  <p className="text-lg font-black text-amber-800 mt-0.5">
                    {stats.pendingComplaints || 0}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">दाखले अर्ज</p>
                  <p className="text-lg font-black text-blue-800 mt-0.5">
                    {stats.totalRequests || 0}
                  </p>
                </div>
              </div>

              {/* Citizen's Complaints Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>नागरिकाने केलेल्या तक्रारी ({complaints.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">सर्व सार्वजनिक तक्रारी</span>
                </div>

                {complaints.length === 0 ? (
                  <div className="text-center p-8 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-semibold text-slate-600">या नागरिकाने कोणतीही तक्रार नोंदवली नाही.</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      No complaints lodged yet by this citizen.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((c) => {
                      const isLiked = c.likes?.some(
                        (id) => (id._id || id)?.toString() === currentUser?._id?.toString()
                      );
                      const likesCount = c.likes?.length || 0;
                      const commentsList = c.comments || [];
                      const isCommentsOpen = openCommentsMap[c._id] ?? true;

                      return (
                        <div
                          key={c._id}
                          className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden hover:border-slate-300 transition-colors"
                        >
                          {/* Complaint Top Row */}
                          <div className="p-4 space-y-2.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
                                {c.complaintId}
                              </span>
                              <StatusBadge status={c.status} />
                            </div>

                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {c.category}
                              </span>
                            </div>

                            <div>
                              <h5 className="font-bold text-slate-900 text-sm leading-snug">
                                {c.title}
                              </h5>
                              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                                {c.description}
                              </p>
                            </div>

                            {/* Location & Reported date */}
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                              <span className="truncate max-w-[240px]">
                                Ward #{c.wardNumber} • {c.location}
                              </span>
                              <span>
                                {new Date(c.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            {/* Photo if present */}
                            {c.photo && (
                              <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 max-h-48 bg-slate-100">
                                <img
                                  src={getImageUrl(c.photo)}
                                  alt="Complaint Site"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}

                            {/* Admin Remarks if any */}
                            {c.adminRemarks && (
                              <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs">
                                <span className="font-bold">प्रशासन शेरा:</span> {c.adminRemarks}
                              </div>
                            )}

                            {/* Like & Comments Action Bar */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                              {/* Like Button */}
                              <button
                                onClick={() => handleToggleLike(c._id)}
                                disabled={likingMap[c._id]}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                                  isLiked
                                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                                    isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
                                  }`}
                                />
                                <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                              </button>

                              {/* Comments Toggle Button */}
                              <button
                                onClick={() => toggleCommentsSection(c._id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 font-bold text-xs transition-colors"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>
                                  {commentsList.length}{' '}
                                  {commentsList.length === 1 ? 'Comment' : 'Comments'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Comments Section */}
                          {isCommentsOpen && (
                            <div className="bg-slate-50/90 border-t border-slate-200 p-4 space-y-3">
                              <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                                सार्वजनिक प्रतिक्रिया व टिप्पण्या (Comments)
                              </p>

                              {/* Comment List */}
                              {commentsList.length === 0 ? (
                                <p className="text-slate-400 text-xs italic py-1">
                                  अद्याप कोणतीही टिप्पणी नाही. पहिली प्रतिक्रिया द्या!
                                </p>
                              ) : (
                                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                                  {commentsList.map((comm) => {
                                    const canDelete =
                                      currentUser?.role === 'admin' ||
                                      (comm.user?._id || comm.user)?.toString() ===
                                        currentUser?._id?.toString();

                                    return (
                                      <div
                                        key={comm._id}
                                        className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex items-start justify-between gap-2"
                                      >
                                        <div className="flex items-start gap-2.5">
                                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 overflow-hidden border border-emerald-200">
                                            {getImageUrl(comm.user?.avatar) ? (
                                              <img
                                                src={getImageUrl(comm.user.avatar)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              comm.user?.name?.[0]?.toUpperCase() || 'U'
                                            )}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-1.5">
                                              <span className="font-bold text-slate-900 text-xs">
                                                {comm.user?.name || 'User'}
                                              </span>
                                              {comm.user?.role && (
                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                                                  {comm.user.role}
                                                </span>
                                              )}
                                              <span className="text-[10px] text-slate-400">
                                                {new Date(comm.createdAt).toLocaleDateString('en-IN', {
                                                  day: 'numeric',
                                                  month: 'short',
                                                })}
                                              </span>
                                            </div>
                                            <p className="text-slate-700 text-xs mt-0.5 whitespace-pre-wrap">
                                              {comm.text}
                                            </p>
                                          </div>
                                        </div>

                                        {canDelete && (
                                          <button
                                            onClick={() => handleDeleteComment(c._id, comm._id)}
                                            className="p-1 rounded text-slate-300 hover:text-rose-600 transition-colors"
                                            title="Delete Comment"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Comment Input Box */}
                              <form
                                onSubmit={(e) => handleAddComment(e, c._id)}
                                className="flex items-center gap-2 pt-1"
                              >
                                <input
                                  type="text"
                                  placeholder="प्रतिक्रिया / टिप्पणी लिहा (Write comment)..."
                                  value={commentInputs[c._id] || ''}
                                  onChange={(e) =>
                                    setCommentInputs((prev) => ({
                                      ...prev,
                                      [c._id]: e.target.value,
                                    }))
                                  }
                                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                />
                                <button
                                  type="submit"
                                  disabled={
                                    !commentInputs[c._id]?.trim() || submittingComment[c._id]
                                  }
                                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs shrink-0"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Post</span>
                                </button>
                              </form>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
