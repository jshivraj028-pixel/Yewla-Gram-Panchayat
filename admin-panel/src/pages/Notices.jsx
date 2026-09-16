import React, { useEffect, useState } from 'react';
import { Plus, Megaphone, Trash2, Edit2, CheckCircle, X, Pin } from 'lucide-react';
import api from '../services/api';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    marathiTitle: '',
    description: '',
    marathiDescription: '',
    category: 'General',
    isPinned: false,
    isPublished: true,
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notices?all=true');
      if (res.data.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/notices/${editingId}`, formData);
      } else {
        await api.post('/notices', formData);
      }
      setShowModal(false);
      resetForm();
      fetchNotices();
    } catch (err) {
      alert('Failed to save notice: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      marathiTitle: '',
      description: '',
      marathiDescription: '',
      category: 'General',
      isPinned: false,
      isPublished: true,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ग्रामपंचायत अधिकृत सूचना फलक व्यवस्थापन</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Notices, Circulars & Tax Announcements • Yewla Gram Panchayat
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Notice / नवीन सूचना</span>
        </button>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No notices published yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notices.map((n) => (
            <div
              key={n._id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {n.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {n.isPinned && (
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                        <Pin className="w-3 h-3" /> PINNED
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        n.isPublished
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {n.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h3>
                {n.marathiTitle && (
                  <p className="text-xs text-slate-600 font-semibold mt-1">{n.marathiTitle}</p>
                )}
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {n.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Date: {new Date(n.publishedAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        title: n.title,
                        marathiTitle: n.marathiTitle || '',
                        description: n.description,
                        marathiDescription: n.marathiDescription || '',
                        category: n.category,
                        isPinned: n.isPinned,
                        isPublished: n.isPublished,
                      });
                      setEditingId(n._id);
                      setShowModal(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-slate-100"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notice Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 text-xs my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Official Notice' : 'Publish New Official Notice'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Budget Gram Sabha Meeting"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Title in Marathi (मराठी शीर्षक)
                </label>
                <input
                  type="text"
                  value={formData.marathiTitle}
                  onChange={(e) => setFormData({ ...formData, marathiTitle: e.target.value })}
                  placeholder="उदा. वार्षिक अंदाजपत्रक ग्रामसभा सूचना"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="General">General (सर्वसाधारण)</option>
                    <option value="Gram Sabha">Gram Sabha (ग्रामसभा)</option>
                    <option value="Health">Health (आरोग्य)</option>
                    <option value="Agriculture">Agriculture (शेती)</option>
                    <option value="Tender">Tender (निविदा)</option>
                    <option value="Tax Notice">Tax Notice (कर सूचना)</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Pin Notice</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold text-slate-700">Published</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notice Details (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter complete notice body..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notice Details in Marathi (मराठी तपशील)
                </label>
                <textarea
                  rows={3}
                  value={formData.marathiDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, marathiDescription: e.target.value })
                  }
                  placeholder="सविस्तर सूचना माहिती..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {editingId ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
