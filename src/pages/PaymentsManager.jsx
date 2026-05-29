import React, { useEffect, useState } from 'react';
import api, { API_URL } from '../api/api';
import { CreditCard, CheckCircle, XCircle, AlertCircle, Save, Settings, FileText } from 'lucide-react';
import EventFeesSettings from '../components/settings/EventFeesSettings.jsx';

const PaymentsManager = () => {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' or 'config'

  // Payment settings state
  const [bkash, setBkash] = useState('');
  const [nagad, setNagad] = useState('');
  const [rocket, setRocket] = useState('');
  const [eventDefaultFee, setEventDefaultFee] = useState(1500);
  const [eventBatchFees, setEventBatchFees] = useState([]);
  const [digitalFeeType, setDigitalFeeType] = useState('percentage');
  const [digitalFeeValue, setDigitalFeeValue] = useState(2);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    fetchRegistrations();
    fetchPaymentSettings();
  }, []);

  const fetchRegistrations = () => {
    api.get('/events/admin/registrations')
      .then(res => {
        if (res.data.success) {
          setRegistrations(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching registrations:', err));
  };

  const fetchPaymentSettings = () => {
    api.get(`${API_URL}/api/v1/settings/general_settings`)
      .then(res => {
        if (res.data.success && res.data.data) {
          const val = res.data.data;
          setBkash(val.bkash || '');
          setNagad(val.nagad || '');
          setRocket(val.rocket || '');
          setEventDefaultFee(val.eventDefaultFee || 1500);
          setEventBatchFees(val.eventBatchFees || []);
          setDigitalFeeType(val.digitalFeeType || 'percentage');
          setDigitalFeeValue(val.digitalFeeValue ?? 2);
        }
      })
      .catch(err => console.log('Error fetching payment settings:', err));
  };

  const handleUpdateStatus = async (regId, status) => {
    try {
      const res = await api.put(`/events/admin/registrations/${regId}/payment-status`, 
        { paymentStatus: status }
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

  const handleSavePaymentSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      
      // Fetch general settings first to merge and prevent overwriting of non-payment fields
      const getRes = await api.get(`${API_URL}/api/v1/settings/general_settings`);
      const existingValue = getRes.data.success && getRes.data.data ? getRes.data.data : {};
      
      const newValue = {
        ...existingValue,
        bkash,
        nagad,
        rocket,
        eventDefaultFee: Number(eventDefaultFee),
        eventBatchFees: eventBatchFees.map(f => ({ batches: f.batches, fee: Number(f.fee) })),
        digitalFeeType,
        digitalFeeValue: Number(digitalFeeValue)
      };

      const res = await api.put(`${API_URL}/api/v1/settings/general_settings`, { value: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSettingsSuccess('Payment and fee configurations updated successfully!');
        setTimeout(() => setSettingsSuccess(''), 3000);
      }
    } catch (err) {
      console.log(err);
      setSettingsError('Failed to save configurations');
      setTimeout(() => setSettingsError(''), 3000);
    }
  };

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <CreditCard className="text-secondary" size={20} />
          <span>Payments & Fees Manager</span>
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/60 mb-6 text-sm">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center space-x-2 py-3 px-6 font-bold border-b-2 transition ${
            activeTab === 'ledger'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText size={16} />
          <span>Payment Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex items-center space-x-2 py-3 px-6 font-bold border-b-2 transition ${
            activeTab === 'config'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings size={16} />
          <span>Gateway & Fee Config</span>
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <div className="space-y-6">
          {message && (
            <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20">
              {message}
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs uppercase bg-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-3">Attendee</th>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Payment Info</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length > 0 ? (
                  registrations.map(reg => (
                    <tr key={reg._id} className="border-b border-slate-800 hover:bg-slate-850">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-200">{reg.fullName}</div>
                        <div className="text-xs text-gray-500">{reg.email}</div>
                        <div className="text-[10px] text-slate-400">Phone: {reg.contactNumber}</div>
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
                        {reg.paymentType === 'digital' ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                                reg.paymentProvider === 'bKash' 
                                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' 
                                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              }`}>
                                {reg.paymentProvider || 'Digital'}
                              </span>
                              <span className="text-xs text-slate-300 font-semibold">{reg.paymentNumber}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Txn: {reg.transactionId || 'N/A'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Cash Checkout</span>
                        )}
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
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-semibold">
                      No event registration payments tracked yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSavePaymentSettings} className="space-y-6 text-sm">
          {settingsSuccess && (
            <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20">
              {settingsSuccess}
            </div>
          )}
          {settingsError && (
            <div className="p-3 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg border border-red-500/20 flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>{settingsError}</span>
            </div>
          )}

          {/* Payment Gateway Personal Numbers */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <span className="w-1.5 h-3 bg-secondary rounded-full" />
              <span>Mobile Banking Gateway Numbers</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">bKash Personal Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm focus:outline-none focus:border-secondary"
                  value={bkash}
                  onChange={(e) => setBkash(e.target.value)}
                  placeholder="e.g. +88017XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nagad Personal Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm focus:outline-none focus:border-secondary"
                  value={nagad}
                  onChange={(e) => setNagad(e.target.value)}
                  placeholder="e.g. +88018XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Rocket Personal Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm focus:outline-none focus:border-secondary"
                  value={rocket}
                  onChange={(e) => setRocket(e.target.value)}
                  placeholder="e.g. +88019XXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Fees Overrides & Surcharge */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <EventFeesSettings
              eventDefaultFee={eventDefaultFee}
              setEventDefaultFee={setEventDefaultFee}
              eventBatchFees={eventBatchFees}
              setEventBatchFees={setEventBatchFees}
              digitalFeeType={digitalFeeType}
              setDigitalFeeType={setDigitalFeeType}
              digitalFeeValue={digitalFeeValue}
              setDigitalFeeValue={setDigitalFeeValue}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded shadow transition flex items-center space-x-1.5 text-xs uppercase tracking-wider"
            >
              <Save size={14} />
              <span>Save Configurations</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentsManager;
