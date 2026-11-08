import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ThemeProvider } from '../context/ThemeContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors duration-300 font-sans relative selection:bg-brand-500/20 selection:text-brand-600 dark:selection:text-brand-300">
        {/* Ambient Top Glow in Dark Mode */}
        <div className="fixed top-0 left-64 right-0 h-96 bg-gradient-to-b from-brand-600/5 via-indigo-600/[0.02] to-transparent pointer-events-none z-0" />
        
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0 transition-all z-10">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
