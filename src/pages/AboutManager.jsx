import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Save, Plus, Trash, History, MessageSquare, AlertCircle } from 'lucide-react';

const AboutManager = () => {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'advisors'
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Add timeline state
  const [newYear, setNewYear] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newDescBn, setNewDescBn] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const timelineRes = await api.get(`/settings/timeline_events`);
      if (timelineRes.data.success && timelineRes.data.data && Array.isArray(timelineRes.data.data.events)) {
        setTimelineEvents(timelineRes.data.data.events);
      }

      const advisorRes = await api.get(`/settings/advisor_messages`);
      if (advisorRes.data.success && advisorRes.data.data && Array.isArray(advisorRes.data.data.advisors)) {
        setAdvisors(advisorRes.data.data.advisors);
      } else {
        setAdvisors([
          {
            titleEn: 'Message from Chief Advisor',
            titleBn: 'প্রধান উপদেষ্টার বাণী',
            messageEn: '',
            messageBn: '',
            nameEn: '',
            nameBn: '',
            roleEn: 'Chief Advisor',
            roleBn: 'প্রধান উপদেষ্টা'
          },
          {
            titleEn: 'Message from General Secretary',
            titleBn: 'সাধারণ সম্পাদকের বার্তা',
            messageEn: '',
            messageBn: '',
            nameEn: '',
            nameBn: '',
            roleEn: 'General Secretary',
            roleBn: 'সাধারণ সম্পাদক'
          }
        ]);
      }
    } catch (err) {
      console.log('Error fetching settings:', err);
    }
  };

  const handleAddTimelineEvent = async (e) => {
    e.preventDefault();
    const newEvent = {
      year: newYear,
      titleEn: newTitleEn,
      titleBn: newTitleBn,
      descEn: newDescEn,
      descBn: newDescBn
    };

    const updatedEvents = [...timelineEvents, newEvent];

    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/settings/timeline_events`, {
        value: { events: updatedEvents }
      }, {
        headers: { idx) => idx !== indexToDelete);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/settings/timeline_events`, {
        value: { events: updatedEvents }
      }, {
        headers: { field, val) => {
    const updated = [...advisors];
    updated[idx] = { ...updated[idx], [field]: val };
    setAdvisors(updated);
  };

  const handleSaveAdvisors = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/settings/advisor_messages`, {
        value: { advisors }
      }, {
        headers: { 3500);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 font-bn">সম্পর্কে তথ্য পরিবর্তন (About Page CMS)</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Manage History Timeline & Advisor Messages</p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-lg border border-emerald-500/20 sticky top-4 z-50 backdrop-blur-md">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-500/10 text-red-400 text-sm font-semibold rounded-lg border border-red-500/20 sticky top-4 z-50 backdrop-blur-md flex items-center space-x-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition tracking-wider flex items-center space-x-1.5 ${
            activeTab === 'timeline' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/40'
          }`}
        >
          <History size={14} />
          <span>History Timeline</span>
        </button>
        <button
          onClick={() => setActiveTab('advisors')}
          className={`px-4 py-2 rounded-lg font-bold text-xs uppercase transition tracking-wider flex items-center space-x-1.5 ${
            activeTab === 'advisors' ? 'bg-secondary text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/40'
          }`}
        >
          <MessageSquare size={14} />
          <span>Advisor Messages</span>
        </button>
      </div>

      {/* TAB 1: HISTORICAL TIMELINE CMS */}
      {activeTab === 'timeline' && (
        <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <History size={18} className="text-secondary" />
            <span>Manage Timeline (About Page)</span>
          </h3>

          <form onSubmit={handleAddTimelineEvent} className="space-y-3 text-xs bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <span className="block font-bold text-slate-300 uppercase mb-2">Add New Milestone</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Year / Period</label>
                <input type="text" placeholder="e.g. 2025 (Jan)" className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100" value={newYear} onChange={(e) => setNewYear(e.target.value)} required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Title (English)</label>
                <input type="text" placeholder="Foundation & Setup" className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100" value={newTitleEn} onChange={(e) => setNewTitleEn(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Title (Bengali)</label>
              <input type="text" placeholder="সংগঠনের শুভ সূচনা" className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100 font-bn" value={newTitleBn} onChange={(e) => setNewTitleBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Description (English)</label>
              <textarea placeholder="Details..." rows={2} className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100" value={newDescEn} onChange={(e) => setNewDescEn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Description (Bengali)</label>
              <textarea placeholder="বিস্তারিত..." rows={2} className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100 font-bn" value={newDescBn} onChange={(e) => setNewDescBn(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded transition flex items-center justify-center space-x-1">
              <Plus size={14} />
              <span>Add Event</span>
            </button>
          </form>

          {/* Timeline events list */}
          <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2">
            <span className="block text-xs font-bold text-slate-400 uppercase">Existing Milestones ({timelineEvents.length})</span>
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-800 flex justify-between items-start text-xs">
                <div>
                  <span className="text-secondary font-bold mr-2">{event.year}</span>
                  <span className="font-bold text-slate-200">{event.titleEn}</span>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{event.descEn}</p>
                </div>
                <button type="button" onClick={() => handleDeleteTimelineEvent(idx)} className="text-slate-500 hover:text-red-400 p-1">
                  <Trash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ADVISOR MESSAGES CMS */}
      {activeTab === 'advisors' && (
        <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <MessageSquare size={18} className="text-secondary" />
            <span>Advisor Messages</span>
          </h3>

          <form onSubmit={handleSaveAdvisors} className="space-y-6 text-xs">
            {advisors.map((adv, idx) => (
              <div key={idx} className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 space-y-3">
                <span className="block font-bold text-secondary uppercase">{adv.roleEn || `Advisor #${idx + 1}`} Message Block</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Title Box (Bengali)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100 font-bn" value={adv.titleBn || ''} onChange={e => handleAdvisorChange(idx, 'titleBn', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Title Box (English)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100" value={adv.titleEn || ''} onChange={e => handleAdvisorChange(idx, 'titleEn', e.target.value)} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Advisor Name (Bengali)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100 font-bn" value={adv.nameBn || ''} onChange={e => handleAdvisorChange(idx, 'nameBn', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Advisor Name (English)</label>
                    <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100" value={adv.nameEn || ''} onChange={e => handleAdvisorChange(idx, 'nameEn', e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Message Body (Bengali)</label>
                  <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100 font-bn" value={adv.messageBn || ''} onChange={e => handleAdvisorChange(idx, 'messageBn', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Message Body (English)</label>
                  <textarea rows={3} className="w-full bg-slate-800 border border-slate-700 px-2 py-1.5 rounded text-slate-100" value={adv.messageEn || ''} onChange={e => handleAdvisorChange(idx, 'messageEn', e.target.value)} required />
                </div>
              </div>
            ))}

            <button type="submit" className="w-full bg-secondary hover:bg-yellow-500 text-white font-bold py-2.5 rounded shadow transition flex items-center justify-center space-x-1.5">
              <Save size={16} />
              <span>Save Advisor Messages</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AboutManager;
