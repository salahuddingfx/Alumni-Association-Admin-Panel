import React from 'react';
import { Save } from 'lucide-react';

const WelcomeSettings = ({ welcomeText, setWelcomeText, handleSaveWelcome }) => {
  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
      <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
        <Save size={18} className="text-secondary" />
        <span>Homepage Welcome Title</span>
      </h3>
      <form onSubmit={handleSaveWelcome} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Welcome Text Title (Bengali)</label>
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 font-bn text-sm"
            value={welcomeText}
            onChange={(e) => setWelcomeText(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-secondary hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded shadow transition flex items-center space-x-1.5"
        >
          <Save size={14} />
          <span>Save Welcome Title</span>
        </button>
      </form>
    </div>
  );
};

export default WelcomeSettings;
