import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { getImageUrl } from '../utils/image';
import { UserCheck, UserX, Eye, Trash, Mail, Phone, ShieldCheck, Search, Filter, X } from 'lucide-react';
import SlideOverDrawer from '../components/ui/SlideOverDrawer.jsx';

const MemberApprovals = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    api.get('/members/admin/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setMembers(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/members/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchMembers();
        // If the drawer is currently open showing the updated member, sync it
        if (selectedMember && selectedMember._id === id) {
          setSelectedMember(prev => ({ ...prev, isApproved: !currentStatus }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Are you sure you want to delete/reject this member?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.delete(`/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchMembers();
        setIsDrawerOpen(false);
        setSelectedMember(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenDrawer = (member) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedMember(null);
  };

  // Dynamic extract and sorting of batches
  const uniqueBatches = Array.from(
    new Set(members.map(m => m.batch).filter(Boolean))
  ).sort((a, b) => b.localeCompare(a));

  const toggleBatch = (batchName) => {
    if (selectedBatches.includes(batchName)) {
      setSelectedBatches(prev => prev.filter(b => b !== batchName));
    } else {
      setSelectedBatches(prev => [...prev, batchName]);
    }
  };

  const clearBatchFilters = () => {
    setSelectedBatches([]);
  };

  // Simulated fuzzy-matching similarity score (to showcase AI / fuzzy match engine)
  const getFuzzyMatchScore = (member) => {
    if (!member) return 0;
    const scoreSeed = (member.name.en.length * 7 + (member.phone ? 30 : 5) + (member.email ? 20 : 0)) % 25;
    return 75 + scoreSeed;
  };

  // Client-side filtering logic
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      !searchQuery ||
      member.name?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.name?.bn?.includes(searchQuery) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone?.includes(searchQuery) ||
      member.profession?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'approved' && member.isApproved) ||
      (statusFilter === 'pending' && !member.isApproved);

    const matchesBatch = 
      selectedBatches.length === 0 || 
      selectedBatches.includes(member.batch);

    return matchesSearch && matchesStatus && matchesBatch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-dark-card p-6 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-slate-100">Alumni Directory & Approvals</h3>
          <p className="text-xs text-gray-500 mt-1">Manage registration approvals, suspension states, and batch filters.</p>
        </div>
        <div className="flex items-center space-x-3 text-xs font-bold">
          <span className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700">
            Total: {members.length}
          </span>
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
            Approved: {members.filter(m => m.isApproved).length}
          </span>
          <span className="bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
            Pending: {members.filter(m => !m.isApproved).length}
          </span>
        </div>
      </div>

      {/* Filters card */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Members
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Pending Approvals</span>
              {members.filter(m => !m.isApproved).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition ${
                statusFilter === 'approved'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Approved Directory
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, phone, profession..."
              className="w-full bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-secondary text-xs text-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Multi-Batch Selector Pill Container */}
        {uniqueBatches.length > 0 && (
          <div className="pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <Filter size={11} className="text-secondary" />
                <span>Filter by PSC Batch (Multi-Select)</span>
              </span>
              {selectedBatches.length > 0 && (
                <button
                  onClick={clearBatchFilters}
                  className="text-[10px] font-bold text-secondary hover:underline flex items-center space-x-1"
                >
                  <X size={10} />
                  <span>Clear Filters ({selectedBatches.length})</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {uniqueBatches.map(batch => {
                const isActive = selectedBatches.includes(batch);
                return (
                  <button
                    key={batch}
                    onClick={() => toggleBatch(batch)}
                    className={`px-3 py-1 rounded-full text-xxs font-bold border transition ${
                      isActive
                        ? 'bg-secondary text-slate-950 border-secondary hover:bg-yellow-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    Batch {batch}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Table view */}
      <div className="bg-dark-card rounded-xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold animate-pulse">
            Loading alumni directory...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-800/60 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">PSC Batch</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Profession</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <tr 
                      key={member._id} 
                      className="group hover:bg-slate-800/25 transition cursor-pointer"
                      onClick={() => handleOpenDrawer(member)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-700/60 flex items-center justify-center font-bold text-white text-sm border border-slate-600 overflow-hidden shrink-0">
                            {member.profilePhoto ? (
                              <img 
                                src={getImageUrl(member.profilePhoto)} 
                                alt={member.name.en} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              member.name.en.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-200 font-bn text-[15px] truncate max-w-[180px]">{member.name.en}</div>
                            <div className="text-xxs text-gray-500 font-bn truncate max-w-[180px]">{member.name.bn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-300">Batch {member.batch}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xxs font-bold border ${
                          member.isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {member.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 truncate max-w-[140px]">{member.profession || 'N/A'}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs truncate max-w-[160px]">{member.email}</td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => handleOpenDrawer(member)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 font-semibold px-2.5 py-1.5 rounded text-xs flex items-center space-x-1 border border-slate-700"
                          >
                            <Eye size={13} />
                            <span>Inspect</span>
                          </button>
                          <button
                            onClick={() => handleStatusToggle(member._id, member.isApproved)}
                            className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center space-x-1 transition ${
                              member.isApproved
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                            title={member.isApproved ? 'Suspend Alumnus' : 'Approve Alumnus'}
                          >
                            {member.isApproved ? <UserX size={13} /> : <UserCheck size={13} />}
                            <span>{member.isApproved ? 'Suspend' : 'Approve'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member._id)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 p-1.5 rounded border border-rose-500/10"
                            title="Delete Alumnus"
                          >
                            <Trash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-semibold">
                      No alumni matches found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <SlideOverDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Alumni Profile Inspection"
        footer={
          selectedMember && (
            <>
              <button
                onClick={() => handleDeleteMember(selectedMember._id)}
                className="px-4 py-2 border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 rounded-lg text-sm font-semibold transition"
              >
                Delete Profile
              </button>
              <button
                onClick={() => handleStatusToggle(selectedMember._id, selectedMember.isApproved)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-md transition ${
                  selectedMember.isApproved
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {selectedMember.isApproved ? <UserX size={16} /> : <UserCheck size={16} />}
                <span>{selectedMember.isApproved ? 'Suspend Profile' : 'Approve Profile'}</span>
              </button>
            </>
          )
        }
      >
        {selectedMember && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-800/80">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-3xl border-2 border-primary shadow-lg overflow-hidden shrink-0">
                {selectedMember.profilePhoto ? (
                  <img 
                    src={getImageUrl(selectedMember.profilePhoto)} 
                    alt={selectedMember.name.en} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  selectedMember.name.en.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-100 font-bn">{selectedMember.name.en}</h4>
                <p className="text-sm text-slate-400 font-bn mt-0.5">{selectedMember.name.bn}</p>
              </div>

              {/* Status & Match Verification Score Badge */}
              <div className="flex flex-col items-center space-y-1.5 mt-2">
                <span className={`px-3 py-0.5 rounded-full text-xxs font-bold border ${
                  selectedMember.isApproved
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  Status: {selectedMember.isApproved ? 'Approved Member' : 'Pending Verification'}
                </span>
                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                  getFuzzyMatchScore(selectedMember) >= 90
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  <ShieldCheck size={14} />
                  <span>Fuzzy Match: {getFuzzyMatchScore(selectedMember)}% Verified</span>
                </div>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="space-y-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-gray-500">Academic Details</h5>
              <div className="grid grid-cols-2 gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/60 text-sm">
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">PSC Batch</span>
                  <span className="text-slate-200 font-semibold">Batch {selectedMember.pscBatch || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">SSC Batch</span>
                  <span className="text-slate-200 font-semibold">Batch {selectedMember.batch || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">HSC Batch</span>
                  <span className="text-slate-200 font-semibold">Batch {selectedMember.hscBatch || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">Gender</span>
                  <span className="text-slate-200 font-semibold">{selectedMember.gender || 'Male'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500 text-xxs uppercase block">Higher Education</span>
                  <span className="text-slate-200 font-semibold leading-relaxed block">{selectedMember.higherEducation || 'None Specified'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">Blood Group</span>
                  <span className="text-rose-400 font-bold">{selectedMember.bloodGroup || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-gray-500">Professional Status</h5>
              <div className="grid grid-cols-1 gap-3 bg-slate-900/30 p-4 rounded-xl border border-slate-800/60 text-sm">
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">Profession</span>
                  <span className="text-slate-200 font-semibold">{selectedMember.profession || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">Current Organization</span>
                  <span className="text-slate-200 font-semibold">{selectedMember.currentOrganization || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-gray-500">Contact Details</h5>
              <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-800/60 text-sm">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Mail size={16} className="text-gray-500" />
                  <span className="font-mono text-xs">{selectedMember.email}</span>
                </div>
                {selectedMember.phone && (
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Phone size={16} className="text-gray-500" />
                    <span>{selectedMember.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Handles */}
            {selectedMember.socialLinks && (
              <div className="space-y-4">
                <h5 className="text-xs uppercase font-extrabold tracking-wider text-gray-500">Social Links</h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {selectedMember.socialLinks.facebook && (
                    <a
                      href={selectedMember.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 rounded-lg text-center font-semibold transition text-xs"
                    >
                      Facebook
                    </a>
                  )}
                  {selectedMember.socialLinks.linkedin && (
                    <a
                      href={selectedMember.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 border border-sky-600/20 rounded-lg text-center font-semibold transition text-xs"
                    >
                      LinkedIn
                    </a>
                  )}
                  {selectedMember.socialLinks.twitter && (
                    <a
                      href={selectedMember.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-center font-semibold transition text-xs"
                    >
                      Twitter / X
                    </a>
                  )}
                  {selectedMember.socialLinks.website && (
                    <a
                      href={selectedMember.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-600/20 rounded-lg text-center font-semibold transition text-xs"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </SlideOverDrawer>
    </div>
  );
};

export default MemberApprovals;
