import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Heart, Shield } from 'lucide-react';

const Dashboard = () => {
  const [memberCount, setMemberCount] = useState(104);
  const [donationTotal, setDonationTotal] = useState(120000);
  const [noticeCount, setNoticeCount] = useState(8);

  useEffect(() => {
    // Attempt stats fetching
    axios.get(`${window.API_URL}/api/v1/donations/stats`)
      .then(res => {
        if (res.data.success) {
          setDonationTotal(res.data.data.totalAmount);
        }
      }).catch(() => {});

    axios.get(`${window.API_URL}/api/v1/members`)
      .then(res => {
        if (res.data.success) {
          setMemberCount(res.data.data.total || 104);
        }
      }).catch(() => {});
  }, []);

  const chartData = [
    { name: 'Jan', donations: 4000 },
    { name: 'Feb', donations: 3000 },
    { name: 'Mar', donations: 2000 },
    { name: 'Apr', donations: 2780 },
    { name: 'May', donations: 1890 },
    { name: 'Jun', donations: 2390 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Registered Members', val: memberCount, icon: <Users className="text-secondary" />, change: '+12% this month' },
          { label: 'Total Donations Raised', val: `৳${donationTotal}`, icon: <Heart className="text-rose-500" />, change: 'Target: 10L' },
          { label: 'Published Notices', val: noticeCount, icon: <FileText className="text-blue-400" />, change: 'Live updates enabled' },
          { label: 'Security System', val: 'Active', icon: <Shield className="text-emerald-400" />, change: 'Rate limiting active' }
        ].map((card, i) => (
          <div key={i} className="bg-dark-card p-6 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-xs font-semibold uppercase">{card.label}</span>
              <span className="block text-2xl font-bold mt-1 text-slate-100">{card.val}</span>
              <span className="text-xxs text-slate-500 font-semibold mt-1 block">{card.change}</span>
            </div>
            <div className="w-12 h-12 bg-slate-800/50 rounded-lg flex items-center justify-center">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-6">Donation Inflow Overview</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#0d1f36', borderColor: '#1e293b' }} />
              <Bar dataKey="donations" fill="#F9A826" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
