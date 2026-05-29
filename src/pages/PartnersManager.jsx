import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { convertBanglishToBengali } from '../utils/banglish';
import { getImageUrl } from '../utils/image';
import { Plus, Trash, Edit, X, Upload, Link2, Handshake, Globe, ExternalLink, Shield, Save } from 'lucide-react';

const PartnersManager = () => {
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [nameEn, setNameEn] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [banglishInput, setBanglishInput] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [type, setType] = useState('other');
  const [website, setWebsite] = useState('');
  const [priority, setPriority] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = () => {
    setLoading(true);
    // Passing all=true to fetch inactive partners too
    api.get('/partners?all=true')
      .then(res => {
        if (res.data.success) {
          setPartners(res.data.data);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  const handleBanglishChange = (e) => {
    const val = e.target.value;
    setBanglishInput(val);
    const converted = convertBanglishToBengali(val);
    setNameBn(converted);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setEditingPartner(null);
    setNameEn('');
    setNameBn('');
    setBanglishInput('');
    setLogoFile(null);
    setLogoPreview('');
    setType('other');
    setWebsite('');
    setPriority(10);
    setIsActive(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      setMessage('Please select a partner logo image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', JSON.stringify({ en: nameEn, bn: nameBn }));
      formData.append('type', type);
      formData.append('website', website);
      formData.append('priority', priority);
      formData.append('isActive', isActive);
      formData.append('logo', logoFile);

      const token = localStorage.getItem('accessToken');
      const res = await api.post('/partners', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setMessage('Partner added successfully!');
        resetForm();
        fetchPartners();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add partner.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', JSON.stringify({ en: nameEn, bn: nameBn }));
      formData.append('type', type);
      formData.append('website', website);
      formData.append('priority', priority);
      formData.append('isActive', isActive);
      
      if (logoFile) {
        formData.append('logo', logoFile);
      } else if (editingPartner.logo) {
        formData.append('logo', editingPartner.logo);
      }

      const token = localStorage.getItem('accessToken');
      const res = await api.put(`/partners/${editingPartner._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setMessage('Partner updated successfully!');
        resetForm();
        fetchPartners();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update partner.');
    }
  };

  const startEdit = (partner) => {
    setEditingPartner(partner);
    setNameEn(partner.name?.en || '');
    setNameBn(partner.name?.bn || '');
    setBanglishInput('');
    setLogoFile(null);
    setLogoPreview(getImageUrl(partner.logo));
    setType(partner.type || 'other');
    setWebsite(partner.website || '');
    setPriority(partner.priority ?? 10);
    setIsActive(partner.isActive ?? true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner/sponsor?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.delete(`/partners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchPartners();
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Failed to delete partner.');
    }
  };

  const getPartnerTypeLabel = (t) => {
    switch (t) {
      case 'local_gov': return 'Local Government';
      case 'ngo_partner': return 'NGO / Development';
      case 'scholarship_sponsor': return 'Scholarship Sponsor';
      case 'tech_partner': return 'Tech & Digital';
      default: return 'Other Partner';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Section */}
      <div className="lg:col-span-5 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          {editingPartner ? <Edit size={20} className="text-secondary" /> : <Plus size={20} className="text-secondary" />}
          <span>{editingPartner ? 'Edit Partner / Sponsor' : 'Add New Partner / Sponsor'}</span>
        </h3>

        {message && (
          <div className="p-3 bg-slate-800 text-secondary text-sm font-semibold rounded-lg border border-slate-700">
            {message}
          </div>
        )}

        <form onSubmit={editingPartner ? handleUpdate : handleCreate} className="space-y-4 text-sm">
          {/* Transliteration Field */}
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="block text-xs font-bold text-secondary uppercase">⌨️ Smart Banglish Keyboard</span>
            <input
              type="text"
              placeholder="Type Banglish (e.g., dhuapalong union parishad)..."
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm focus:outline-none focus:border-secondary text-slate-100"
              value={banglishInput}
              onChange={handleBanglishChange}
            />
            <span className="block text-xxs text-gray-500">Auto-converts to Bengali name input below</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Bengali Name</label>
            <input
              type="text"
              placeholder="বাংলা নাম"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 font-bn"
              value={nameBn}
              onChange={(e) => setNameBn(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">English Name</label>
            <input
              type="text"
              placeholder="English Name"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category Type</label>
              <select
                className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-350 focus:outline-none focus:border-primary"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="local_gov">Local Government</option>
                <option value="ngo_partner">NGO / Development</option>
                <option value="scholarship_sponsor">Scholarship Sponsor</option>
                <option value="tech_partner">Tech & Digital</option>
                <option value="other">Other Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Priority (Ascending Order)</label>
              <input
                type="number"
                placeholder="e.g. 1 (Top), 10 (Default)"
                className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {/* Logo Upload Section */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Partner Logo</label>
            <div className="bg-slate-800/40 p-4 rounded-lg border border-dashed border-slate-700 text-center relative hover:border-slate-650 transition">
              {logoPreview ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <img src={logoPreview} alt="Logo Preview" className="h-16 w-auto object-contain bg-slate-900 p-2 rounded border border-slate-800" />
                  <span className="text-xs text-gray-500 font-semibold">{logoFile ? logoFile.name : 'Current Logo'}</span>
                  <label className="cursor-pointer text-xs font-bold text-secondary uppercase hover:underline">
                    Change Logo Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <Upload className="mx-auto text-secondary mb-2" size={24} />
                  <span className="text-xs font-bold text-slate-300 block uppercase">Upload Logo File</span>
                  <span className="text-xxs text-slate-500 block mt-0.5">PNG or JPEG preferred (transparent bg)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required={!editingPartner}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="isActive" className="text-xs font-bold text-slate-400 uppercase cursor-pointer select-none">Active / Show on Website</label>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            {editingPartner && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded shadow transition flex items-center justify-center space-x-1.5 text-sm"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-secondary hover:bg-yellow-500 text-white font-bold py-2.5 rounded shadow-lg transition text-sm flex items-center justify-center space-x-2"
            >
              {editingPartner ? <Save size={16} /> : <Plus size={16} />}
              <span>{editingPartner ? 'Save Changes' : 'Add Partner'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="lg:col-span-7 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Handshake size={22} className="text-secondary" />
            <span>Partners & Sponsors Directory</span>
          </h3>
          <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold">
            Total: {partners.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm font-semibold">Loading partners list...</div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm font-semibold">No partners or sponsors found in the system.</div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
            {partners.map(partner => (
              <div
                key={partner._id}
                className={`bg-slate-900/60 p-4 rounded-xl border transition-all ${
                  partner.isActive ? 'border-slate-850 hover:border-slate-700' : 'border-red-950/40 opacity-70'
                } flex items-center justify-between`}
              >
                <div className="flex items-center space-x-4">
                  {/* Partner Logo */}
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 w-16 h-16 flex items-center justify-center">
                    <img
                      src={getImageUrl(partner.logo)}
                      alt={partner.name?.en}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Partner Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xxs font-bold rounded-full bg-slate-850 text-slate-450 border border-slate-800">
                        {getPartnerTypeLabel(partner.type)}
                      </span>
                      <span className="px-2 py-0.5 text-xxs font-bold rounded-full bg-slate-850 text-slate-400 border border-slate-800">
                        Priority: {partner.priority}
                      </span>
                      {!partner.isActive && (
                        <span className="px-2 py-0.5 text-xxs font-bold rounded bg-red-950/80 text-red-400 border border-red-900/40">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-100 text-sm font-bn">{partner.name?.bn}</h4>
                    <h5 className="text-xs text-slate-400 font-semibold">{partner.name?.en}</h5>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xxs text-secondary hover:underline flex items-center space-x-0.5"
                      >
                        <Globe size={10} />
                        <span>{partner.website}</span>
                        <ExternalLink size={8} />
                      </a>
                    )}
                  </div>
                </div>

                {/* CRUD Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(partner)}
                    className="p-2 text-slate-450 hover:text-secondary hover:bg-slate-800 rounded transition"
                    title="Edit Details"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(partner._id)}
                    className="p-2 text-slate-450 hover:text-red-400 hover:bg-red-950/20 rounded transition"
                    title="Delete Partner"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersManager;
