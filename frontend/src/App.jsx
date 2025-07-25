import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import MobileNav from './components/MobileNav';
import DebitsPage from './pages/DebitsPage';
import IncomesPage from './pages/IncomesPage';
import SavingsPage from './pages/SavingsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function AppContent() {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto');
  const { isAuth, logout, loading } = useAuth();

  useEffect(() => {
    const appliedTheme = theme === 'auto' ? getSystemTheme() : theme;
    document.documentElement.setAttribute('data-theme', appliedTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme === 'auto') {
      const handler = (e) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handler);
      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handler);
    }
  }, [theme]);

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  if (loading) return <div>Loading...</div>;
  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>{t('welcome')}</h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label>{t('theme')}</label>
            <select value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="auto">{t('auto')}</option>
              <option value="light">{t('light')}</option>
              <option value="dark">{t('dark')}</option>
            </select>
            <label>{t('language')}</label>
            <select value={i18n.language} onChange={e => changeLanguage(e.target.value)}>
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
            {isAuth && <button onClick={logout}>{t('logout')}</button>}
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={isAuth ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/register" element={isAuth ? <Navigate to="/dashboard" /> : <RegisterPage />} />
            <Route path="/dashboard" element={isAuth ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/debits" element={isAuth ? <DebitsPage /> : <Navigate to="/login" />} />
            <Route path="/incomes" element={isAuth ? <IncomesPage /> : <Navigate to="/login" />} />
            <Route path="/savings" element={isAuth ? <SavingsPage /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuth ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </Router>
  );
}

export default function App() {
  return <AuthProvider><AppContent /></AuthProvider>;
}
