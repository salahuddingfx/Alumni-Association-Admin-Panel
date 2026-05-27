import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Camera, Download, Search, Calendar, User, Eye, ArrowDownToLine } from 'lucide-react';

const RegistrationsPhotos = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      // Fetch registrations
      const regRes = await api.get('/events/admin/registrations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (regRes.data.success) {
        // Filter out those that don't have images (though they are mandatory now, historical ones might not)
        setRegistrations(regRes.data.data.filter(r => r.userImage));
      }

      // Fetch events for filtering
      const eventRes = await api.get('/events');
      if (eventRes.data.success) {
        setEvents(eventRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching data for photo manager:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const downloadAllFiltered = async () => {
    const filtered = filteredRegistrations;
    if (filtered.length === 0) return;
    
    if (!window.confirm(`Download all ${filtered.length} filtered photos? Your browser might ask for multiple download permissions.`)) {
      return;
    }

    for (const reg of filtered) {
      await downloadImage(reg.userImage, reg.fullName, reg.pscBatch);
      // Small delay to prevent browser download congestion
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = 
      reg.fullName.toLowerCase().includes(search.toLowerCase()) ||
      reg.pscBatch.toLowerCase().includes(search.toLowerCase());
    
    const matchesEvent = selectedEvent === 'all' || reg.eventId?._id === selectedEvent;
    
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2.5">
            <Camera className="text-secondary" size={24} />
            <span className="font-bn">ইভেন্ট রেজিস্ট্রেশন ফটো গ্যালারি (Registration Photos)</span>
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
            View, inspect, and download registered attendees' photos marked with their names
          </p>
        </div>

        {filteredRegistrations.length > 0 && (
          <button
            onClick={downloadAllFiltered}
            className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-lg shadow-md transition flex items-center space-x-2 text-xs uppercase self-start md:self-auto border border-slate-700 hover:border-secondary"
          >
            <ArrowDownToLine size={16} className="text-secondary" />
            <span>Download All ({filteredRegistrations.length})</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-dark-card p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            className="w-full bg-slate-800 border border-slate-700 pl-10 pr-4 py-2.5 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-secondary transition-all"
            placeholder="Search by attendee name or batch year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Event Filter */}
        <div className="w-full sm:w-64 relative">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select
            className="w-full bg-slate-800 border border-slate-700 pl-10 pr-4 py-2.5 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-secondary transition-all appearance-none cursor-pointer"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="all">All Events</option>
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.title.en}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Loading attendee photos...</p>
        </div>
      ) : filteredRegistrations.length > 0 ? (
        /* Photo Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRegistrations.map(reg => (
            <div 
              key={reg._id} 
              className="bg-dark-card border border-slate-800 rounded-2xl overflow-hidden hover:border-secondary/40 transition-all duration-300 group hover:shadow-lg flex flex-col justify-between"
            >
              {/* Image Container with Hover overlay */}
              <div className="relative aspect-square w-full bg-slate-900 overflow-hidden flex items-center justify-center border-b border-slate-800">
                <img
                  src={reg.userImage}
                  alt={reg.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3.5">
                  <button
                    onClick={() => window.open(reg.userImage, '_blank')}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-200 transition-colors shadow-md border border-slate-600 hover:text-white"
                    title="View Image"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => downloadImage(reg.userImage, reg.fullName, reg.pscBatch)}
                    className="p-2.5 bg-secondary hover:bg-yellow-500 rounded-full text-primary transition-colors shadow-md border border-yellow-400 font-extrabold"
                    title="Download Marked Image"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 space-y-2 text-xs">
                <div>
                  <h4 className="font-extrabold text-slate-100 text-sm truncate">{reg.fullName}</h4>
                  <p className="text-[10px] text-gray-500 truncate">{reg.email}</p>
                </div>
                
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                  <span className="bg-slate-850 px-2 py-0.5 rounded border border-slate-800 font-mono font-semibold">
                    {reg.pscBatch}
                  </span>
                  <span className="font-semibold text-secondary truncate max-w-[120px] font-bn">
                    {reg.eventId?.title?.bn || 'Event'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-dark-card border border-slate-800 rounded-2xl">
          <Camera className="mx-auto text-slate-750 mb-3" size={40} />
          <h4 className="text-slate-400 font-bold text-sm uppercase tracking-wider">No photos found</h4>
          <p className="text-xs text-gray-500 mt-1">Try resetting search filters or verify if registrations have photos.</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationsPhotos;
