import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  AlertCircle,
  FileCheck,
  Megaphone,
  Gift,
  Calendar,
  Hammer,
  FolderOpen,
  Image,
  PhoneCall,
  Bell,
  FileBarChart,
  Settings,
  LogOut,
  Landmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user, isAdmin } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/complaints', label: 'Complaints', icon: AlertCircle, badge: 'Active' },
    { to: '/requests', label: 'Service Requests', icon: FileCheck },
    { to: '/notices', label: 'Notices', icon: Megaphone },
    { to: '/schemes', label: 'Govt Schemes', icon: Gift },
    { to: '/events', label: 'Gram Sabha & Events', icon: Calendar },
    { to: '/projects', label: 'Development Projects', icon: Hammer },
    { to: '/documents', label: 'Documents', icon: FolderOpen },
    { to: '/gallery', label: 'Village Gallery', icon: Image },
    { to: '/emergency', label: 'Emergency Directory', icon: PhoneCall },
    ...(isAdmin ? [{ to: '/users', label: 'User Management', icon: Users }] : []),
    { to: '/reports', label: 'Reports & Export', icon: FileBarChart },
    { to: '/settings', label: 'Panchayat Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center border-b border-slate-800 gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-tight">
              Yewla Gram Panchayat
            </h1>
            <p className="text-xs text-emerald-400 font-medium">Citizen Service Portal</p>
          </div>
        </div>

        {/* Officer Profile Badge */}
        <div className="px-5 py-3.5 bg-slate-800/60 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0 overflow-hidden">
            {getImageUrl(user?.avatar) ? (
              <img
                src={getImageUrl(user?.avatar)}
                alt={user?.name || 'Officer'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'A'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Officer'}</p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.designation || (user?.role === 'admin' ? 'Administrator' : 'Staff Officer')}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout / बाहेर पडा</span>
          </button>
        </div>
      </aside>
    </>
  );
}
