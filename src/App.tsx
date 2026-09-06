import React, { useState, useEffect } from 'react';
import { WardChartProvider, useWardChart } from './context/WardChartContext';
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
import { LoginPage } from './pages/LoginPage';
import { PatientAlarmsPage } from './pages/PatientAlarmsPage';
import { LabTechnicianPage } from './pages/LabTechnicianPage';
import { AdminManagementPage } from './pages/AdminManagementPage';

function AppContent() {
  const { currentUserRole } = useWardChart();

  // Initialize with Starting Login Page by default, unless valid hash is provided
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (
      hash &&
      [
        'ward-board',
        'patient-chart',
        'patient-booklet',
        'patient-alarms',
        'lab-technician',
        'admin-console',
        'submit-readings',
        'report',
        'history',
        'models',
        'settings',
        'login'
      ].includes(hash)
    ) {
      return hash;
    }
    return 'login';
  });

  // Handle browser back/forward or hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        if (hash === 'home') setCurrentPage('ward-board');
        else if (hash === 'input') setCurrentPage('submit-readings');
        else if (hash === 'chart') setCurrentPage('patient-chart');
        else if (hash === 'booklet') setCurrentPage('patient-booklet');
        else if (hash === 'alarms') setCurrentPage('patient-alarms');
        else if (hash === 'lab') setCurrentPage('lab-technician');
        else if (hash === 'admin') setCurrentPage('admin-console');
        else if (hash === 'login' || hash === 'signin') setCurrentPage('login');
        else if (hash === 'results') setCurrentPage('patient-chart');
        else if (hash === 'dashboard') setCurrentPage('history');
        else if ([
          'landing',
          'ward-board',
          'patient-chart',
          'patient-booklet',
          'patient-alarms',
          'lab-technician',
          'admin-console',
          'login',
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

  // Enforce strict Role-Based Route Guarding
  useEffect(() => {
    if (currentPage === 'login') return;

    if (currentUserRole === 'patient') {
      const allowedPatientPages = ['patient-booklet', 'patient-alarms', 'report', 'history', 'login'];
      if (!allowedPatientPages.includes(currentPage)) {
        setCurrentPage('patient-booklet');
        window.location.hash = 'patient-booklet';
      }
    } else if (currentUserRole === 'doctor') {
      const allowedDoctorPages = [
        'ward-board',
        'patient-chart',
        'submit-readings',
        'report',
        'history',
        'models',
        'settings',
        'login'
      ];
      if (!allowedDoctorPages.includes(currentPage)) {
        setCurrentPage('ward-board');
        window.location.hash = 'ward-board';
      }
    } else if (currentUserRole === 'labtech') {
      const allowedLabPages = ['lab-technician', 'ward-board', 'patient-chart', 'models', 'report', 'history', 'login'];
      if (!allowedLabPages.includes(currentPage)) {
        setCurrentPage('lab-technician');
        window.location.hash = 'lab-technician';
      }
    } else if (currentUserRole === 'admin') {
      const allowedAdminPages = [
        'admin-console',
        'ward-board',
        'patient-chart',
        'patient-alarms',
        'lab-technician',
        'report',
        'history',
        'models',
        'settings',
        'login'
      ];
      if (!allowedAdminPages.includes(currentPage)) {
        setCurrentPage('admin-console');
        window.location.hash = 'admin-console';
      }
    }
  }, [currentUserRole, currentPage]);

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
      case 'patient-alarms':
        return <PatientAlarmsPage onNavigate={handleNavigate} />;
      case 'lab-technician':
        return <LabTechnicianPage onNavigate={handleNavigate} />;
      case 'admin-console':
        return <AdminManagementPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
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
        return <LoginPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AppLayout activePage={currentPage} onNavigate={handleNavigate}>
      {renderActivePage()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <WardChartProvider>
      <AuthProvider>
        <HealthDataProvider>
          <AppContent />
        </HealthDataProvider>
      </AuthProvider>
    </WardChartProvider>
  );
}
