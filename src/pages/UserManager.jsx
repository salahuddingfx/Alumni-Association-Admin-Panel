import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { UserCheck, UserX, Trash, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem('accessToken');
    api.get('/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setUsers(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching users:', err));
  };

  const handleApproveToggle = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/users/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchUsers();
        setMessage('User approval status updated successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchUsers();
        setMessage(`User role updated to ${newRole}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchUsers();
        setMessage('User deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100">User Management</h3>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20">
          {message}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-3">Username / Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">System Role</th>
              <th className="px-6 py-3">Approved</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id} className="border-b border-slate-800 hover:bg-slate-850">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-200">{user.username || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-dark-bg border border-slate-700 text-xs font-semibold text-slate-300 px-2 py-1 rounded focus:outline-none focus:border-secondary"
                    >
                      <option value="user">User</option>
                      <option value="member">Member</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApproveToggle(user._id)}
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                        user.isApproved 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {user.isApproved ? 'Approved' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleApproveToggle(user._id)}
                        className={`p-1.5 rounded transition ${
                          user.isApproved 
                            ? 'text-yellow-500 hover:bg-yellow-500/10' 
                            : 'text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                        title={user.isApproved ? 'Suspend User' : 'Approve User'}
                      >
                        {user.isApproved ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded transition"
                        title="Delete User"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-semibold">
                  No users registered in system yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
