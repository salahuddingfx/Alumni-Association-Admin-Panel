import React, { useEffect, useState } from 'react';
import api, { API_URL } from '../api/api';
import {
  Save, AlertCircle, CheckCircle, Settings, Image, Globe,
  Video, Trash2, Plus, Upload, Monitor, Phone, Mail,
  MapPin, Facebook, Youtube, Linkedin, Link, Eye, EyeOff,
  ChevronDown, ChevronUp, Clock, Star
} from 'lucide-react';

// ─── FORM INPUT HELPER ───────────────────────────────────────────────────────
const FormField = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
    {children}
    {hint && <p className="text-xs text-slate-600">{hint}</p>}
  </div>
);

const Input = ({ ...props }) => (
  <input
    {...props}
    className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all placeholder-slate-600"
  />
);

const Textarea = ({ ...props }) => (
  <textarea
    {...props}
    className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all placeholder-slate-600 resize-none"
  />
);

// ─── SLIDE PREVIEW CARD ──────────────────────────────────────────────────────
const SlideCard = ({ slide, index, onDelete, API_URL }) => {
  const [expanded, setExpanded] = useState(false);
  const imageUrl = slide.image?.startsWith('http')
    ? slide.image
    : `${API_URL}${slide.image}`;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
            <img src={imageUrl} alt={slide.titleEn} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-200 truncate max-w-xs">{slide.titleEn || slide.titleBn || 'Untitled Slide'}</p>
            <div className="flex items-center space-x-2 mt-0.5">
              {slide.hasCountdown && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Countdown</span>}
              {slide.hasDonation && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">Donation</span>}
              {slide.btnLink && <span className="text-[9px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded truncate">{slide.btnLink}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">#{index + 1}</span>
          <button onClick={() => setExpanded(v => !v)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => onDelete(index)}
            className="p-1.5 rounded-lg hover:bg-red-500/15 text-red-400 transition"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-800 pt-3 grid grid-cols-2 gap-3 text-xs">
          <div><span className="text-slate-500 block">Title (Bangla)</span><span className="text-slate-300 font-bn">{slide.titleBn}</span></div>
          <div><span className="text-slate-500 block">Title (English)</span><span className="text-slate-300">{slide.titleEn}</span></div>
          <div><span className="text-slate-500 block">Subtitle (Bangla)</span><span className="text-slate-300 font-bn">{slide.subtitleBn}</span></div>
          <div><span className="text-slate-500 block">Subtitle (English)</span><span className="text-slate-300">{slide.subtitleEn}</span></div>
          <div><span className="text-slate-500 block">Button Text (Bn)</span><span className="text-slate-300 font-bn">{slide.btnTextBn}</span></div>
          <div><span className="text-slate-500 block">Button Text (En)</span><span className="text-slate-300">{slide.btnTextEn}</span></div>
          <div className="col-span-2"><span className="text-slate-500 block">Button Link</span><span className="text-secondary">{slide.btnLink}</span></div>
        </div>
      )}
    </div>
  );
};

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general', label: 'General Info', icon: <Settings size={15} /> },
  { id: 'slider', label: 'Hero Slider', icon: <Monitor size={15} /> },
  { id: 'social', label: 'Social Media', icon: <Globe size={15} /> },
  { id: 'media', label: 'Video & Media', icon: <Video size={15} /> },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const CmsSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
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
  const [welcomeText, setWelcomeText] = useState('');

  // Social links
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');

  // Media / Video
  const [introVideoUrl, setIntroVideoUrl] = useState('');

  // Hero Slider
  const [slides, setSlides] = useState([]);
  const [slideImageFile, setSlideImageFile] = useState(null);
  const [slideImageFileName, setSlideImageFileName] = useState('');
  const [slideImagePreview, setSlideImagePreview] = useState('');
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
    fetchGeneralSettings();
    fetchSlides();
  }, []);

  const fetchGeneralSettings = async () => {
    try {
      const [genRes, welcomeRes] = await Promise.all([
        api.get(`${API_URL}/api/v1/settings/general_settings`),
        api.get(`${API_URL}/api/v1/settings/welcome_text`),
      ]);
      if (genRes.data.success && genRes.data.data) {
        const val = genRes.data.data;
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
        setIntroVideoUrl(val.introVideoUrl || '');
      }
      if (welcomeRes.data.success && welcomeRes.data.data) {
        setWelcomeText(welcomeRes.data.data.welcomeText || '');
      }
    } catch (err) {
      console.log('Error fetching settings:', err);
    }
  };

  const fetchSlides = async () => {
    try {
      const res = await api.get(`${API_URL}/api/v1/settings/hero_slides`);
      if (res.data.success && res.data.data && Array.isArray(res.data.data.slides)) {
        setSlides(res.data.data.slides);
      }
    } catch (err) {
      console.log('Error fetching slides:', err);
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const getRes = await api.get(`${API_URL}/api/v1/settings/general_settings`);
      const existing = getRes.data.success && getRes.data.data ? getRes.data.data : {};
      const newValue = {
        ...existing,
        schoolNameEn, schoolNameBn,
        siteTitleEn, siteTitleBn,
        email, phone, addressEn, addressBn,
        facebook, linkedin, youtube, introVideoUrl
      };
      const res = await api.put(`${API_URL}/api/v1/settings/general_settings`, { value: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) showSuccess('General settings saved successfully!');
    } catch (err) {
      showError('Failed to save general settings');
    }
  };

  const handleSaveWelcome = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`${API_URL}/api/v1/settings/welcome_text`, { value: { welcomeText } }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) showSuccess('Welcome text updated!');
    } catch (err) {
      showError('Failed to update welcome text');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSlideImageFile(file);
    setSlideImageFileName(file.name);
    setSlideImagePreview(URL.createObjectURL(file));
  };

  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!slideImageFile) { alert('Please select a slide image.'); return; }
    try {
      setUploadingSlide(true);
      const token = localStorage.getItem('accessToken');
      const uploadData = new FormData();
      uploadData.append('image', slideImageFile);
      const uploadRes = await api.post(`${API_URL}/api/v1/settings/upload`, uploadData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (!uploadRes.data.success || !uploadRes.data.data.url) throw new Error('Upload failed');
      const imageUrl = uploadRes.data.data.url;
      const newSlide = { image: imageUrl, titleBn: slideTitleBn, titleEn: slideTitleEn, subtitleBn: slideSubtitleBn, subtitleEn: slideSubtitleEn, btnTextBn: slideBtnTextBn, btnTextEn: slideBtnTextEn, btnLink: slideBtnLink, hasCountdown: slideHasCountdown, hasDonation: slideHasDonation };
      const updatedSlides = [...slides, newSlide];
      const res = await api.put(`${API_URL}/api/v1/settings/hero_slides`, { value: { slides: updatedSlides } }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) {
        setSlides(updatedSlides);
        setSlideImageFile(null); setSlideImageFileName(''); setSlideImagePreview('');
        setSlideTitleBn(''); setSlideTitleEn(''); setSlideSubtitleBn(''); setSlideSubtitleEn('');
        setSlideBtnTextBn(''); setSlideBtnTextEn(''); setSlideBtnLink('');
        setSlideHasCountdown(false); setSlideHasDonation(false);
        showSuccess('Slide added successfully!');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add slide');
    } finally {
      setUploadingSlide(false);
    }
  };

  const handleDeleteSlide = async (indexToDelete) => {
    if (!window.confirm('Delete this slide?')) return;
    const updatedSlides = slides.filter((_, idx) => idx !== indexToDelete);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`${API_URL}/api/v1/settings/hero_slides`, { value: { slides: updatedSlides } }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) { setSlides(updatedSlides); showSuccess('Slide deleted!'); }
    } catch (err) {
      showError('Failed to delete slide');
    }
  };

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(''), 3500); };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100">CMS Settings</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Manage your site's general information, hero slider, social links, and media</p>
      </div>

      {/* Toast notifications */}
      {success && (
        <div className="flex items-center space-x-2 p-3 bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-500/20 sticky top-4 z-50 backdrop-blur-md animate-fadeIn">
          <CheckCircle size={16} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-500/10 text-red-400 text-sm font-semibold rounded-xl border border-red-500/20 sticky top-4 z-50 backdrop-blur-md animate-fadeIn">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-slate-900 rounded-xl p-1 border border-slate-800">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── TAB: GENERAL INFO ──────────────────────────────── */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <Settings size={16} className="text-secondary" />
              <span>Organization Information</span>
            </h3>

            <form onSubmit={handleSaveGeneral} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="School Name (English)">
                  <Input value={schoolNameEn} onChange={e => setSchoolNameEn(e.target.value)} placeholder="e.g. Dhuapalong Govt. Primary School" />
                </FormField>
                <FormField label="School Name (বাংলা)">
                  <Input value={schoolNameBn} onChange={e => setSchoolNameBn(e.target.value)} placeholder="e.g. ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়" className="font-bn" />
                </FormField>
                <FormField label="Site Title (English)">
                  <Input value={siteTitleEn} onChange={e => setSiteTitleEn(e.target.value)} placeholder="e.g. Practon Alumni Association" />
                </FormField>
                <FormField label="Site Title (বাংলা)">
                  <Input value={siteTitleBn} onChange={e => setSiteTitleBn(e.target.value)} placeholder="e.g. প্রাক্তন শিক্ষার্থী পরিষদ" className="font-bn" />
                </FormField>
                <FormField label="Contact Email">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="info@example.org" className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all" />
                  </div>
                </FormField>
                <FormField label="Contact Phone">
                  <div className="relative">
                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+880 1234 567890" className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all" />
                  </div>
                </FormField>
                <FormField label="Address (English)">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-slate-500" />
                    <Textarea value={addressEn} onChange={e => setAddressEn(e.target.value)} rows={2} placeholder="Full address in English" className="pl-9" />
                  </div>
                </FormField>
                <FormField label="Address (বাংলা)">
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-slate-500" />
                    <Textarea value={addressBn} onChange={e => setAddressBn(e.target.value)} rows={2} placeholder="সম্পূর্ণ ঠিকানা বাংলায়" className="pl-9 font-bn" />
                  </div>
                </FormField>
              </div>
              <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded-lg shadow transition text-sm">
                <Save size={15} />
                <span>Save General Settings</span>
              </button>
            </form>
          </div>

          {/* Welcome Text */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <Star size={16} className="text-secondary" />
              <span>Homepage Welcome Text</span>
            </h3>
            <form onSubmit={handleSaveWelcome} className="space-y-4">
              <FormField label="Welcome Title (shown on homepage hero intro)" hint="This is the short welcome banner headline shown on the homepage introduction section.">
                <Input value={welcomeText} onChange={e => setWelcomeText(e.target.value)} placeholder="স্বাগতম প্রাক্তন পরিষদে" />
              </FormField>
              <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded-lg shadow transition text-sm">
                <Save size={15} />
                <span>Save Welcome Text</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB: HERO SLIDER ───────────────────────────────── */}
      {activeTab === 'slider' && (
        <div className="space-y-6">
          {/* Existing Slides List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
                <Monitor size={16} className="text-secondary" />
                <span>Current Slides ({slides.length})</span>
              </h3>
            </div>
            {slides.length > 0 ? (
              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <SlideCard key={index} slide={slide} index={index} onDelete={handleDeleteSlide} API_URL={API_URL} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-slate-600 font-semibold border border-dashed border-slate-800 rounded-xl">
                No slides added yet. Add your first slide below.
              </div>
            )}
          </div>

          {/* Add New Slide Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
              <Plus size={16} className="text-secondary" />
              <span>Add New Slide</span>
            </h3>

            <form onSubmit={handleAddSlide} className="space-y-5">
              {/* Image Upload */}
              <FormField label="Slide Background Image" hint="Recommended: 1920×1080px or wider. JPG/PNG/WebP.">
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-700 hover:border-secondary rounded-xl cursor-pointer transition-all group bg-slate-950/50">
                  {slideImagePreview ? (
                    <img src={slideImagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-slate-600 group-hover:text-secondary transition">
                      <Upload size={24} />
                      <span className="text-xs font-semibold">Click to upload image</span>
                      <span className="text-[10px]">{slideImageFileName || 'PNG, JPG up to 10MB'}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Title (বাংলা)">
                  <Input value={slideTitleBn} onChange={e => setSlideTitleBn(e.target.value)} placeholder="বাংলায় শিরোনাম" className="font-bn" />
                </FormField>
                <FormField label="Title (English)">
                  <Input value={slideTitleEn} onChange={e => setSlideTitleEn(e.target.value)} placeholder="Slide Title in English" />
                </FormField>
                <FormField label="Subtitle (বাংলা)">
                  <Textarea value={slideSubtitleBn} onChange={e => setSlideSubtitleBn(e.target.value)} rows={2} placeholder="বাংলায় উপশিরোনাম" className="font-bn" />
                </FormField>
                <FormField label="Subtitle (English)">
                  <Textarea value={slideSubtitleEn} onChange={e => setSlideSubtitleEn(e.target.value)} rows={2} placeholder="Slide subtitle in English" />
                </FormField>
                <FormField label="Button Text (বাংলা)">
                  <Input value={slideBtnTextBn} onChange={e => setSlideBtnTextBn(e.target.value)} placeholder="e.g. আরও জানুন" className="font-bn" />
                </FormField>
                <FormField label="Button Text (English)">
                  <Input value={slideBtnTextEn} onChange={e => setSlideBtnTextEn(e.target.value)} placeholder="e.g. Learn More" />
                </FormField>
                <FormField label="Button Link (URL or /route)" hint="e.g. /events or https://example.com">
                  <div className="relative">
                    <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input value={slideBtnLink} onChange={e => setSlideBtnLink(e.target.value)} placeholder="/events" className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all" />
                  </div>
                </FormField>
              </div>

              {/* Feature Toggles */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <div
                    onClick={() => setSlideHasCountdown(v => !v)}
                    className={`w-10 h-5 rounded-full transition-all duration-200 relative ${slideHasCountdown ? 'bg-secondary' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${slideHasCountdown ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-300">Show Countdown Timer</span>
                    <span className="block text-[10px] text-slate-600">Displays a live countdown to the nearest upcoming event</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <div
                    onClick={() => setSlideHasDonation(v => !v)}
                    className={`w-10 h-5 rounded-full transition-all duration-200 relative ${slideHasDonation ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${slideHasDonation ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-300">Show Donation Progress</span>
                    <span className="block text-[10px] text-slate-600">Displays a donation progress bar on this slide</span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={uploadingSlide}
                className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded-lg shadow transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploadingSlide ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Uploading...</span></>
                ) : (
                  <><Plus size={15} /><span>Add Slide</span></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── TAB: SOCIAL MEDIA ──────────────────────────────── */}
      {activeTab === 'social' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <Globe size={16} className="text-secondary" />
            <span>Social Media Links</span>
          </h3>
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <FormField label="Facebook Page URL">
              <div className="relative">
                <Facebook size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                <input value={facebook} onChange={e => setFacebook(e.target.value)} type="url" placeholder="https://facebook.com/yourpage" className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all" />
              </div>
            </FormField>
            <FormField label="LinkedIn Profile URL">
              <div className="relative">
                <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} type="url" placeholder="https://linkedin.com/in/yourprofile" className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all" />
              </div>
            </FormField>
            <FormField label="YouTube Channel URL">
              <div className="relative">
                <Youtube size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                <input value={youtube} onChange={e => setYoutube(e.target.value)} type="url" placeholder="https://youtube.com/@yourchannel" className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all" />
              </div>
            </FormField>
            <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded-lg shadow transition text-sm">
              <Save size={15} />
              <span>Save Social Links</span>
            </button>
          </form>
        </div>
      )}

      {/* ─── TAB: VIDEO & MEDIA ─────────────────────────────── */}
      {activeTab === 'media' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2">
            <Video size={16} className="text-secondary" />
            <span>Introduction Video</span>
          </h3>
          <form onSubmit={handleSaveGeneral} className="space-y-5">
            <FormField
              label="Intro Video URL"
              hint="Supports YouTube, Facebook, Cloudinary, and direct video URLs. The video is shown in the 'Mission & Vision' section on the homepage."
            >
              <div className="relative">
                <Video size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={introVideoUrl}
                  onChange={e => setIntroVideoUrl(e.target.value)}
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-900 text-slate-100 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-secondary transition-all"
                />
              </div>
            </FormField>

            {introVideoUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-700 aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={introVideoUrl.includes('watch?v=') ? introVideoUrl.replace('watch?v=', 'embed/') : introVideoUrl}
                  title="Video Preview"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">Supported Video Sources:</p>
              <ul className="space-y-0.5 list-disc list-inside">
                <li><span className="text-red-400">YouTube</span> — https://youtube.com/watch?v=... or https://youtu.be/...</li>
                <li><span className="text-blue-400">Facebook</span> — https://facebook.com/... (public videos only)</li>
                <li><span className="text-purple-400">Cloudinary</span> — https://res.cloudinary.com/... (direct video link)</li>
                <li><span className="text-slate-400">Direct URL</span> — Any direct .mp4 / .webm / .ogg link</li>
              </ul>
            </div>

            <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded-lg shadow transition text-sm">
              <Save size={15} />
              <span>Save Video Settings</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CmsSettings;
