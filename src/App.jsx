import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import EmployeeDashboard from './components/EmployeeDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import { api } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'employee-portal', 'manager-portal'
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Check saved session or URL parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const modalParam = params.get('modal');

    if (modalParam === 'login') {
      setIsLoginOpen(true);
    }

    if (viewParam === 'employee') {
      setUser({
        employeeId: 'DEMO1001',
        fullName: 'Jordan Miller',
        role: 'EMPLOYEE',
        department: 'Kitchen Operations',
        jobRole: 'Crew Member',
        restaurantLocation: '481 US Highway 1 S, Rockingham, NC'
      });
      setCurrentView('employee-portal');
      return;
    } else if (viewParam === 'manager') {
      setUser({
        employeeId: 'MGR001',
        fullName: 'Sarah Jenkins',
        role: 'STORE_MANAGER',
        department: 'Store Management',
        jobRole: 'General Manager',
        restaurantLocation: '481 US Highway 1 S, Rockingham, NC'
      });
      setCurrentView('manager-portal');
      return;
    }

    const savedUser = localStorage.getItem('hardees_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.role === 'STORE_MANAGER' || parsed.role === 'ADMIN') {
          setCurrentView('manager-portal');
        } else {
          setCurrentView('employee-portal');
        }
      } catch (e) {
        localStorage.removeItem('hardees_user');
      }
    }
  }, []);

  const handleLoginSuccess = (loginData) => {
    setUser(loginData);
    if (loginData.role === 'STORE_MANAGER' || loginData.role === 'ADMIN') {
      setCurrentView('manager-portal');
    } else {
      setCurrentView('employee-portal');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setCurrentView('landing');
  };

  const handleGoToDashboard = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    if (user.role === 'STORE_MANAGER' || user.role === 'ADMIN') {
      setCurrentView('manager-portal');
    } else {
      setCurrentView('employee-portal');
    }
  };

  return (
    <div className="hardees-app-root">
      {/* If current view is public landing page, show Header & Landing */}
      {currentView === 'landing' && (
        <>
          <Navbar
            user={user}
            onOpenLogin={() => setIsLoginOpen(true)}
            onGoToDashboard={handleGoToDashboard}
            onLogout={handleLogout}
          />
          <LandingPage onOpenLogin={() => setIsLoginOpen(true)} />
        </>
      )}

      {/* If current view is employee portal */}
      {currentView === 'employee-portal' && (
        <EmployeeDashboard
          user={user}
          onLogout={handleLogout}
          onGoToLanding={() => setCurrentView('landing')}
        />
      )}

      {/* If current view is manager portal */}
      {currentView === 'manager-portal' && (
        <ManagerDashboard
          user={user}
          onLogout={handleLogout}
          onGoToLanding={() => setCurrentView('landing')}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
