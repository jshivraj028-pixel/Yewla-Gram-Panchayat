import React, { useEffect, useState } from 'react';
import { Plus, Gift, Trash2, Edit2, X, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    marathiName: '',
    category: 'Agriculture',
    description: '',
    eligibility: '',
    benefitAmount: '',
    officialLink: '',
    requiredDocuments: '',
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/schemes?activeOnly=false');
      if (res.data.success) {
        setSchemes(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        requiredDocuments: formData.requiredDocuments
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(`/schemes/${editingId}`, payload);
      } else {
        await api.post('/schemes', payload);
      }
      setShowModal(false);
      fetchSchemes();
    } catch (err) {
      alert('Failed to save scheme: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this government scheme record?')) return;
    try {
      await api.delete(`/schemes/${id}`);
      fetchSchemes();
    } catch (err) {
      alert('Failed to delete scheme');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">शासकीय योजना माहिती व्यवस्थापन</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welfare & Government Schemes Repository • Yewla Gram Panchayat
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              marathiName: '',
              category: 'Agriculture',
              description: '',
              eligibility: '',
              benefitAmount: '',
              officialLink: '',
              requiredDocuments: '',
            });
            setEditingId(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scheme / नवीन योजना</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    {s.category}
                  </span>
                  {s.benefitAmount && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-800 border border-green-200">
                      {s.benefitAmount}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                {s.marathiName && (
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{s.marathiName}</p>
                )}
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {s.description}
                </p>

                {s.eligibility && (
                  <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-700">Eligibility:</span> {s.eligibility}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {s.officialLink ? (
                  <a
                    href={s.officialLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-slate-400">Offline Application</span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        name: s.name,
                        marathiName: s.marathiName || '',
                        category: s.category,
                        description: s.description,
                        eligibility: s.eligibility || '',
                        benefitAmount: s.benefitAmount || '',
                        officialLink: s.officialLink || '',
                        requiredDocuments: (s.requiredDocuments || []).join(', '),
                      });
                      setEditingId(s._id);
                      setShowModal(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-slate-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 text-xs my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Scheme' : 'Add Government Scheme'}
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
                <label className="block font-bold text-slate-700 mb-1">Scheme Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pradhan Mantri Awas Yojana"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marathi Name</label>
                <input
                  type="text"
                  value={formData.marathiName}
                  onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                  placeholder="उदा. प्रधानमंत्री आवास योजना"
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
                    <option value="Agriculture">Agriculture (शेती)</option>
                    <option value="Housing">Housing (घरकुल)</option>
                    <option value="Women & Child">Women & Child (महिला व बाल)</option>
                    <option value="Social Welfare">Social Welfare (सामाजिक न्याय)</option>
                    <option value="Health">Health (आरोग्य)</option>
                    <option value="Education">Education (शिक्षण)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Benefit Amount / Grant</label>
                  <input
                    type="text"
                    value={formData.benefitAmount}
                    onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                    placeholder="e.g. Rs. 1,20,000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Required Documents (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.requiredDocuments}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredDocuments: e.target.value })
                  }
                  placeholder="Aadhaar Card, 7/12 Extract, Bank Passbook"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Portal URL</label>
                <input
                  type="url"
                  value={formData.officialLink}
                  onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                  placeholder="https://pmayg.nic.in"
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
                  {editingId ? 'Update Scheme' : 'Save Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
