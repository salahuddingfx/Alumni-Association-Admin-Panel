import React, { useEffect, useState } from 'react';
import api, { API_URL } from '../api/api';
import { Save, Plus, Trash, History, MessageSquare, AlertCircle, Layout, Upload, CheckCircle } from 'lucide-react';

const CmsSettings = () => {
  const [welcomeText, setWelcomeText] = useState('স্বাগতম প্রাক্তন পরিষদে');
  const [slides, setSlides] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // General settings state
  const [schoolNameEn, setSchoolNameEn] = useState('Dhuapalong Govt. Primary School');
  const [schoolNameBn, setSchoolNameBn] = useState('ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়');
  const [siteTitleEn, setSiteTitleEn] = useState('Practon Alumni Association');
  const [siteTitleBn, setSiteTitleBn] = useState('প্রাক্তন শিক্ষার্থী পরিষদ');
  const [email, setEmail] = useState('info@practonalumni.org');
  const [phone, setPhone] = useState('+880 1234 567890');
  const [addressEn, setAddressEn] = useState("Dhuapalong, Cox's Bazar, Bangladesh");
  const [addressBn, setAddressBn] = useState('ধোয়াপালং, কক্সবাজার, বাংলাদেশ');
  const [facebook, setFacebook] = useState('https://facebook.com');
  const [linkedin, setLinkedin] = useState('https://linkedin.com');
  const [youtube, setYoutube] = useState('https://youtube.com');
  const [bkash, setBkash] = useState('+880 1700 000000');
  const [nagad, setNagad] = useState('+880 1800 000000');
  const [rocket, setRocket] = useState('+880 1900 000000');

  // Add slide state
  const [slideImageFile, setSlideImageFile] = useState(null);
  const [slideImageFileName, setSlideImageFileName] = useState('');
  const [slideTitleBn, setSlideTitleBn] = useState('');
  const [slideTitleEn, setSlideTitleEn] = useState('');
  const [slideSubtitleBn, setSlideSubtitleBn] = useState('');
  const [slideSubtitleEn, setSlideSubtitleEn] = useState('');
  const [slideBtnTextBn, setSlideBtnTextBn] = useState('');
  const [slideBtnTextEn, setSlideBtnTextEn] = useState('');
  const [slideBtnLink, setSlideBtnLink] = useState('');
  const [slideHasCountdown, setSlideHasCountdown] = useState(false);
  const [slideHasDonation, setSlideHasDonation] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchGeneralSettings();
  }, []);

  const fetchGeneralSettings = async () => {
    try {
      const res = await api.get(`${API_URL}/api/v1/settings/general_settings`);
      if (res.data.success && res.data.data) {
        const val = res.data.data;
        setSchoolNameEn(val.schoolNameEn || '');
        setSchoolNameBn(val.schoolNameBn || '');
        setSiteTitleEn(val.siteTitleEn || '');
        setSiteTitleBn(val.siteTitleBn || '');
        setEmail(val.email || '');
        setPhone(val.phone || '');
        setAddressEn(val.addressEn || '');
        setAddressBn(val.addressBn || '');
        setFacebook(val.facebook || '');
        setLinkedin(val.linkedin || '');
        setYoutube(val.youtube || '');
        setBkash(val.bkash || '');
        setNagad(val.nagad || '');
        setRocket(val.rocket || '');
      }
    } catch (err) {
      console.log('Error fetching general settings:', err);
    }
  };

  const handleSaveGeneralSettings = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`${API_URL}/api/v1/settings/general_settings`, {
        value: {
          schoolNameEn,
          schoolNameBn,
          siteTitleEn,
          siteTitleBn,
          email,
          phone,
          addressEn,
          addressBn,
          facebook,
          linkedin,
          youtube,
          bkash,
          nagad,
          rocket
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        showSuccess('General settings updated successfully!');
      }
    } catch (err) {
      showError('Failed to update general settings');
    }
  };

  const fetchSettings = async () => {
    try {
      const welcomeRes = await api.get(`${API_URL}/api/v1/settings/welcome_text`);
      if (welcomeRes.data.success && welcomeRes.data.data) {
        setWelcomeText(welcomeRes.data.data.welcomeText || '');
      }

      const slidesRes = await api.get(`${API_URL}/api/v1/settings/hero_slides`);
      if (slidesRes.data.success && slidesRes.data.data && Array.isArray(slidesRes.data.data.slides)) {
        setSlides(slidesRes.data.data.slides);
      }
    } catch (err) {
      console.log('Error fetching settings:', err);
    }
  };

  const handleSaveWelcome = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`${API_URL}/api/v1/settings/welcome_text`, {
        value: { welcomeText }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        showSuccess('Homepage title updated successfully!');
      }
    } catch (err) {
      showError('Failed to update welcome title');
    }
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!slideImageFile) {
      alert('Please select an image for the slide');
      return;
    }

    try {
      setUploadingSlide(true);
      const token = localStorage.getItem('accessToken');

      // 1. Upload slide image file first
      const uploadData = new FormData();
      uploadData.append('image', slideImageFile);
      const uploadRes = await api.post(`${API_URL}/api/v1/settings/upload`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!uploadRes.data.success || !uploadRes.data.data.url) {
        throw new Error('Failed to upload slide image file');
      }

      const imageUrl = uploadRes.data.data.url;

      // 2. Append new slide configurations
      const newSlide = {
        image: imageUrl,
        titleBn: slideTitleBn,
        titleEn: slideTitleEn,
        subtitleBn: slideSubtitleBn,
        subtitleEn: slideSubtitleEn,
        btnTextBn: slideBtnTextBn,
        btnTextEn: slideBtnTextEn,
        btnLink: slideBtnLink,
        hasCountdown: slideHasCountdown,
        hasDonation: slideHasDonation
      };

      const updatedSlides = [...slides, newSlide];

      const res = await api.put(`${API_URL}/api/v1/settings/hero_slides`, {
        value: { slides: updatedSlides }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSlides(updatedSlides);
        setSlideImageFile(null);
        setSlideImageFileName('');
        setSlideTitleBn('');
        setSlideTitleEn('');
        setSlideSubtitleBn('');
        setSlideSubtitleEn('');
        setSlideBtnTextBn('');
        setSlideBtnTextEn('');
        setSlideBtnLink('');
        setSlideHasCountdown(false);
        setSlideHasDonation(false);
        showSuccess('Slider image and configurations added successfully!');
      }
    } catch (err) {
      console.log(err);
      showError(err.response?.data?.message || 'Failed to save slide');
    } finally {
      setUploadingSlide(false);
    }
  };

  const handleDeleteSlide = async (indexToDelete) => {
    if (!window.confirm('Delete this slide from homepage slider?')) return;
    const updatedSlides = slides.filter((_, idx) => idx !== indexToDelete);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`${API_URL}/api/v1/settings/hero_slides`, {
        value: { slides: updatedSlides }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSlides(updatedSlides);
        showSuccess('Slide deleted successfully!');
      }
    } catch (err) {
      showError('Failed to delete slide');
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3500);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 font-bn">হোমপেজ তথ্য পরিবর্তন (Homepage CMS)</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Manage Homepage Welcome Title & Hero Banner Slides</p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-lg border border-emerald-500/20 sticky top-4 z-50 backdrop-blur-md">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-500/10 text-red-400 text-sm font-semibold rounded-lg border border-red-500/20 sticky top-4 z-50 backdrop-blur-md flex items-center space-x-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Welcome Title */}
        <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Save size={18} className="text-secondary" />
            <span>Homepage Welcome Title</span>
          </h3>
          <form onSubmit={handleSaveWelcome} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Welcome Text Title (Bengali)</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 font-bn text-sm"
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-secondary hover:bg-yellow-500 text-white font-bold px-4 py-2 rounded shadow transition flex items-center space-x-1.5"
            >
              <Save size={14} />
              <span>Save Welcome Title</span>
            </button>
          </form>
        </div>

        {/* Hero Slider settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Create form */}
          <div className="lg:col-span-5 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Plus size={18} className="text-secondary" />
              <span>Create Homepage Slide</span>
            </h3>

            <form onSubmit={handleAddSlide} className="space-y-3.5 text-xs">
              {/* Photo File Selector */}
              <div className="bg-slate-800/40 p-4 rounded-lg border border-dashed border-slate-700 text-center">
                <label className="cursor-pointer block">
                  <Upload className="mx-auto text-secondary mb-2" size={20} />
                  <span className="text-xs font-bold text-slate-300 block uppercase">Upload Slide Background</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files[0]) {
                        setSlideImageFile(e.target.files[0]);
                        setSlideImageFileName(e.target.files[0].name);
                      }
                    }}
                    required
                  />
                </label>
                {slideImageFileName && <span className="text-xs text-gray-500 font-semibold mt-1 block">Selected: {slideImageFileName}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Slide Title (Bengali)</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100 font-bn" value={slideTitleBn} onChange={(e) => setSlideTitleBn(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Slide Title (English)</label>
                  <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100" value={slideTitleEn} onChange={(e) => setSlideTitleEn(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Slide Subtitle / Body (Bengali)</label>
                <textarea rows={2} className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100 font-bn" value={slideSubtitleBn} onChange={(e) => setSlideSubtitleBn(e.target.value)} required />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Slide Subtitle / Body (English)</label>
                <textarea rows={2} className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100" value={slideSubtitleEn} onChange={(e) => setSlideSubtitleEn(e.target.value)} required />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Btn Text (Bn)</label>
                  <input type="text" placeholder="যুক্ত হোন" className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100 font-bn" value={slideBtnTextBn} onChange={(e) => setSlideBtnTextBn(e.target.value)} />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Btn Text (En)</label>
                  <input type="text" placeholder="Join Us" className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100" value={slideBtnTextEn} onChange={(e) => setSlideBtnTextEn(e.target.value)} />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Btn Link Route</label>
                  <input type="text" placeholder="/register" className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100" value={slideBtnLink} onChange={(e) => setSlideBtnLink(e.target.value)} />
                </div>
              </div>

              {/* Overlays toggles */}
              <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-3 rounded border border-slate-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="countdown_toggle"
                    checked={slideHasCountdown}
                    onChange={(e) => setSlideHasCountdown(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-primary h-4 w-4"
                  />
                  <label htmlFor="countdown_toggle" className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Reunion Countdown</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="donation_toggle"
                    checked={slideHasDonation}
                    onChange={(e) => setSlideHasDonation(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-primary h-4 w-4"
                  />
                  <label htmlFor="donation_toggle" className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Donation Progress</label>
                </div>
              </div>

              <button
                type="submit"
                disabled={uploadingSlide}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded shadow transition text-xs uppercase"
              >
                {uploadingSlide ? 'Uploading file and saving...' : 'Save & Publish Slide'}
              </button>
            </form>
          </div>

          {/* List slides */}
          <div className="lg:col-span-7 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Active Hero Slides ({slides.length})</h3>
            {slides.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold text-xs">
                Showing default slides layout. Upload customized slides above.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[550px] pr-2">
                {slides.map((slide, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-10 bg-slate-800 rounded overflow-hidden shrink-0 border border-slate-700">
                        <img src={slide.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 line-clamp-1">{slide.titleEn}</h4>
                        <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{slide.subtitleEn}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          {slide.hasCountdown && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 rounded text-[9px] font-bold">COUNTDOWN</span>}
                          {slide.hasDonation && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1 rounded text-[9px] font-bold">DONATION</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteSlide(idx)} className="text-slate-500 hover:text-red-400 p-1.5 transition">
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* General Settings Section */}
        <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4 mt-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Layout size={18} className="text-secondary" />
            <span>General Organization & System Settings</span>
          </h3>
          
          <form onSubmit={handleSaveGeneralSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Site Titles */}
              <div>
                <label className="block text-slate-400 mb-1">Site Title (Bengali)</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm font-bn"
                  value={siteTitleBn}
                  onChange={(e) => setSiteTitleBn(e.target.value)}
                  placeholder="প্রাক্তন শিক্ষার্থী পরিষদ"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Site Title (English)</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={siteTitleEn}
                  onChange={(e) => setSiteTitleEn(e.target.value)}
                  placeholder="Practon Alumni Association"
                  required
                />
              </div>

              {/* School Names */}
              <div>
                <label className="block text-slate-400 mb-1">School Name (Bengali)</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm font-bn"
                  value={schoolNameBn}
                  onChange={(e) => setSchoolNameBn(e.target.value)}
                  placeholder="ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">School Name (English)</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={schoolNameEn}
                  onChange={(e) => setSchoolNameEn(e.target.value)}
                  placeholder="Dhuapalong Govt. Primary School"
                  required
                />
              </div>

              {/* Contact Email & Phone */}
              <div>
                <label className="block text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@school.org"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 XXXXXXXXXX"
                  required
                />
              </div>

              {/* Addresses */}
              <div>
                <label className="block text-slate-400 mb-1">Address (Bengali)</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm font-bn"
                  value={addressBn}
                  onChange={(e) => setAddressBn(e.target.value)}
                  placeholder="ধোয়াপালং, কক্সবাজার, বাংলাদেশ"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Address (English)</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  placeholder="Dhuapalong, Cox's Bazar, Bangladesh"
                  required
                />
              </div>

              {/* Social Media Links */}
              <div>
                <label className="block text-slate-400 mb-1">Facebook URL</label>
                <input
                  type="url"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">YouTube URL</label>
                <input
                  type="url"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/channel/..."
                />
              </div>

              {/* Payment Numbers */}
              <div>
                <label className="block text-slate-400 mb-1">bKash Personal Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={bkash}
                  onChange={(e) => setBkash(e.target.value)}
                  placeholder="e.g. +88017XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Nagad Personal Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={nagad}
                  onChange={(e) => setNagad(e.target.value)}
                  placeholder="e.g. +88018XXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Rocket Personal Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
                  value={rocket}
                  onChange={(e) => setRocket(e.target.value)}
                  placeholder="e.g. +88019XXXXXXXX"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded shadow transition flex items-center space-x-1.5"
              >
                <Save size={14} />
                <span>Save General Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
  );
};

export default CmsSettings;
