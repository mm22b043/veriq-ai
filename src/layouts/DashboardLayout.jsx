import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GalaxyBackground from '../components/GalaxyBackground';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row font-sans relative overflow-x-hidden selection:bg-brand-500/25">

      {/* ── Cinematic Galaxy Canvas Background ── */}
      <GalaxyBackground />

      {/* Light mode overlay — softens galaxy for readability */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-white/88 dark:bg-transparent transition-colors duration-500" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0 relative z-10">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
