import React, { useEffect, useState } from 'react';
import {
  Users as UsersIcon,
  Search,
  Filter,
  Shield,
  UserCheck,
  UserX,
  Edit2,
  X,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({ role: 'citizen', designation: '' });
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchUsers(1);
  }, [roleFilter, wardFilter, statusFilter]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'All') params.role = roleFilter;
      if (wardFilter !== 'All') params.wardNumber = wardFilter;
      if (statusFilter !== 'All') params.isActive = statusFilter;

      const res = await api.get('/users', { params });
      if (res.data.success) {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleToggleStatus = async (user) => {
    if (user._id === currentUser?._id) {
      alert('You cannot deactivate your own administrative account.');
      return;
    }
    const action = user.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      await api.patch(`/users/${user._id}/status`);
      fetchUsers(pagination.page);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleOpenRoleModal = (u) => {
    setSelectedUser(u);
    setRoleForm({
      role: u.role || 'citizen',
      designation: u.designation || '',
    });
    setActionError('');
    setShowRoleModal(true);
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      await api.patch(`/users/${selectedUser._id}/role`, roleForm);
      setShowRoleModal(false);
      fetchUsers(pagination.page);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">नागरिक व कर्मचारी व्यवस्थापन</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            User Management & Role Assignment • Total Registered: {pagination.total}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, mobile, email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Roles</option>
            <option value="citizen">Citizen (नागरिक)</option>
            <option value="staff">Staff (कर्मचारी)</option>
            <option value="admin">Admin (प्रशासक)</option>
          </select>

          {/* Ward filter */}
          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Wards</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Ward {i + 1}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Status</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive / Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Mobile View (< 768px): Responsive Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No users matching the filters.
            </div>
          ) : (
            users.map((u) => (
              <div key={u._id} className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors">
                {/* User Profile & Role */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs">
                      {getImageUrl(u.avatar) ? (
                        <img
                          src={getImageUrl(u.avatar)}
                          alt={u.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        u.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{u.name}</p>
                      {u.marathiName && (
                        <p className="text-[11px] text-slate-400">{u.marathiName}</p>
                      )}
                      <p className="text-[11px] text-slate-500 mt-0.5">Ward #{u.wardNumber || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : u.role === 'staff'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {u.role?.toUpperCase()}
                    </span>
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px] border border-rose-200">
                        <UserX className="w-2.5 h-2.5" /> Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact info */}
                <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <p className="flex items-center gap-1.5 text-slate-800 font-mono text-[11px]">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <a href={`tel:${u.mobile}`} className="hover:text-emerald-700">
                      {u.mobile}
                    </a>
                  </p>
                  {u.email && (
                    <p className="flex items-center gap-1.5 text-slate-500 text-[11px] truncate max-w-[200px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {u.email}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <span className="text-[11px] text-slate-400">
                    Registered: {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenRoleModal(u)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Edit Role / Designation"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Role</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                        u.isActive
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={u.isActive ? 'Deactivate User' : 'Activate User'}
                    >
                      {u.isActive ? (
                        <>
                          <UserX className="w-3 h-3" />
                          <span>Block</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3 h-3" />
                          <span>Activate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop / Tablet View (>= 768px): Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 min-w-[800px]">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">User Profile</th>
                <th className="px-4 py-3 whitespace-nowrap">Contact</th>
                <th className="px-4 py-3 whitespace-nowrap">Role & Designation</th>
                <th className="px-4 py-3 whitespace-nowrap">Ward</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Registered On</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No users matching the filters.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border border-emerald-200 shadow-xs">
                          {getImageUrl(u.avatar) ? (
                            <img
                              src={getImageUrl(u.avatar)}
                              alt={u.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            u.name?.[0]?.toUpperCase() || 'U'
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                          {u.marathiName && (
                            <p className="text-[11px] text-slate-400">{u.marathiName}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <p className="flex items-center gap-1.5 text-slate-800 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {u.mobile}
                        </p>
                        {u.email && (
                          <p className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {u.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : u.role === 'staff'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {u.role?.toUpperCase()}
                        </span>
                        {u.designation && (
                          <p className="text-[11px] text-slate-500 font-medium">
                            {u.designation}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-700">Ward #{u.wardNumber || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px] border border-rose-200">
                          <UserX className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenRoleModal(u)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="Edit Role / Designation"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            u.isActive
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="text-center sm:text-left">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total citizens & staff)
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchUsers(pagination.page - 1)}
              className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchUsers(pagination.page + 1)}
              className="px-3 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Role & Designation Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 overflow-hidden border border-emerald-200 shadow-xs">
                  {getImageUrl(selectedUser.avatar) ? (
                    <img
                      src={getImageUrl(selectedUser.avatar)}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    selectedUser.name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Manage User Role</h3>
                  <p className="text-[11px] text-slate-500">{selectedUser.name} ({selectedUser.mobile})</p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRole} className="space-y-4 pt-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Access Role</label>
                <select
                  value={roleForm.role}
                  onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  <option value="citizen">Citizen (नागरिक) - Standard mobile app access</option>
                  <option value="staff">Staff (ग्रामपंचायत कर्मचारी) - Complaint assignment & updates</option>
                  <option value="admin">Administrator (ग्रामसेवक / सरपंच) - Full control</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Designation / पदनाम
                </label>
                <input
                  type="text"
                  value={roleForm.designation}
                  onChange={(e) => setRoleForm({ ...roleForm, designation: e.target.value })}
                  placeholder="e.g. Water Supply Engineer, Clerk, Gram Sevak"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
