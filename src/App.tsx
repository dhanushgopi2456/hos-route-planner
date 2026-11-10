import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutRulesPage } from './pages/AboutRulesPage';
import { CustomCursor } from './components/UI/CustomCursor';
import { AnimatedBackground } from './components/UI/AnimatedBackground';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            {/* Custom cursor with smooth magnetic tracking */}
            <CustomCursor />

            <div className="min-h-screen bg-[#06080E] text-slate-100 flex flex-col font-sans relative selection:bg-blue-600 selection:text-white">
              {/* Dynamic atmospheric background */}
              <AnimatedBackground />

              {/* Sticky Glassmorphic Navbar */}
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
