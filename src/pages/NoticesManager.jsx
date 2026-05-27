import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { convertBanglishToBengali } from '../utils/banglish';
import { Send, Globe, Plus, Trash } from 'lucide-react';

const NoticesManager = () => {
  const [notices, setNotices] = useState([]);
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [banglishInput, setBanglishInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isSticky, setIsSticky] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = () => {
    axios.get(`${window.API_URL}/api/v1/notices`)
      .then(res => {
        if (res.data.success) {
          setNotices(res.data.data);
        }
      })
      .catch(err => console.log(err));
  };

  const handleBanglishChange = (e) => {
    const val = e.target.value;
    setBanglishInput(val);
    // Realtime convert and preview
    const converted = convertBanglishToBengali(val);
    setTitleBn(converted);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: { en: titleEn, bn: titleBn },
        content: { en: contentEn, bn: contentBn },
        priority,
        isSticky,
      };

      const token = localStorage.getItem('accessToken');
      const res = await axios.post(`${window.API_URL}/api/v1/notices`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setMessage('Notice published successfully');
        setTitleEn('');
        setTitleBn('');
        setBanglishInput('');
        setContentEn('');
        setContentBn('');
        setIsSticky(false);
        fetchNotices();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to publish notice');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.delete(`${window.API_URL}/api/v1/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchNotices();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create notice form */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Plus size={20} className="text-secondary" />
          <span>Publish New Notice</span>
        </h3>

        {message && (
          <div className="p-3 bg-slate-800 text-secondary text-sm font-semibold rounded-lg border border-slate-700">
            {message}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Smart Banglish Input */}
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="block text-xs font-bold text-secondary uppercase">⌨️ Smart Banglish Keyboard</span>
            <input
              type="text"
              placeholder="Type Banglish (e.g. barshik punormiloni onusthan)..."
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-secondary text-slate-100"
              value={banglishInput}
              onChange={handleBanglishChange}
            />
            <span className="block text-xxs text-gray-500">Auto-transliterates into Bengali title input below</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bengali Title</label>
            <input
              type="text"
              placeholder="বাংলা শিরোনাম"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-primary text-slate-100 font-bn"
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">English Title</label>
            <input
              type="text"
              placeholder="English Title"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-primary text-slate-100"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bengali Content</label>
            <textarea
              rows={3}
              placeholder="নোটিশের বিস্তারিত বিবরণ..."
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-primary text-slate-100 font-bn"
              value={contentBn}
              onChange={(e) => setContentBn(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">English Content</label>
            <textarea
              rows={3}
              placeholder="Detailed notice content in English..."
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-primary text-slate-100"
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Priority</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-primary text-slate-100"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="sticky"
                checked={isSticky}
                onChange={(e) => setIsSticky(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="sticky" className="text-xs font-bold text-slate-400 uppercase">Sticky/Featured</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary hover:bg-yellow-500 text-white font-bold py-2.5 rounded shadow-lg transition text-sm flex items-center justify-center space-x-2"
          >
            <Send size={16} />
            <span>Publish Notice</span>
          </button>
        </form>
      </div>

      {/* List notices */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Active Notice Board</h3>
        
        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
          {notices.map(notice => (
            <div key={notice._id} className="bg-slate-900 p-4 rounded border border-slate-850 flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.2 text-xxs font-bold rounded-full ${
                    notice.priority === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {notice.priority.toUpperCase()}
                  </span>
                  {notice.isSticky && <span className="bg-yellow-500/10 text-yellow-400 px-2 py-0.2 text-xxs font-bold rounded-full">Sticky</span>}
                </div>
                <h4 className="font-bold text-slate-200 font-bn">{notice.title.bn}</h4>
                <p className="text-xs text-gray-500 font-bn mt-1 line-clamp-1">{notice.content.bn}</p>
              </div>
              <button
                onClick={() => handleDelete(notice._id)}
                className="text-slate-500 hover:text-red-400 transition"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoticesManager;
