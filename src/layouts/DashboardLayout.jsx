import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Image, Users, Heart, Settings, LogOut, Shield, CreditCard, BookOpen, History, Camera, Search } from 'lucide-react';
import CommandPalette from '../components/ui/CommandPalette.jsx';

const DashboardLayout = ({ children }) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

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
    { path: '/registration-photos', label: 'Registration Photos', icon: <Camera size={18} /> },
    { path: '/checkin', label: 'Gate Check-In', icon: <Camera size={18} /> },
    { path: '/donations', label: 'Donations', icon: <Heart size={18} /> },
    { path: '/settings', label: 'CMS Settings', icon: <Settings size={18} /> },
    { path: '/about-settings', label: 'About Page CMS', icon: <History size={18} /> },
  ];

  // Listen for Ctrl+K / Cmd+K key bindings globally in admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      {/* Command Palette Overlay */}
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

      {/* Sidebar */}
      <aside className="w-64 bg-dark-card border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center px-4 border-b border-slate-800 space-x-2.5">
            <img 
              src="/alumni_logo.png" 
              className="w-10 h-10 rounded-full border border-secondary/60 shadow-md shrink-0 object-cover" 
              alt="Logo" 
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-100 font-bn tracking-wide whitespace-nowrap truncate">
                প্রাক্তন শিক্ষার্থী পরিষদ
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                Admin Panel
              </span>
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
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-slate-100 mr-4">Control Panel</h2>
            {/* Quick Command Trigger search */}
            <button 
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 transition text-gray-400 text-xs font-semibold"
            >
              <Search size={14} />
              <span>Search actions...</span>
              <kbd className="bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-[9px] font-mono ml-2">Ctrl+K</kbd>
            </button>
          </div>
          <div className="flex items-center space-x-3 bg-slate-800/40 pl-3 pr-4 py-1.5 rounded-full border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-slate-800 flex items-center justify-center text-xs font-bold text-slate-100 uppercase border border-slate-700 shadow-md shrink-0">
              {initial}
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{displayName}</span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">{roleName}</span>
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
