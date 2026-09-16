import React, { useEffect, useState } from 'react';
import { Plus, Hammer, Trash2, Edit2, X, TrendingUp } from 'lucide-react';
import api from '../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    marathiName: '',
    category: 'Road Construction',
    description: '',
    location: '',
    wardNumber: 1,
    budget: 1000000,
    spent: 0,
    contractorName: '',
    startDate: '',
    expectedCompletionDate: '',
    status: 'In Progress',
    progressPercentage: 25,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        wardNumber: Number(formData.wardNumber),
        budget: Number(formData.budget),
        spent: Number(formData.spent),
        progressPercentage: Number(formData.progressPercentage),
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      alert('Failed to save project: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this infrastructure project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">गाव विकास प्रकल्प व्यवस्थापन</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent Village Infrastructure Tracker • Yewla Gram Panchayat
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              name: '',
              marathiName: '',
              category: 'Road Construction',
              description: '',
              location: 'Ward 1, Yewla',
              wardNumber: 1,
              budget: 1500000,
              spent: 500000,
              contractorName: '',
              startDate: new Date().toISOString().split('T')[0],
              expectedCompletionDate: new Date(Date.now() + 180 * 24 * 3600 * 1000)
                .toISOString()
                .split('T')[0],
              status: 'In Progress',
              progressPercentage: 20,
            });
            setEditingId(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Development Project / नवीन काम</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No development projects logged</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {p.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      p.status === 'Completed'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {p.status} ({p.progressPercentage}%)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                {p.marathiName && (
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{p.marathiName}</p>
                )}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.description}</p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Physical Progress</span>
                    <span className="text-slate-900 font-bold">{p.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${p.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Financials */}
                <div className="mt-4 grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Sanctioned Budget
                    </span>
                    <span className="font-bold text-slate-800">
                      ₹{(p.budget / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Disbursed Amount
                    </span>
                    <span className="font-bold text-emerald-700">
                      ₹{(p.spent / 100000).toFixed(2)} Lakh
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Location: {p.location}</span>
                  <span>Ward {p.wardNumber}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Contractor: {p.contractorName || 'Local Panchayat'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        name: p.name,
                        marathiName: p.marathiName || '',
                        category: p.category,
                        description: p.description,
                        location: p.location,
                        wardNumber: p.wardNumber,
                        budget: p.budget,
                        spent: p.spent,
                        contractorName: p.contractorName || '',
                        startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
                        expectedCompletionDate: p.expectedCompletionDate
                          ? new Date(p.expectedCompletionDate).toISOString().split('T')[0]
                          : '',
                        status: p.status,
                        progressPercentage: p.progressPercentage,
                      });
                      setEditingId(p._id);
                      setShowModal(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
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
                {editingId ? 'Update Development Project' : 'Add Development Project'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 pt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Underground Drainage Network Stage II"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marathi Name</label>
                <input
                  type="text"
                  value={formData.marathiName}
                  onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                  placeholder="उदा. भुयारी गटार योजना टप्पा २"
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
                    <option value="Road Construction">Road Construction (रस्ते)</option>
                    <option value="Water Supply">Water Supply (पाणीपुरवठा)</option>
                    <option value="Drainage">Drainage (सांडपाणी)</option>
                    <option value="Solar Energy">Solar Energy (सौर ऊर्जा)</option>
                    <option value="Community Building">Community Building (सभागृह)</option>
                    <option value="Sanitation">Sanitation (स्वच्छता)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Approved">Approved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delayed">Delayed</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Progress Percentage:</span>
                  <span className="text-emerald-700">{formData.progressPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progressPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, progressPercentage: Number(e.target.value) })
                  }
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disbursed (₹)</label>
                  <input
                    type="number"
                    value={formData.spent}
                    onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ward Number</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.wardNumber}
                    onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location Details</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Station Road to Market"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contractor / Agency</label>
                <input
                  type="text"
                  value={formData.contractorName}
                  onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                  placeholder="e.g. M/s Patil Infra Pvt Ltd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
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
                  {editingId ? 'Update Project' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
