import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PaymentsManager = () => {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');

  const downloadImage = async (imageUrl, attendeeName, pscBatch) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const sanitizedName = attendeeName.trim().replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '_');
      const sanitizedBatch = pscBatch.trim().replace(/[^a-zA-Z0-9_\u0980-\u09FF]/g, '_');
      
      link.download = `${sanitizedBatch}_${sanitizedName}_registration_photo.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading image:', err);
      window.open(imageUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = () => {
    const token = localStorage.getItem('accessToken');
    api.get('/events/admin/registrations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setRegistrations(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching registrations:', err));
  };

  const handleUpdateStatus = async (regId, status) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/events/admin/registrations/${regId}/payment-status`, 
        { paymentStatus: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        fetchRegistrations();
        setMessage(`Payment status marked as ${status.toUpperCase()}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <CreditCard className="text-secondary" size={20} />
          <span>Event Registration Payments</span>
        </h3>
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
              <th className="px-6 py-3">Attendee / Photo</th>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations.length > 0 ? (
              registrations.map(reg => (
                <tr key={reg._id} className="border-b border-slate-800 hover:bg-slate-850">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {reg.userImage ? (
                        <div className="relative group shrink-0">
                          <img
                            src={reg.userImage}
                            alt={reg.fullName}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-700 cursor-pointer hover:border-secondary transition-all"
                            onClick={() => window.open(reg.userImage, '_blank')}
                          />
                          <button
                            onClick={() => downloadImage(reg.userImage, reg.fullName, reg.pscBatch)}
                            className="absolute -bottom-1 -right-1 bg-secondary text-primary rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Download with marked filename"
                          >
                            <svg className="w-3 h-3 fill-current text-slate-900" viewBox="0 0 24 24" width="12" height="12">
                              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-bold shrink-0 text-[10px]">
                          No Photo
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-200">{reg.fullName}</div>
                        <div className="text-xs text-gray-500">{reg.email}</div>
                        <div className="text-[10px] text-slate-400">Phone: {reg.contactNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-200 font-bn">
                      {reg.eventId?.title?.bn || 'N/A'}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      PSC: {reg.pscBatch}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      reg.paymentType === 'digital' 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {reg.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                      reg.paymentStatus === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : reg.paymentStatus === 'failed'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {reg.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(reg._id, 'completed')}
                        className="text-emerald-500 hover:bg-emerald-500/10 p-1.5 rounded transition"
                        title="Mark Completed / Paid"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(reg._id, 'pending')}
                        className="text-amber-500 hover:bg-amber-500/10 p-1.5 rounded transition"
                        title="Mark Pending"
                      >
                        <AlertCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(reg._id, 'failed')}
                        className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded transition"
                        title="Mark Failed"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-semibold">
                  No event registration payments tracked yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsManager;
