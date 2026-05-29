import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, ShieldCheck, Wifi, WifiOff, RefreshCw, Check, AlertTriangle, AlertCircle } from 'lucide-react';

const VolunteerCheckIn = () => {
  const [ticketId, setTicketId] = useState('');
  const [statusMsg, setStatusMsg] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineScans, setOfflineScans] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Load offline queue & local logs from LocalStorage on mount
  useEffect(() => {
    const queued = localStorage.getItem('offline_checkins');
    if (queued) {
      setOfflineScans(JSON.parse(queued));
    }
    
    const logs = localStorage.getItem('recent_checkins_log');
    if (logs) {
      setRecentCheckIns(JSON.parse(logs));
    }

    // Register network online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync trigger if online
    if (navigator.onLine) {
      triggerSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineQueue = (queue) => {
    setOfflineScans(queue);
    localStorage.setItem('offline_checkins', JSON.stringify(queue));
  };

  const saveLocalLogs = (logs) => {
    setRecentCheckIns(logs);
    localStorage.setItem('recent_checkins_log', JSON.stringify(logs));
  };

  const triggerSync = async () => {
    const queued = localStorage.getItem('offline_checkins');
    if (!queued) return;
    
    const scans = JSON.parse(queued);
    if (scans.length === 0) return;

    setSyncing(true);
    setStatusMsg({ type: 'info', text: `Syncing ${scans.length} queued scans with database...` });
    
    const token = localStorage.getItem('accessToken');
    const failedScans = [];
    let successCount = 0;

    for (const scan of scans) {
      try {
        const res = await axios.post(
          'http://localhost:5000/api/events/admin/checkin',
          { registrationId: scan.registrationId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          successCount++;
          // Append to log
          const newLog = {
            id: scan.registrationId,
            name: res.data.data.fullName,
            batch: res.data.data.pscBatch,
            time: new Date().toLocaleTimeString(),
            status: 'synced'
          };
          setRecentCheckIns(prev => [newLog, ...prev.slice(0, 19)]);
        }
      } catch (err) {
        failedScans.push(scan);
      }
    }

    saveOfflineQueue(failedScans);
    setSyncing(false);

    if (successCount > 0) {
      setStatusMsg({ 
        type: 'success', 
        text: `Sync complete! Successfully uploaded ${successCount} scans.` 
      });
      setTimeout(() => setStatusMsg(null), 4000);
    } else if (failedScans.length > 0) {
      setStatusMsg({ 
        type: 'error', 
        text: `Sync failed for ${failedScans.length} scans. They remain queued.` 
      });
    }
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    const currentTicket = ticketId.trim();
    setTicketId('');
    setStatusMsg(null);

    const scanTime = new Date().toLocaleTimeString();

    // Check if offline
    if (!isOnline) {
      // Queue scan locally
      const duplicate = offlineScans.some(s => s.registrationId === currentTicket);
      if (duplicate) {
        setStatusMsg({ type: 'error', text: 'Ticket already in offline queue!' });
        return;
      }

      const updatedQueue = [...offlineScans, { registrationId: currentTicket, timestamp: Date.now() }];
      saveOfflineQueue(updatedQueue);

      // Add to local log
      const newLog = {
        id: currentTicket,
        name: 'Offline Alumnus',
        batch: 'Pending Sync',
        time: scanTime,
        status: 'queued'
      };
      saveLocalLogs([newLog, ...recentCheckIns.slice(0, 19)]);
      setStatusMsg({ type: 'warning', text: 'Offline Mode: Ticket queued locally.' });
      return;
    }

    // Online check-in flow
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        'http://localhost:5000/api/events/admin/checkin',
        { registrationId: currentTicket },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStatusMsg({ type: 'success', text: res.data.message });
        const newLog = {
          id: currentTicket,
          name: res.data.data.fullName,
          batch: res.data.data.pscBatch,
          time: scanTime,
          status: 'success'
        };
        saveLocalLogs([newLog, ...recentCheckIns.slice(0, 19)]);
      }
    } catch (err) {
      const errText = err.response?.data?.message || 'Check-in failed';
      setStatusMsg({ type: 'error', text: errText });
      
      const newLog = {
        id: currentTicket,
        name: 'Failed Check-in',
        batch: 'Error',
        time: scanTime,
        status: 'failed',
        reason: errText
      };
      saveLocalLogs([newLog, ...recentCheckIns.slice(0, 19)]);
    }
  };

  const handleClearLogs = () => {
    saveLocalLogs([]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Network Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center justify-between transition ${
        isOnline 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
          <span className="text-sm font-bold uppercase tracking-wider">
            {isOnline ? 'Online Mode (Gate Sync Active)' : 'Offline Mode (Gate Scanner Saving Locally)'}
          </span>
        </div>
        {!isOnline && offlineScans.length > 0 && (
          <span className="text-xs font-semibold px-2 py-1 bg-amber-500/20 rounded border border-amber-500/30">
            {offlineScans.length} Scans Queued
          </span>
        )}
        {isOnline && offlineScans.length > 0 && (
          <button 
            onClick={triggerSync} 
            disabled={syncing}
            className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
            <span>Sync ({offlineScans.length})</span>
          </button>
        )}
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl border flex items-start space-x-2 text-sm font-semibold transition ${
          statusMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          statusMsg.type === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
          statusMsg.type === 'info' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
          'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {statusMsg.type === 'success' ? <Check size={18} className="shrink-0 mt-0.5" /> :
           statusMsg.type === 'warning' ? <AlertTriangle size={18} className="shrink-0 mt-0.5" /> :
           statusMsg.type === 'info' ? <RefreshCw size={18} className="shrink-0 mt-0.5 animate-spin" /> :
           <AlertCircle size={18} className="shrink-0 mt-0.5" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Scanner Simulation Card */}
        <div className="md:col-span-5 bg-dark-card border border-slate-800 p-6 rounded-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Camera size={18} className="text-secondary" />
              <span>Gate Terminal</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Simulate ticket scanning by entering Alumnus Registration IDs.</p>
          </div>

          {/* Scanner Visual Frame Mockup */}
          <div className="aspect-square bg-slate-900 border border-slate-800 rounded-xl relative flex flex-col items-center justify-center overflow-hidden group">
            <div className="absolute inset-x-8 top-1/2 h-0.5 bg-red-500/80 shadow-[0_0_8px_#ef4444] animate-pulse" />
            <Camera size={32} className="text-slate-600 group-hover:scale-110 transition duration-300" />
            <span className="text-[10px] text-slate-500 font-mono mt-3 uppercase tracking-wider">Awaiting Scan Target</span>
          </div>

          <form onSubmit={handleCheckInSubmit} className="space-y-3">
            <div>
              <label className="block text-xxs font-bold text-gray-400 uppercase mb-1">Registration ID / Ticket Code</label>
              <input
                type="text"
                placeholder="e.g. 6653df32a514d728"
                value={ticketId}
                onChange={e => setTicketId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-sm text-slate-100 placeholder-gray-600 focus:outline-none focus:border-secondary"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-bold text-xs bg-primary hover:bg-primary-dark text-white flex items-center justify-center space-x-2 shadow transition uppercase tracking-wide"
            >
              <ShieldCheck size={14} />
              <span>Check In Ticket</span>
            </button>
          </form>
        </div>

        {/* Scan Log History */}
        <div className="md:col-span-7 bg-dark-card border border-slate-800 p-6 rounded-xl space-y-6 flex flex-col h-full">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Live Check-In Logs</h3>
              <p className="text-xs text-gray-500 mt-0.5">Inspection logs of scanned entries in this terminal session.</p>
            </div>
            {recentCheckIns.length > 0 && (
              <button 
                onClick={handleClearLogs}
                className="text-xxs font-bold text-rose-400 hover:underline"
              >
                Clear Logs
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 max-h-[360px] pr-1">
            {recentCheckIns.length > 0 ? (
              recentCheckIns.map((log, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs transition ${
                    log.status === 'success' || log.status === 'synced'
                      ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-200'
                      : log.status === 'queued'
                      ? 'bg-amber-500/5 border-amber-500/10 text-slate-200'
                      : 'bg-rose-500/5 border-rose-500/10 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100">{log.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">({log.batch})</span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-mono block mt-0.5">ID: {log.id} {log.reason && `• Reason: ${log.reason}`}</span>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-[9px] text-gray-500 font-mono">{log.time}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      log.status === 'success' || log.status === 'synced'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : log.status === 'queued'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-xs text-gray-500 font-semibold">
                No tickets scanned in this terminal session.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerCheckIn;
