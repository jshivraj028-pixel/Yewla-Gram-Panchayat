import React, { useEffect, useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Trash2, Edit2, X, Users } from 'lucide-react';
import api from '../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    marathiTitle: '',
    eventType: 'Gram Sabha',
    eventDate: '',
    time: '11:00 AM',
    location: 'Gram Panchayat Office, Yewla',
    description: '',
    agenda: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        agenda: formData.agenda
          .split('\n')
          .map((a) => a.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api.put(`/events/${editingId}`, payload);
      } else {
        await api.post('/events', payload);
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      alert('Failed to save event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ग्रामसभा व कार्यक्रम वेळापत्रक</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gram Sabha Meetings & Village Events Schedule • Yewla Gram Panchayat
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              title: '',
              marathiTitle: '',
              eventType: 'Gram Sabha',
              eventDate: new Date().toISOString().split('T')[0],
              time: '11:00 AM',
              location: 'Gram Panchayat Office, Yewla',
              description: '',
              agenda: '',
            });
            setEditingId(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Event / ग्रामसभा आयोजित करा</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No events scheduled</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{ev.eventType}</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    {new Date(ev.eventDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{ev.title}</h3>
                {ev.marathiTitle && (
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">{ev.marathiTitle}</p>
                )}
                {ev.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{ev.description}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.time}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ev.location}</span>
                  </span>
                </div>

                {ev.agenda?.length > 0 && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-700 mb-1">Agenda Items:</p>
                    <ul className="text-[11px] text-slate-600 space-y-0.5">
                      {ev.agenda.map((ag, i) => (
                        <li key={i} className="truncate">
                          • {ag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setFormData({
                      title: ev.title,
                      marathiTitle: ev.marathiTitle || '',
                      eventType: ev.eventType,
                      eventDate: new Date(ev.eventDate).toISOString().split('T')[0],
                      time: ev.time,
                      location: ev.location,
                      description: ev.description || '',
                      agenda: (ev.agenda || []).join('\n'),
                    });
                    setEditingId(ev._id);
                    setShowModal(true);
                  }}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(ev._id)}
                  className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 text-xs my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                {editingId ? 'Edit Event Details' : 'Schedule Gram Sabha / Event'}
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
                <label className="block font-bold text-slate-700 mb-1">Event / Sabha Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Special Gram Sabha for Jal Jeevan Mission"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marathi Title</label>
                <input
                  type="text"
                  value={formData.marathiTitle}
                  onChange={(e) => setFormData({ ...formData, marathiTitle: e.target.value })}
                  placeholder="उदा. विशेष ग्रामसभा"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Gram Sabha">Gram Sabha</option>
                    <option value="Medical Camp">Medical Camp</option>
                    <option value="Agricultural Workshop">Workshop</option>
                    <option value="Cultural Program">Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Venue / Location *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Agenda Items (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  placeholder="Resolution of previous meeting&#10;Water pipeline progress&#10;Approval of PMAY beneficiaries"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
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
                  {editingId ? 'Update Event' : 'Schedule Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
