import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Image, Users, Heart, Settings, LogOut, Shield, CreditCard, BookOpen, History } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/notices', label: 'Notices', icon: <FileText size={18} /> },
    { path: '/blogs', label: 'Blogs & News', icon: <BookOpen size={18} /> },
    { path: '/events', label: 'Events', icon: <Calendar size={18} /> },
    { path: '/gallery', label: 'Gallery', icon: <Image size={18} /> },
    { path: '/members', label: 'Member Approvals', icon: <Users size={18} /> },
    { path: '/committee', label: 'Committee', icon: <Users size={18} /> },
    { path: '/users', label: 'User Management', icon: <Shield size={18} /> },
    { path: '/payments', label: 'Event Payments', icon: <CreditCard size={18} /> },
    { path: '/donations', label: 'Donations', icon: <Heart size={18} /> },
    { path: '/settings', label: 'CMS Settings', icon: <Settings size={18} /> },
    { path: '/about-settings', label: 'About Page CMS', icon: <History size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const userString = localStorage.getItem('user');
  let user = null;
  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (e) {
    console.error(e);
  }

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'A');
  const roleName = user?.role ? user.role.toUpperCase() : 'ADMINISTRATOR';
  const displayName = user?.username || user?.email || 'Admin User';

  return (
    <div className="min-h-screen flex bg-dark-bg text-slate-100 font-english">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800 space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg border border-secondary shadow-md">
              প
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-100 font-bn tracking-wide">প্রাক্তন পরিষদ</span>
              <span className="text-xxs text-gray-500 font-medium uppercase tracking-wider">Admin Panel</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                    isActive
                      ? 'bg-primary text-white shadow-lg border-l-4 border-secondary'
                      : 'text-gray-400 hover:bg-slate-800/40 hover:text-slate-100'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 border-b border-slate-800 px-8 flex items-center justify-between bg-dark-card">
          <h2 className="text-xl font-bold text-slate-100">Control Panel</h2>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase border border-slate-600">
              {initial}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-200">{displayName}</span>
              <span className="text-[10px] text-gray-500 font-extrabold tracking-widest">{roleName}</span>
            </div>
          </div>
        </header>

        <main className="flex-grow p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
