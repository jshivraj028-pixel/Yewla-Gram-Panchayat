import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'emerald',
  subtitle,
  to,
}) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-200 group-hover:bg-slate-100',
  };

  const content = (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          {to && (
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors opacity-70 group-hover:opacity-100" />
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value ?? 0}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl border transition-colors ${colorMap[color] || colorMap.emerald}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );

  const cardClasses =
    'bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all duration-200 group block';

  if (to) {
    return (
      <Link to={to} className={`${cardClasses} cursor-pointer active:scale-[0.99]`}>
        {content}
      </Link>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}

