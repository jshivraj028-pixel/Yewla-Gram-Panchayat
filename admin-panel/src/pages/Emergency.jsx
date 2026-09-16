import React, { useEffect, useState } from 'react';
import {
  PhoneCall,
  Plus,
  Edit2,
  Trash2,
  X,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';

const DEPARTMENTS = [
  'Police',
  'Ambulance',
  'Fire Brigade',
  'Gram Panchayat Office',
  'Electricity',
  'Water Department',
  'Healthcare',
  'Women Helpline',
  'Disaster Management',
];

export default function Emergency() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    marathiName: '',
    department: 'Police',
    phoneNumber: '',
    altPhoneNumber: '',
    address: 'Yewla, Dist. Jalna',
    isAvailable24x7: true,
    priorityOrder: 0,
  });

  useEffect(() => {
    fetchContacts();
  }, [selectedDept]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedDept !== 'All') params.department = selectedDept;
      const res = await api.get('/emergency', { params });
      if (res.data.success) {
        setContacts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load emergency contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      marathiName: '',
      department: 'Gram Panchayat Office',
      phoneNumber: '',
      altPhoneNumber: '',
      address: 'Gram Panchayat Office, Yewla, Dist. Jalna',
      isAvailable24x7: true,
      priorityOrder: 0,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      name: c.name || '',
      marathiName: c.marathiName || '',
      department: c.department || 'Gram Panchayat Office',
      phoneNumber: c.phoneNumber || '',
      altPhoneNumber: c.altPhoneNumber || '',
      address: c.address || 'Yewla, Dist. Jalna',
      isAvailable24x7: c.isAvailable24x7 ?? true,
      priorityOrder: c.priorityOrder ?? 0,
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (editingId) {
        await api.put(`/emergency/${editingId}`, formData);
      } else {
        await api.post('/emergency', formData);
      }
      setShowModal(false);
      fetchContacts();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save contact');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete emergency contact "${name}"?`)) return;
    try {
      await api.delete(`/emergency/${id}`);
      fetchContacts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete contact');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">आपत्कालीन संपर्क व्यवस्थापन</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency Contacts Directory • Yewla Gram Panchayat
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Emergency Contact / नवीन संपर्क जोडा</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedDept('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedDept === 'All'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Departments ({contacts.length})
        </button>
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDept === dept
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Contacts Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <PhoneCall className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">No emergency contacts found</p>
          <p className="text-xs text-slate-400 mt-1">Add telephone numbers for citizens to access in emergencies.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    {c.department}
                  </span>
                  {c.isAvailable24x7 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> 24x7
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-3">{c.name}</h3>
                {c.marathiName && (
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{c.marathiName}</p>
                )}

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                    <a
                      href={`tel:${c.phoneNumber}`}
                      className="hover:text-rose-600 transition-colors text-sm font-bold"
                    >
                      {c.phoneNumber}
                    </a>
                    {c.altPhoneNumber && (
                      <span className="text-slate-400 text-xs font-normal">
                        / {c.altPhoneNumber}
                      </span>
                    )}
                  </div>

                  {c.address && (
                    <div className="flex items-start gap-2 text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{c.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Priority: #{c.priorityOrder || 0}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id, c.name)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Emergency Contact' : 'Add New Emergency Contact'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Yewla Rural Hospital"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">नाव (मराठी)</label>
                  <input
                    type="text"
                    value={formData.marathiName}
                    onChange={(e) => setFormData({ ...formData, marathiName: e.target.value })}
                    placeholder="उदा. येवला ग्रामीण रुग्णालय"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Order</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.priorityOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, priorityOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="e.g. 02559-222100 or 112"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alternate Phone</label>
                  <input
                    type="tel"
                    value={formData.altPhoneNumber}
                    onChange={(e) => setFormData({ ...formData, altPhoneNumber: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Address / Location</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Station Road, Yewla"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isAvailable24x7"
                  checked={formData.isAvailable24x7}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable24x7: e.target.checked })
                  }
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <label htmlFor="isAvailable24x7" className="font-semibold text-slate-700 select-none">
                  Available 24x7 / २४ तास आपत्कालीन सेवा उपलब्ध
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
                >
                  {editingId ? 'Update Contact' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
