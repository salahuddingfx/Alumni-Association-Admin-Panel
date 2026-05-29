import React, { useEffect, useState } from 'react';
import api, { API_URL } from '../api/api';
import {
  Calendar, Plus, Trash, Edit, X, Users, CheckCircle,
  AlertCircle, XCircle, Search, Filter, Download,
  ChevronDown, ChevronUp, Phone, Mail, MapPin, Eye,
  CreditCard, Clock, UserCheck, RotateCcw
} from 'lucide-react';
import { getImageUrl } from '../utils/image';

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    pending:   'bg-amber-500/15   text-amber-400   border-amber-500/25',
    failed:    'bg-rose-500/15    text-rose-400    border-rose-500/25',
  };
  return (
    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${cfg[status] || cfg.pending}`}>
      {status}
    </span>
  );
};

// ─── REGISTRATION DETAIL MODAL ────────────────────────────────────────────────
const RegDetailModal = ({ reg, onClose, onUpdateStatus }) => {
  if (!reg) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#0d1f36] border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
            <UserCheck size={18} className="text-secondary" />
            <span>Registration Details</span>
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Attendee photo + basic info */}
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
              {reg.userImage
                ? <img src={getImageUrl(reg.userImage)} alt={reg.fullName} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-slate-600"><Users size={24} /></div>
              }
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-lg font-bold text-slate-100">{reg.fullName}</h4>
              <p className="text-sm text-slate-400 font-bn mt-0.5">পিতা: {reg.fathersName} | মাতা: {reg.mothersName}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] bg-primary/20 text-blue-300 border border-primary/30 px-2 py-0.5 rounded-full font-bold">PSC {reg.pscBatch}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold capitalize">{reg.gender}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold capitalize">{reg.maritalStatus}</span>
                {reg.checkedIn && <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold">✓ Checked In</span>}
              </div>
            </div>
          </div>

          {/* Contact info grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { icon: <Mail size={13} />, label: 'Email', val: reg.email },
              { icon: <Phone size={13} />, label: 'Phone', val: reg.contactNumber },
              { icon: <Phone size={13} />, label: 'WhatsApp', val: reg.whatsappNumber },
              { icon: <MapPin size={13} />, label: 'Address', val: reg.fullAddress },
            ].map(({ icon, label, val }) => (
              <div key={label} className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-slate-500 mb-1">{icon}<span className="text-[10px] uppercase font-bold tracking-wider">{label}</span></div>
                <p className="text-slate-200 text-xs break-all">{val || '—'}</p>
              </div>
            ))}
          </div>

          {/* Payment info */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-3">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5"><CreditCard size={13} /><span>Payment Info</span></h5>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-600 block">Payment Type</span><span className="text-slate-200 capitalize font-semibold">{reg.paymentType}</span></div>
              {reg.paymentType === 'digital' && <>
                <div><span className="text-slate-600 block">Provider</span><span className="text-slate-200 font-semibold">{reg.paymentProvider || '—'}</span></div>
                <div><span className="text-slate-600 block">Mobile Number</span><span className="text-slate-200 font-semibold">{reg.paymentNumber || '—'}</span></div>
                <div><span className="text-slate-600 block">Transaction ID</span><span className="text-slate-200 font-mono">{reg.transactionId || '—'}</span></div>
              </>}
              <div><span className="text-slate-600 block">Status</span><StatusBadge status={reg.paymentStatus} /></div>
              <div><span className="text-slate-600 block">Registered At</span><span className="text-slate-400">{new Date(reg.createdAt).toLocaleString()}</span></div>
            </div>

            {/* Update payment status */}
            <div className="pt-2 border-t border-slate-800 flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Update Status:</span>
              {['completed', 'pending', 'failed'].map(st => (
                <button key={st}
                  onClick={() => onUpdateStatus(reg._id, st)}
                  disabled={reg.paymentStatus === st}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition disabled:opacity-40 disabled:cursor-not-allowed
                    ${st === 'completed' ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400'
                    : st === 'failed'    ? 'bg-rose-500/15    hover:bg-rose-500/25    text-rose-400'
                                        : 'bg-amber-500/15   hover:bg-amber-500/25   text-amber-400'}`}
                >{st}</button>
              ))}
            </div>
          </div>

          {/* Event */}
          {reg.eventId && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
              <h5 className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2 flex items-center space-x-1.5"><Calendar size={13} /><span>Event</span></h5>
              <p className="text-sm font-bold text-slate-200 font-bn">{reg.eventId.title?.bn}</p>
              <p className="text-xs text-slate-400">{reg.eventId.title?.en}</p>
              <p className="text-xs text-slate-500 mt-1">{reg.eventId.date ? new Date(reg.eventId.date).toLocaleDateString() : ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── REGISTRATIONS TAB ────────────────────────────────────────────────────────
const RegistrationsTab = () => {
  const [regs, setRegs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterStatus, setStatus] = useState('all');
  const [filterEvent, setEvent]   = useState('all');
  const [selected, setSelected]   = useState(null);
  const [message, setMessage]     = useState({ text: '', type: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events/admin/registrations');
      if (res.data.success) setRegs(res.data.data);
    } catch (e) { console.log(e); }
    finally { setLoading(false); }
  };

  const handleUpdateStatus = async (regId, status) => {
    try {
      const res = await api.put(`/events/admin/registrations/${regId}/payment-status`, { paymentStatus: status });
      if (res.data.success) {
        setRegs(prev => prev.map(r => r._id === regId ? { ...r, paymentStatus: status } : r));
        if (selected?._id === regId) setSelected(prev => ({ ...prev, paymentStatus: status }));
        flash(`Status updated to ${status.toUpperCase()}`, 'success');
      }
    } catch (e) { flash('Failed to update status', 'error'); }
  };

  const flash = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Unique events for filter dropdown
  const events = [...new Map(regs.map(r => [r.eventId?._id, r.eventId]).filter(([k]) => k)).values()];

  const filtered = regs.filter(r => {
    const matchSearch = !search || r.fullName?.toLowerCase().includes(search.toLowerCase())
      || r.email?.toLowerCase().includes(search.toLowerCase())
      || r.pscBatch?.toLowerCase().includes(search.toLowerCase())
      || r.transactionId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || r.paymentStatus === filterStatus;
    const matchEvent  = filterEvent  === 'all' || r.eventId?._id  === filterEvent;
    return matchSearch && matchStatus && matchEvent;
  });

  // Stats
  const total     = regs.length;
  const completed = regs.filter(r => r.paymentStatus === 'completed').length;
  const pending   = regs.filter(r => r.paymentStatus === 'pending').length;
  const checkedIn = regs.filter(r => r.checkedIn).length;

  return (
    <div className="space-y-5">
      {/* Flash message */}
      {message.text && (
        <div className={`p-3 rounded-xl text-sm font-semibold border flex items-center space-x-2 ${
          message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Registrations', val: total,     color: 'text-blue-400',    bg: 'bg-blue-500/10   border-blue-500/20' },
          { label: 'Confirmed / Paid',    val: completed, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Pending Payment',     val: pending,   color: 'text-amber-400',   bg: 'bg-amber-500/10  border-amber-500/20' },
          { label: 'Checked In',          val: checkedIn, color: 'text-purple-400',  bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`rounded-xl border p-4 ${bg}`}>
            <p className={`text-2xl font-extrabold ${color}`}>{val}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, batch, txn ID..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-secondary transition placeholder-slate-600"
          />
        </div>
        <select value={filterStatus} onChange={e => setStatus(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-secondary">
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select value={filterEvent} onChange={e => setEvent(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-secondary max-w-[220px]">
          <option value="all">All Events</option>
          {events.map(ev => ev && <option key={ev._id} value={ev._id}>{ev.title?.en}</option>)}
        </select>
        <button onClick={fetchAll} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition" title="Refresh">
          <RotateCcw size={14} />
        </button>
        <span className="text-xs text-slate-600 font-semibold ml-auto">{filtered.length} of {total} records</span>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-600 font-semibold">Loading registrations...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-600 font-semibold">
            {regs.length === 0 ? 'No event registrations yet.' : 'No records match your filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase text-slate-500 font-bold tracking-wider bg-slate-800/60 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Attendee</th>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Batch</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Check-In</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map(reg => (
                  <tr key={reg._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                          {reg.userImage
                            ? <img src={getImageUrl(reg.userImage)} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-bold">{reg.fullName?.[0]}</div>
                          }
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 text-xs">{reg.fullName}</p>
                          <p className="text-[10px] text-slate-500">{reg.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-semibold text-slate-300 font-bn">{reg.eventId?.title?.bn || '—'}</p>
                      <p className="text-[10px] text-slate-600">{reg.eventId?.title?.en}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-bold text-secondary">PSC {reg.pscBatch}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        reg.paymentType === 'digital' ? 'bg-purple-500/15 text-purple-400' : 'bg-yellow-500/15 text-yellow-400'
                      }`}>{reg.paymentType}</span>
                      {reg.paymentType === 'digital' && reg.paymentProvider && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{reg.paymentProvider}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={reg.paymentStatus} /></td>
                    <td className="px-5 py-3.5">
                      {reg.checkedIn
                        ? <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1"><CheckCircle size={11} /><span>Yes</span></span>
                        : <span className="text-[10px] text-slate-600">—</span>
                      }
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] text-slate-500">{new Date(reg.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end space-x-1">
                        <button onClick={() => setSelected(reg)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition" title="View Details">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleUpdateStatus(reg._id, 'completed')} disabled={reg.paymentStatus === 'completed'} className="p-1.5 rounded-lg hover:bg-emerald-500/15 text-emerald-500/60 hover:text-emerald-400 disabled:opacity-30 transition" title="Mark Paid">
                          <CheckCircle size={14} />
                        </button>
                        <button onClick={() => handleUpdateStatus(reg._id, 'pending')} disabled={reg.paymentStatus === 'pending'} className="p-1.5 rounded-lg hover:bg-amber-500/15 text-amber-500/60 hover:text-amber-400 disabled:opacity-30 transition" title="Mark Pending">
                          <Clock size={14} />
                        </button>
                        <button onClick={() => handleUpdateStatus(reg._id, 'failed')} disabled={reg.paymentStatus === 'failed'} className="p-1.5 rounded-lg hover:bg-rose-500/15 text-rose-500/60 hover:text-rose-400 disabled:opacity-30 transition" title="Mark Failed">
                          <XCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && <RegDetailModal reg={selected} onClose={() => setSelected(null)} onUpdateStatus={handleUpdateStatus} />}
    </div>
  );
};

// ─── EVENTS TAB ───────────────────────────────────────────────────────────────
const EventsTab = () => {
  const [events, setEvents]           = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [titleEn, setTitleEn]         = useState('');
  const [titleBn, setTitleBn]         = useState('');
  const [descEn, setDescEn]           = useState('');
  const [descBn, setDescBn]           = useState('');
  const [date, setDate]               = useState('');
  const [locEn, setLocEn]             = useState('');
  const [locBn, setLocBn]             = useState('');
  const [category, setCategory]       = useState('reunion');
  const [saving, setSaving]           = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = () => {
    api.get('/events').then(res => { if (res.data.success) setEvents(res.data.data); }).catch(console.log);
  };

  const reset = () => { setEditingEvent(null); setTitleEn(''); setTitleBn(''); setDescEn(''); setDescBn(''); setDate(''); setLocEn(''); setLocBn(''); setCategory('reunion'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { title: { en: titleEn, bn: titleBn }, description: { en: descEn, bn: descBn }, location: { en: locEn, bn: locBn }, date, category };
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, payload);
      } else {
        await api.post('/events', payload);
      }
      reset(); fetchEvents();
    } catch (e) { console.log(e); }
    finally { setSaving(false); }
  };

  const startEdit = (ev) => {
    setEditingEvent(ev);
    setTitleEn(ev.title?.en || ''); setTitleBn(ev.title?.bn || '');
    setDescEn(ev.description?.en || ''); setDescBn(ev.description?.bn || '');
    setLocEn(ev.location?.en || ''); setLocBn(ev.location?.bn || '');
    setCategory(ev.category || 'reunion');
    if (ev.date) {
      const d = new Date(ev.date);
      setDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try { await api.delete(`/events/${id}`); fetchEvents(); } catch (e) { console.log(e); }
  };

  const inp = "w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all placeholder-slate-600";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form */}
      <div className="bg-[#0d1f36] border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-slate-100 flex items-center space-x-2">
          {editingEvent ? <Edit size={18} className="text-secondary" /> : <Plus size={18} className="text-secondary" />}
          <span>{editingEvent ? 'Edit Event' : 'Create New Event'}</span>
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Title (বাংলা)</label><input className={`${inp} font-bn`} value={titleBn} onChange={e => setTitleBn(e.target.value)} required /></div>
            <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Title (English)</label><input className={inp} value={titleEn} onChange={e => setTitleEn(e.target.value)} required /></div>
            <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Location (বাংলা)</label><input className={`${inp} font-bn`} value={locBn} onChange={e => setLocBn(e.target.value)} required /></div>
            <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Location (English)</label><input className={inp} value={locEn} onChange={e => setLocEn(e.target.value)} required /></div>
            <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Date & Time</label><input type="datetime-local" className={inp} value={date} onChange={e => setDate(e.target.value)} required /></div>
            <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Category</label>
              <select className={inp} value={category} onChange={e => setCategory(e.target.value)}>
                {['reunion', 'seminar', 'social', 'cultural', 'other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Description (বাংলা)</label><textarea className={`${inp} font-bn resize-none`} rows={2} value={descBn} onChange={e => setDescBn(e.target.value)} required /></div>
          <div><label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">Description (English)</label><textarea className={inp + ' resize-none'} rows={2} value={descEn} onChange={e => setDescEn(e.target.value)} required /></div>
          <div className="flex space-x-3 pt-1">
            {editingEvent && <button type="button" onClick={reset} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-lg transition flex items-center justify-center space-x-1.5"><X size={15} /><span>Cancel</span></button>}
            <button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center space-x-1.5 disabled:opacity-60">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (editingEvent ? <Edit size={15} /> : <Plus size={15} />)}
              <span>{editingEvent ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Events list */}
      <div className="bg-[#0d1f36] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100">Scheduled Events <span className="text-slate-500 font-normal text-sm">({events.length})</span></h3>
        </div>
        <div className="space-y-2 overflow-y-auto max-h-[540px] pr-1">
          {events.length === 0 && <div className="py-10 text-center text-sm text-slate-600 font-semibold">No events yet.</div>}
          {events.map(ev => (
            <div key={ev._id} className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between group hover:border-slate-700 transition">
              <div className="min-w-0">
                <span className="text-[9px] font-extrabold uppercase text-secondary tracking-wider">{ev.category}</span>
                <p className="font-bold text-slate-200 font-bn text-sm leading-snug">{ev.title?.bn}</p>
                <p className="text-xs text-slate-500">{ev.title?.en}</p>
                <div className="flex items-center space-x-3 text-[10px] text-slate-600 mt-1">
                  <span className="flex items-center space-x-1"><Calendar size={10} /><span>{new Date(ev.date).toLocaleDateString()}</span></span>
                  <span className="flex items-center space-x-1"><Users size={10} /><span>{ev.rsvpCount || 0} registered</span></span>
                </div>
              </div>
              <div className="flex items-center space-x-1 shrink-0 ml-3">
                <button onClick={() => startEdit(ev)} className="p-1.5 rounded hover:bg-slate-700 text-slate-500 hover:text-secondary transition" title="Edit"><Edit size={14} /></button>
                <button onClick={() => handleDelete(ev._id)} className="p-1.5 rounded hover:bg-rose-500/15 text-slate-500 hover:text-rose-400 transition" title="Delete"><Trash size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const EventsManager = () => {
  const [activeTab, setActiveTab] = useState('events');

  const TABS = [
    { id: 'events',        label: 'Events',        icon: <Calendar size={15} /> },
    { id: 'registrations', label: 'Registrations', icon: <Users    size={15} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-center space-x-1 bg-[#0d1f36] rounded-xl p-1 border border-slate-800 max-w-sm">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${
              activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.icon}<span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'events'        && <EventsTab />}
      {activeTab === 'registrations' && <RegistrationsTab />}
    </div>
  );
};

export default EventsManager;
