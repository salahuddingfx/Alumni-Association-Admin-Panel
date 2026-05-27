import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, LogIn, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/auth/login', {
        identifier,
        password,
      });

      if (res.data.success) {
        const user = res.data.data.user;
        if (user.role === 'admin' || user.role === 'superadmin' || user.role === 'moderator') {
          localStorage.setItem('accessToken', res.data.data.accessToken);
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/');
        } else {
          setError('Access denied: You are not authorized to view the admin panel.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 text-slate-100 font-english">
      <div className="max-w-md w-full bg-dark-card p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 border border-secondary">
            প
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 font-bn">অ্যাডমিন প্যানেল লগইন</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Practon Alumni Association Portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email, Username, or Phone</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Email, username, or phone number"
                className="w-full bg-slate-850 border border-slate-700 pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-secondary text-sm text-slate-200"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-slate-500" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-slate-850 border border-slate-700 pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:border-secondary text-sm text-slate-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary hover:bg-yellow-500 text-white font-bold py-3 rounded-lg shadow-md transition flex items-center justify-center space-x-2 text-sm"
          >
            <LogIn size={16} />
            <span>Access Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
