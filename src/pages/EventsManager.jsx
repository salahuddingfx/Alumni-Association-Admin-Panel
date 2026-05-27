import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Plus, Trash } from 'lucide-react';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
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
    axios.get(`${window.API_URL}/api/v1/events`)
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
      const res = await axios.post(`${window.API_URL}/api/v1/events`, payload, {
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

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${window.API_URL}/api/v1/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create form */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Plus size={20} className="text-secondary" />
          <span>Add New Event</span>
        </h3>

        <form onSubmit={handleCreate} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Bengali Title</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">English Title</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Bengali Location</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" value={locBn} onChange={(e) => setLocBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">English Location</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" value={locEn} onChange={(e) => setLocEn(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Date & Time</label>
            <input type="datetime-local" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-300" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Bengali Description</label>
            <textarea className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" rows={2} value={descBn} onChange={(e) => setDescBn(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">English Description</label>
            <textarea className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" rows={2} value={descEn} onChange={(e) => setDescEn(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded shadow transition">
            Create Event
          </button>
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
                <h4 className="font-bold text-slate-200 font-bn">{event.title.bn}</h4>
                <div className="flex items-center space-x-2 text-xxs text-gray-500 mt-1">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span>|</span>
                  <span className="font-bn">{event.location.bn}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(event._id)} className="text-slate-500 hover:text-red-400 transition">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsManager;
