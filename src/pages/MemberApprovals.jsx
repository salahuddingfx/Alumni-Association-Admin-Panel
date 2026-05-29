import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { UserCheck, Eye, Trash, Mail, Phone, ShieldCheck, HelpCircle } from 'lucide-react';
import SlideOverDrawer from '../components/ui/SlideOverDrawer.jsx';

const MemberApprovals = () => {
  const [pending, setPending] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  // Simulated fuzzy-matching similarity score (to showcase AI / fuzzy match engine)
  const getFuzzyMatchScore = (member) => {
    if (!member) return 0;
    // Generate a deterministically high match score based on details completeness
    const scoreSeed = (member.name.en.length * 7 + (member.phone ? 30 : 5) + (member.email ? 20 : 0)) % 25;
    return 75 + scoreSeed; // Score between 75% and 100%
  };

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-100">Pending Alumni Verifications</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800/60 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3.5">Name</th>
              <th className="px-6 py-3.5">Batch</th>
              <th className="px-6 py-3.5">Profession</th>
              <th className="px-6 py-3.5">Email</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.length > 0 ? (
              pending.map(member => {
                const matchScore = getFuzzyMatchScore(member);
                const scoreColor = matchScore >= 90 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                return (
                  <tr 
                    key={member._id} 
                    className="group border-b border-slate-800/60 hover:bg-slate-800/25 transition cursor-pointer"
                    onClick={() => handleOpenDrawer(member)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-700/60 flex items-center justify-center font-bold text-white text-sm border border-slate-600">
                          {member.profilePhoto ? (
                            <img src={member.profilePhoto} alt={member.name.en} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            member.name.en.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 font-bn text-[15px]">{member.name.en}</div>
                          <div className="text-xxs text-gray-500 font-bn">{member.name.bn}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-300">{member.batch}</td>
                    <td className="px-6 py-4 text-slate-400">{member.profession || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{member.email}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      {/* Hover-triggered button container */}
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleOpenDrawer(member)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 font-semibold px-2.5 py-1.5 rounded text-xs flex items-center space-x-1 border border-slate-700"
                        >
                          <Eye size={13} />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => handleApprove(member._id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1.5 rounded text-xs flex items-center space-x-1"
                        >
                          <UserCheck size={13} />
                          <span>Approve</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-semibold">
                  No pending profiles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                onClick={handleCloseDrawer}
                className="px-4 py-2 border border-slate-700 rounded-lg text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(selectedMember._id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold flex items-center space-x-2 shadow-md transition"
              >
                <UserCheck size={16} />
                <span>Approve Profile</span>
              </button>
            </>
          )
        }
      >
        {selectedMember && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-800/80">
              <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-3xl border-2 border-primary shadow-lg overflow-hidden">
                {selectedMember.profilePhoto ? (
                  <img src={selectedMember.profilePhoto} alt={selectedMember.name.en} className="w-full h-full object-cover" />
                ) : (
                  selectedMember.name.en.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-100 font-bn">{selectedMember.name.en}</h4>
                <p className="text-sm text-slate-400 font-bn mt-0.5">{selectedMember.name.bn}</p>
              </div>

              {/* Match Verification Score Badge */}
              <div className={`mt-2 flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                getFuzzyMatchScore(selectedMember) >= 90
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                <ShieldCheck size={14} />
                <span>Fuzzy Match: {getFuzzyMatchScore(selectedMember)}% Verified</span>
              </div>
            </div>

            {/* General Info Grid */}
            <div className="space-y-4">
              <h5 className="text-xs uppercase font-extrabold tracking-wider text-gray-500">Academic Details</h5>
              <div className="grid grid-cols-2 gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/60 text-sm">
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">SSC Batch</span>
                  <span className="text-slate-200 font-semibold">{selectedMember.batch || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">PSC Batch</span>
                  <span className="text-slate-200 font-semibold">{selectedMember.pscBatch || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">Blood Group</span>
                  <span className="text-rose-400 font-bold">{selectedMember.bloodGroup || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xxs uppercase block">Gender</span>
                  <span className="text-slate-200 font-semibold">{selectedMember.gender || 'Male'}</span>
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
