import React, { useEffect, useState } from 'react';
import { Plus, Image, Trash2, X } from 'lucide-react';
import api from '../services/api';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    marathiTitle: '',
    category: 'Event',
    imageUrl: '',
    caption: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      if (res.data.success) {
        setImages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gallery', formData);
      setShowModal(false);
      fetchImages();
    } catch (err) {
      alert('Failed to save gallery item');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo from village gallery?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchImages();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">गाव छायाचित्र दालन व्यवस्थापन</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Village Gallery & Achievements Media • Yewla Gram Panchayat
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({
              title: '',
              marathiTitle: '',
              category: 'Event',
              imageUrl: '',
              caption: '',
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Photo / नवीन फोटो जोडा</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No gallery images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div className="h-44 bg-slate-100 overflow-hidden relative group">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleDelete(img._id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {img.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-2">{img.title}</h3>
                {img.caption && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{img.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Add Photo to Village Gallery</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 pt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Tree Plantation Drive at ZP School"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="Event">Event (कार्यक्रम)</option>
                  <option value="Development">Development (विकासकामे)</option>
                  <option value="Gram Sabha">Gram Sabha (ग्रामसभा)</option>
                  <option value="Village Heritage">Village Heritage (वारसा)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
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
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
