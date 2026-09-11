import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
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
            {/* Attractive custom cursor */}
            <CustomCursor />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans relative transition-colors duration-300">
              {/* Attractive dynamic animated background */}
              <AnimatedBackground />

              <Navbar />

              <main className="flex-1 relative z-10">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
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

