import React from 'react';

const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-300',
  'Under Review': 'bg-blue-100 text-blue-800 border-blue-300',
  Assigned: 'bg-purple-100 text-purple-800 border-purple-300',
  'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  Processing: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Rejected: 'bg-rose-100 text-rose-800 border-rose-300',
  Cancelled: 'bg-slate-100 text-slate-700 border-slate-300',
  Scheduled: 'bg-sky-100 text-sky-800 border-sky-300',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-300';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap shrink-0 ${style}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-80 shrink-0" />
      {status}
    </span>
  );
}
