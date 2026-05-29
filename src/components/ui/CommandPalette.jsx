import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, LayoutDashboard, FileText, Calendar, Image, Users, 
  Heart, Settings, LogOut, Shield, CreditCard, BookOpen, History, Camera,
  CornerDownLeft, Loader
} from 'lucide-react';
import axios from 'axios';

const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Command items definitions
  const defaultCommands = [
    { id: 'dashboard', label: 'Go to Dashboard', path: '/', icon: <LayoutDashboard size={16} />, category: 'Navigation' },
    { id: 'notices', label: 'Go to Notices & Announcements', path: '/notices', icon: <FileText size={16} />, category: 'Navigation' },
    { id: 'blogs', label: 'Go to Blogs & News Manager', path: '/blogs', icon: <BookOpen size={16} />, category: 'Navigation' },
    { id: 'events', label: 'Go to Events Manager', path: '/events', icon: <Calendar size={16} />, category: 'Navigation' },
    { id: 'gallery', label: 'Go to Photo Gallery Manager', path: '/gallery', icon: <Image size={16} />, category: 'Navigation' },
    { id: 'members', label: 'Go to Member Approvals', path: '/members', icon: <Users size={16} />, category: 'Navigation' },
    { id: 'committee', label: 'Go to Committee Management', path: '/committee', icon: <Users size={16} />, category: 'Navigation' },
    { id: 'users', label: 'Go to User Roles Management', path: '/users', icon: <Shield size={16} />, category: 'Navigation' },
    { id: 'payments', label: 'Go to Event Payments', path: '/payments', icon: <CreditCard size={16} />, category: 'Navigation' },
    { id: 'photos', label: 'Go to Registration Photos', path: '/registration-photos', icon: <Camera size={16} />, category: 'Navigation' },
    { id: 'donations', label: 'Go to Donations Tracker', path: '/donations', icon: <Heart size={16} />, category: 'Navigation' },
    { id: 'settings', label: 'Go to CMS Settings', path: '/settings', icon: <Settings size={16} />, category: 'Navigation' },
    { id: 'about', label: 'Go to About Page CMS', path: '/about-settings', icon: <History size={16} />, category: 'Navigation' },
    
    // Quick Actions
    { id: 'new-notice', label: 'Create New Notice / Announcement', action: () => { navigate('/notices'); onClose(); }, icon: <FileText size={16} className="text-secondary" />, category: 'Quick Actions' },
    { id: 'new-event', label: 'Create New Event', action: () => { navigate('/events'); onClose(); }, icon: <Calendar size={16} className="text-secondary" />, category: 'Quick Actions' },
    { id: 'logout', label: 'Logout Admin Session', action: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }, icon: <LogOut size={16} className="text-rose-400" />, category: 'Quick Actions' }
  ];

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  // Dynamic members query for search inside palette
  useEffect(() => {
    if (!query || query.length < 2) {
      setMembers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:5000/api/members?search=${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          const list = res.data.data.map(m => ({
            id: `member-${m._id}`,
            label: `Member: ${m.name} (Batch: ${m.sscBatch || 'N/A'})`,
            path: `/members`,
            icon: <Users size={16} className="text-accent" />,
            category: 'Alumni Directory Match'
          }));
          setMembers(list);
        }
      } catch (err) {
        console.error('Palette user search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Combine commands and member search results
  const filteredCommands = [
    ...defaultCommands.filter(cmd => 
      cmd.label.toLowerCase().includes(query.toLowerCase()) || 
      cmd.category.toLowerCase().includes(query.toLowerCase())
    ),
    ...members
  ];

  // Handle arrow key selections
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          if (selected.path) {
            navigate(selected.path);
            onClose();
          } else if (selected.action) {
            selected.action();
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/70 backdrop-blur-sm">
      <div 
        ref={containerRef}
        className="w-full max-w-2xl bg-dark-card border border-slate-800 rounded-xl shadow-2xl overflow-hidden glass-panel-dark flex flex-col max-h-[500px]"
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anything... (e.g. Notices, approve, member name)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-slate-100 placeholder-gray-500 border-none outline-none focus:ring-0 text-base"
          />
          {loading && <Loader size={18} className="animate-spin text-secondary mr-2" />}
          <span className="text-[10px] text-gray-500 bg-slate-800 px-2 py-1 rounded font-mono border border-slate-700">ESC</span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              No matching commands or members found.
            </div>
          ) : (
            // Group by category
            Object.entries(
              filteredCommands.reduce((groups, item) => {
                const group = groups[item.category] || [];
                group.push(item);
                groups[item.category] = group;
                return groups;
              }, {})
            ).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <h4 className="text-[10px] uppercase tracking-wider text-gray-500 font-extrabold px-3 py-1 mt-2">
                  {category}
                </h4>
                {items.map((cmd) => {
                  const absoluteIndex = filteredCommands.indexOf(cmd);
                  const isSelected = absoluteIndex === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => {
                        if (cmd.path) {
                          navigate(cmd.path);
                          onClose();
                        } else if (cmd.action) {
                          cmd.action();
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition ${
                        isSelected 
                          ? 'bg-primary/80 text-white shadow' 
                          : 'text-gray-300 hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {cmd.icon}
                        </span>
                        <span className="text-sm font-semibold">{cmd.label}</span>
                      </div>
                      {isSelected && (
                        <div className="flex items-center text-xs opacity-80 text-slate-300">
                          <span className="text-[10px] mr-1">Select</span>
                          <CornerDownLeft size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-3 bg-slate-900/40 border-t border-slate-800/60 flex items-center justify-between text-xxs text-gray-500">
          <div className="flex space-x-4">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Practon Alumni Command Palette</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
