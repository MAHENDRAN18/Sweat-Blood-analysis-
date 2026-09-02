import React, { useState, useEffect } from 'react';
import { WardChartProvider } from './context/WardChartContext';
import { AuthProvider } from './context/AuthContext';
import { HealthDataProvider } from './context/HealthDataContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPortalPage } from './pages/LandingPortalPage';
import { WardBoardPage } from './pages/WardBoardPage';
import { PatientChartPage } from './pages/PatientChartPage';
import { PatientBookletPage } from './pages/PatientBookletPage';
import { SubmitReadingsPage } from './pages/SubmitReadingsPage';
import { HealthReportPage } from './pages/HealthReportPage';
import { DashboardHistoryPage } from './pages/DashboardHistoryPage';
import { ModelTrainingPage } from './pages/ModelTrainingPage';
import { SettingsProfilePage } from './pages/SettingsProfilePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');

  // Handle browser back/forward or hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash === 'home') setCurrentPage('landing');
        else if (hash === 'input') setCurrentPage('submit-readings');
        else if (hash === 'chart') setCurrentPage('patient-chart');
        else if (hash === 'booklet') setCurrentPage('patient-booklet');
        else if (hash === 'results') setCurrentPage('patient-chart');
        else if (hash === 'dashboard') setCurrentPage('history');
        else if ([
          'landing',
          'ward-board',
          'patient-chart',
          'patient-booklet',
          'submit-readings',
          'report',
          'history',
          'models',
          'settings'
        ].includes(hash)) {
          setCurrentPage(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPortalPage onNavigate={handleNavigate} />;
      case 'ward-board':
        return <WardBoardPage onNavigate={handleNavigate} />;
      case 'patient-chart':
        return <PatientChartPage onNavigate={handleNavigate} />;
      case 'patient-booklet':
        return <PatientBookletPage onNavigate={handleNavigate} />;
      case 'submit-readings':
        return <SubmitReadingsPage onNavigate={handleNavigate} />;
      case 'report':
        return <HealthReportPage onNavigate={handleNavigate} />;
      case 'history':
        return <DashboardHistoryPage onNavigate={handleNavigate} />;
      case 'models':
        return <ModelTrainingPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsProfilePage onNavigate={handleNavigate} />;
      default:
        return <LandingPortalPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <WardChartProvider>
      <AuthProvider>
        <HealthDataProvider>
          <AppLayout activePage={currentPage} onNavigate={handleNavigate}>
            {renderActivePage()}
          </AppLayout>
        </HealthDataProvider>
      </AuthProvider>
    </WardChartProvider>
  );
}
