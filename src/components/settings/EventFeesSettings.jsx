import React from 'react';
import { Plus, Trash, CreditCard } from 'lucide-react';

const EventFeesSettings = ({
  eventDefaultFee, setEventDefaultFee,
  eventBatchFees, setEventBatchFees,
  digitalFeeType, setDigitalFeeType,
  digitalFeeValue, setDigitalFeeValue
}) => {
  return (
    <div className="border-t border-slate-800 pt-6 mt-6 space-y-6">
      {/* Event Fees Override Section */}
      <div>
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
          <span className="w-1.5 h-3 bg-secondary rounded-full" />
          <span>Event Registration Fees Configuration</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Default Registration Fee (BDT)</label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm font-bold text-secondary"
              value={eventDefaultFee}
              onChange={(e) => setEventDefaultFee(e.target.value)}
              placeholder="1500"
              required
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-500 text-xs mt-6 leading-relaxed">
              Set a base fee for event registrations. Below, you can add custom overrides for specific batches (e.g. older batches get discounts, or grouped batches get unique fees).
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Batch-wise Fee Overrides</label>
          {eventBatchFees.map((rule, idx) => (
            <div key={idx} className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase mb-0.5">Batch Year(s) (e.g. 2012 or 2010-2012 or 2010,2011)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100 font-mono text-xs"
                    value={rule.batches}
                    onChange={(e) => {
                      const newFees = [...eventBatchFees];
                      newFees[idx].batches = e.target.value;
                      setEventBatchFees(newFees);
                    }}
                    placeholder="e.g. 2010, 2011, 2012 or 2015-2018"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] uppercase mb-0.5">Override Fee (BDT)</label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100 font-bold text-xs"
                    value={rule.fee}
                    onChange={(e) => {
                      const newFees = [...eventBatchFees];
                      newFees[idx].fee = e.target.value;
                      setEventBatchFees(newFees);
                    }}
                    placeholder="e.g. 1000"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEventBatchFees(eventBatchFees.filter((_, i) => i !== idx));
                }}
                className="text-slate-500 hover:text-red-400 p-2 transition self-end"
                title="Remove Rule"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              setEventBatchFees([...eventBatchFees, { batches: '', fee: '' }]);
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-1.5 rounded transition flex items-center space-x-1.5 text-xs"
          >
            <Plus size={14} className="text-secondary" />
            <span>Add Batch Fee Override</span>
          </button>
        </div>
      </div>

      {/* Online/Digital Processing Fee configuration */}
      <div className="border-t border-slate-800 pt-6">
        <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center space-x-2">
          <CreditCard size={18} className="text-secondary" />
          <span>Online/Digital Payment Processing Fee</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Processing Fee Type</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
              value={digitalFeeType}
              onChange={(e) => setDigitalFeeType(e.target.value)}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Flat BDT (৳)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">
              {digitalFeeType === 'percentage' ? 'Fee Percentage (%)' : 'Flat Fee Amount (BDT)'}
            </label>
            <input
              type="number"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm font-bold text-secondary"
              value={digitalFeeValue}
              onChange={(e) => setDigitalFeeValue(e.target.value)}
              placeholder={digitalFeeType === 'percentage' ? '2' : '20'}
              required
            />
          </div>
          <div className="flex items-center">
            <p className="text-gray-500 text-xs mt-4 md:mt-0 leading-relaxed">
              Configures the extra processing surcharge applied when users choose digital payment gateways (bKash/Nagad/SSLCommerz).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFeesSettings;
