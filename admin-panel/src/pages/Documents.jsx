import React, { useEffect, useState } from 'react';
import { Plus, FolderOpen, Trash2, FileText, Download, X } from 'lucide-react';
import api from '../services/api';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    marathiTitle: '',
    category: 'Forms',
    fileUrl: '/uploads/sample_document.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF',
  });

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      if (res.data.success) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/documents', formData);
      setShowModal(false);
      fetchDocs();
    } catch (err) {
      alert('Failed to upload document');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this public document?')) return;
    try {
      await api.delete(`/documents/${id}`);
      fetchDocs();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">अधिकृत कागदपत्रे व नागरिक सनद</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Public Documents, Forms & Citizen Charter • Yewla Gram Panchayat
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document / नवीन कागदपत्र</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No documents found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Mobile View (< 768px): Responsive Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {documents.map((doc) => (
              <div key={doc._id} className="p-4 space-y-2.5 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{doc.title}</h3>
                    {doc.marathiTitle && (
                      <p className="text-[11px] text-slate-400 mt-0.5">{doc.marathiTitle}</p>
                    )}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[10px] shrink-0 whitespace-nowrap">
                    {doc.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-rose-700 uppercase text-[11px]">{doc.fileType}</span>
                    <span>•</span>
                    <span className="text-[11px]">{doc.fileSize}</span>
                    <span>•</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => alert(`Downloading: ${doc.title}`)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100 border border-slate-200"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 border border-rose-200"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / Tablet View (>= 768px): Full Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-5 py-3 whitespace-nowrap">Document Title</th>
                  <th className="px-5 py-3 whitespace-nowrap">Category</th>
                  <th className="px-5 py-3 whitespace-nowrap">File Type</th>
                  <th className="px-5 py-3 whitespace-nowrap">Size</th>
                  <th className="px-5 py-3 whitespace-nowrap">Uploaded Date</th>
                  <th className="px-5 py-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3">
                      <p className="font-bold text-slate-900">{doc.title}</p>
                      {doc.marathiTitle && (
                        <p className="text-[11px] text-slate-500">{doc.marathiTitle}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[11px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-rose-700 whitespace-nowrap">{doc.fileType}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{doc.fileSize}</td>
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(doc.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Downloading: ${doc.title}`)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-700 rounded-lg hover:bg-slate-100"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Upload Public Document</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 pt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Citizen Charter 2026-27"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marathi Title</label>
                <input
                  type="text"
                  value={formData.marathiTitle}
                  onChange={(e) => setFormData({ ...formData, marathiTitle: e.target.value })}
                  placeholder="उदा. नागरिक सनद"
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
                  <option value="Citizen Charter">Citizen Charter (नागरिक सनद)</option>
                  <option value="Forms">Forms (अर्ज नमुने)</option>
                  <option value="Reports">Reports (अहवाल)</option>
                  <option value="Notices">Notices (सूचना)</option>
                  <option value="Gram Sabha Documents">Gram Sabha Documents</option>
                </select>
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
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
