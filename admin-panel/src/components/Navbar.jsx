import React from 'react';
import { Menu, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const avatarUrl = getImageUrl(user?.avatar);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 shrink-0"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 flex items-center gap-1.5 truncate">
            <span className="truncate">येवला ग्रामपंचायत प्रशासन कक्ष</span>
            <span className="text-xs font-normal text-slate-500 hidden md:inline shrink-0">
              (Admin Portal)
            </span>
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Role: {user?.role?.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-[11px] text-slate-500">{user?.mobile}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-sm shrink-0 overflow-hidden shadow-xs">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.name || 'User'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'A'
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
