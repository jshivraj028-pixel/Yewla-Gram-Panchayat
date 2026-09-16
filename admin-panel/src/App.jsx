import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Requests from './pages/Requests';
import Notices from './pages/Notices';
import Schemes from './pages/Schemes';
import Events from './pages/Events';
import Projects from './pages/Projects';
import Documents from './pages/Documents';
import Gallery from './pages/Gallery';
import Emergency from './pages/Emergency';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AdminLayout />;
}

function AdminOnlyRoute({ children }) {
  const { user } = useAuth();
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/events" element={<Events />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route
              path="/users"
              element={
                <AdminOnlyRoute>
                  <Users />
                </AdminOnlyRoute>
              }
            />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
