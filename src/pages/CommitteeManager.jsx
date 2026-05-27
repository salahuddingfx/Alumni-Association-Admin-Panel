import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash, Users, Upload } from 'lucide-react';

const CommitteeManager = () => {
  const [members, setMembers] = useState([]);
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [roleEn, setRoleEn] = useState('');
  const [roleBn, setRoleBn] = useState('');
  const [type, setType] = useState('executive'); // president, secretary, executive, advisor
  const [fbLink, setFbLink] = useState('#');
  const [liLink, setLiLink] = useState('#');
  const [emailLink, setEmailLink] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    axios.get('http://localhost:5000/api/v1/committees')
      .then(res => {
        if (res.data.success) {
          setMembers(res.data.data);
        }
      })
      .catch(err => console.log(err));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      
      const formData = new FormData();
      formData.append('name', JSON.stringify({ en: nameEn, bn: nameBn }));
      formData.append('role', JSON.stringify({ en: roleEn, bn: roleBn }));
      formData.append('type', type);
      formData.append('socialLinks', JSON.stringify({ facebook: fbLink, linkedin: liLink, email: emailLink }));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await axios.post('http://localhost:5000/api/v1/committees', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setNameEn('');
        setNameBn('');
        setRoleEn('');
        setRoleBn('');
        setFbLink('#');
        setLiLink('#');
        setEmailLink('');
        setImageFile(null);
        fetchMembers();
        setMessage('Committee member added successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Failed to create member');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member from the committee?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/v1/committees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMembers();
      setMessage('Member deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Create form - 5 Cols */}
      <div className="lg:col-span-5 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Plus size={20} className="text-secondary" />
          <span>Add Committee Member</span>
        </h3>

        {message && (
          <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20">
            {message}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Name (Bengali)</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={nameBn} onChange={(e) => setNameBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Name (English)</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={nameEn} onChange={(e) => setNameEn(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Role (Bengali)</label>
              <input type="text" placeholder="উদা: সভাপতি" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={roleBn} onChange={(e) => setRoleBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Role (English)</label>
              <input type="text" placeholder="e.g. President" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={roleEn} onChange={(e) => setRoleEn(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Type</label>
              <select className="w-full bg-slate-800 border border-slate-700 px-3 py-2.5 rounded text-slate-300" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="president">President (সভাপতি)</option>
                <option value="secretary">Secretary (সম্পাদক)</option>
                <option value="executive">Executive (কার্যনির্বাহী)</option>
                <option value="advisor">Advisor (উপদেষ্টা)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Email</label>
              <input type="email" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={emailLink} onChange={(e) => setEmailLink(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Facebook Link</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={fbLink} onChange={(e) => setFbLink(e.target.value)} />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">LinkedIn Link</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={liLink} onChange={(e) => setLiLink(e.target.value)} />
            </div>
          </div>

          {/* Photo File Selector */}
          <div className="bg-slate-800/40 p-4 rounded-lg border border-dashed border-slate-700 text-center">
            <label className="cursor-pointer block">
              <Upload className="mx-auto text-secondary mb-2" size={20} />
              <span className="text-xs font-bold text-slate-300 block uppercase">Upload Member Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => setImageFile(e.target.files[0])}
                required
              />
            </label>
            {imageFile && <span className="text-xs text-gray-500 font-semibold mt-1 block">Selected: {imageFile.name}</span>}
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded shadow transition">
            Save Committee Member
          </button>
        </form>
      </div>

      {/* List - 7 Cols */}
      <div className="lg:col-span-7 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Users size={20} className="text-secondary" />
          <span>Active Committee Roster</span>
        </h3>
        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
          {members.length > 0 ? (
            members.map(member => (
              <div key={member._id} className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-750">
                    {member.image ? (
                      <img src={member.image.startsWith('http') ? member.image : `http://localhost:5000${member.image}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="font-extrabold text-sm text-slate-400 uppercase">{member.name.en[0]}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 font-bn text-sm leading-snug">{member.name.bn}</h4>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block mt-0.5">{member.role.bn} ({member.type})</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(member._id)} className="text-slate-500 hover:text-red-400 p-1.5 rounded transition">
                  <Trash size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 font-semibold text-sm">
              No committee members currently listed in database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommitteeManager;
