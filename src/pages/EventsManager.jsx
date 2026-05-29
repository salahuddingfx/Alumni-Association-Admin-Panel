import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Calendar, Plus, Trash, Edit, X } from 'lucide-react';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descBn, setDescBn] = useState('');
  const [date, setDate] = useState('');
  const [locEn, setLocEn] = useState('');
  const [locBn, setLocBn] = useState('');
  const [category, setCategory] = useState('reunion');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    api.get('/events')
      .then(res => {
        if (res.data.success) {
          setEvents(res.data.data);
        }
      })
      .catch(err => console.log(err));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: { en: titleEn, bn: titleBn },
        description: { en: descEn, bn: descBn },
        location: { en: locEn, bn: locBn },
        date,
        category,
      };

      const token = localStorage.getItem('accessToken');
      const res = await api.post('/events', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTitleEn('');
        setTitleBn('');
        setDescEn('');
        setDescBn('');
        setDate('');
        setLocEn('');
        setLocBn('');
        fetchEvents();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: { en: titleEn, bn: titleBn },
        description: { en: descEn, bn: descBn },
        location: { en: locEn, bn: locBn },
        date,
        category,
      };

      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/events/${editingEvent._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEditingEvent(null);
        setTitleEn('');
        setTitleBn('');
        setDescEn('');
        setDescBn('');
        setDate('');
        setLocEn('');
        setLocBn('');
        fetchEvents();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (event) => {
    setEditingEvent(event);
    setTitleEn(event.title?.en || '');
    setTitleBn(event.title?.bn || '');
    setDescEn(event.description?.en || '');
    setDescBn(event.description?.bn || '');
    if (event.date) {
      const d = new Date(event.date);
      // Format to YYYY-MM-DDTHH:MM local time
      const tzOffset = d.getTimezoneOffset() * 60000;
      const localISODate = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
      setDate(localISODate);
    } else {
      setDate('');
    }
    setLocEn(event.location?.en || '');
    setLocBn(event.location?.bn || '');
    setCategory(event.category || 'reunion');
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setTitleEn('');
    setTitleBn('');
    setDescEn('');
    setDescBn('');
    setDate('');
    setLocEn('');
    setLocBn('');
    setCategory('reunion');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create / Edit form */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          {editingEvent ? <Edit size={20} className="text-secondary" /> : <Plus size={20} className="text-secondary" />}
          <span>{editingEvent ? 'Edit Event Details' : 'Add New Event'}</span>
        </h3>

        <form onSubmit={editingEvent ? handleUpdate : handleCreate} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Bengali Title</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">English Title</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Bengali Location</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={locBn} onChange={(e) => setLocBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">English Location</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={locEn} onChange={(e) => setLocEn(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Date & Time</label>
              <input type="datetime-local" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-300" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <select className="w-full bg-slate-800 border border-slate-700 px-3 py-2.5 rounded text-slate-300" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="reunion">Reunion</option>
                <option value="seminar">Seminar</option>
                <option value="social">Social</option>
                <option value="cultural">Cultural</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Bengali Description</label>
            <textarea className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" rows={2} value={descBn} onChange={(e) => setDescBn(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">English Description</label>
            <textarea className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} required />
          </div>

          <div className="flex space-x-3 pt-2">
            {editingEvent && (
              <button type="button" onClick={cancelEdit} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded shadow transition flex items-center justify-center space-x-1">
                <X size={16} />
                <span>Cancel</span>
              </button>
            )}
            <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded shadow transition flex items-center justify-center space-x-1.5">
              {editingEvent ? <Edit size={16} /> : <Plus size={16} />}
              <span>{editingEvent ? 'Save Changes' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Scheduled Events</h3>
        <div className="space-y-3 overflow-y-auto max-h-[500px]">
          {events.map(event => (
            <div key={event._id} className="bg-slate-900 p-4 rounded border border-slate-850 flex justify-between items-center">
              <div>
                <span className="text-xs text-secondary font-bold uppercase">{event.category}</span>
                <h4 className="font-bold text-slate-200 font-bn">{event.title?.bn}</h4>
                <div className="flex items-center space-x-2 text-xxs text-gray-500 mt-1">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span>|</span>
                  <span className="font-bn">{event.location?.bn}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => startEdit(event)} className="text-slate-400 hover:text-secondary p-1 rounded transition" title="Edit Event">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(event._id)} className="text-slate-500 hover:text-red-400 p-1 rounded transition" title="Delete Event">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsManager;
