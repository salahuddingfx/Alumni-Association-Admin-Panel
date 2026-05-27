import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

const CmsSettings = () => {
  const [welcomeText, setWelcomeText] = useState('স্বাগতম প্রাক্তন পরিষদে');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/v1/settings/welcome_text')
      .then(res => {
        if (res.data.success && res.data.data) {
          setWelcomeText(res.data.data.welcomeText);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.put('http://localhost:5000/api/v1/settings/welcome_text', {
        value: { welcomeText }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSuccess('CMS updated successfully!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6 max-w-2xl">
      <h3 className="text-lg font-bold text-slate-100">Homepage CMS Settings</h3>

      {success && (
        <div className="p-3 bg-slate-800 text-secondary text-sm font-semibold rounded-lg border border-slate-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 text-sm">
        <div>
          <label className="block text-slate-400 mb-1">Homepage Welcome Title (Bengali)</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 font-bn"
            value={welcomeText}
            onChange={(e) => setWelcomeText(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-secondary hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded shadow transition flex items-center space-x-1.5"
        >
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};

export default CmsSettings;
