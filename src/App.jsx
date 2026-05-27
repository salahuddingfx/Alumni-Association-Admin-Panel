import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NoticesManager from './pages/NoticesManager.jsx';
import EventsManager from './pages/EventsManager.jsx';
import GalleryManager from './pages/GalleryManager.jsx';
import MemberApprovals from './pages/MemberApprovals.jsx';
import UserManager from './pages/UserManager.jsx';
import PaymentsManager from './pages/PaymentsManager.jsx';
import DonationsTracker from './pages/DonationsTracker.jsx';
import CmsSettings from './pages/CmsSettings.jsx';
import Login from './pages/Login.jsx';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [location, navigate]);

  // Render Login component without Dashboard Layout wrapper
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/notices" element={<NoticesManager />} />
        <Route path="/events" element={<EventsManager />} />
        <Route path="/gallery" element={<GalleryManager />} />
        <Route path="/members" element={<MemberApprovals />} />
        <Route path="/users" element={<UserManager />} />
        <Route path="/payments" element={<PaymentsManager />} />
        <Route path="/donations" element={<DonationsTracker />} />
        <Route path="/settings" element={<CmsSettings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default App;
