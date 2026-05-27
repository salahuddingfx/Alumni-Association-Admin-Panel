import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { UserCheck, Trash } from 'lucide-react';

const MemberApprovals = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    const token = localStorage.getItem('accessToken');
    api.get('/members/admin/pending', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setPending(res.data.data);
        }
      })
      .catch(err => console.log(err));
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/members/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchPending();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-100">Pending Alumni Verifications</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Batch</th>
              <th className="px-6 py-3">Profession</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.length > 0 ? (
              pending.map(member => (
                <tr key={member._id} className="border-b border-slate-800 hover:bg-slate-850">
                  <td className="px-6 py-4 font-bold text-slate-200 font-bn">{member.name.en}</td>
                  <td className="px-6 py-4">{member.batch}</td>
                  <td className="px-6 py-4">{member.profession}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleApprove(member._id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1 ml-auto"
                    >
                      <UserCheck size={14} />
                      <span>Approve</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-semibold">
                  No pending profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberApprovals;
