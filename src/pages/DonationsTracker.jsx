import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';

const DonationsTracker = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    axios.get(`${window.API_URL}/api/v1/donations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data.success) {
          setDonations(res.data.data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
      <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
        <Heart className="text-rose-500 fill-current" size={20} />
        <span>Donation Ledger History</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs uppercase bg-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-3">Donor Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Transaction ID</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.length > 0 ? (
              donations.map(donation => (
                <tr key={donation._id} className="border-b border-slate-800 hover:bg-slate-850">
                  <td className="px-6 py-4 font-bold text-slate-200 font-bn">
                    {donation.isAnonymous ? 'Anonymous' : donation.donorName.en}
                  </td>
                  <td className="px-6 py-4">{donation.isAnonymous ? 'N/A' : donation.email}</td>
                  <td className="px-6 py-4 text-secondary font-bold">৳{donation.amount}</td>
                  <td className="px-6 py-4">{donation.paymentMethod}</td>
                  <td className="px-6 py-4 font-mono text-xs">{donation.transactionId}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(donation.date).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              // Mock Donation Records
              [
                { _id: '1', donorName: { en: 'Sabbir Ahmed' }, email: 'sabbir@google.com', amount: 5000, paymentMethod: 'bKash', transactionId: 'TXN-ABC123XYZ', date: new Date() },
                { _id: '2', donorName: { en: 'Fariha Jahan' }, email: 'fariha@design.com', amount: 15000, paymentMethod: 'Nagad', transactionId: 'TXN-POI987ASD', date: new Date() }
              ].map(donation => (
                <tr key={donation._id} className="border-b border-slate-800 hover:bg-slate-850">
                  <td className="px-6 py-4 font-bold text-slate-200">{donation.donorName.en}</td>
                  <td className="px-6 py-4">{donation.email}</td>
                  <td className="px-6 py-4 text-secondary font-bold">৳{donation.amount}</td>
                  <td className="px-6 py-4">{donation.paymentMethod}</td>
                  <td className="px-6 py-4 font-mono text-xs">{donation.transactionId}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{donation.date.toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsTracker;
