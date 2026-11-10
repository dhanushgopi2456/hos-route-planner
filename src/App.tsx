import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutRulesPage } from './pages/AboutRulesPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-[#0f0f10] text-[#ededed] flex flex-col font-sans relative selection:bg-blue-600 selection:text-white">
              {/* Sticky Navbar */}
              <Navbar />

              {/* Main Routing Container */}
              <main className="flex-1 relative z-10">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/planner" element={<DashboardPage />} />
                  <Route path="/about" element={<AboutRulesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
