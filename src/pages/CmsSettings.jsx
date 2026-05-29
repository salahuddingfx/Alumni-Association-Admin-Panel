import React, { useEffect, useState, useRef } from 'react';
import api, { API_URL } from '../api/api';
import {
  Save, AlertCircle, CheckCircle, Settings, Globe,
  Video, Trash2, Plus, Upload, Monitor, Phone, Mail,
  MapPin, Facebook, Youtube, Linkedin, Link as LinkIcon,
  ChevronDown, ChevronUp, Star, Pencil, X, GripVertical,
  Image as ImageIcon, RotateCcw, ArrowUp, ArrowDown
} from 'lucide-react';

// ─── SHARED FORM HELPERS ─────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{children}</span>
);

const inp = "w-full bg-slate-950 text-slate-100 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary transition-all placeholder-slate-600";
const ta  = "w-full bg-slate-950 text-slate-100 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-secondary transition-all placeholder-slate-600 resize-none";

const Toggle = ({ on, onToggle, color = 'bg-secondary', label, hint }) => (
  <label className="flex items-center space-x-3 cursor-pointer select-none" onClick={onToggle}>
    <div className={`w-10 h-5 rounded-full transition-all duration-200 relative shrink-0 ${on ? color : 'bg-slate-700'}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
    <div>
      <span className="text-sm font-semibold text-slate-300">{label}</span>
      {hint && <span className="block text-[10px] text-slate-600">{hint}</span>}
    </div>
  </label>
);

const ImageUploadBox = ({ preview, existingUrl, onChange, label = 'Background Image', hint = 'Recommended: 1920×1080px' }) => {
  const display = preview || (existingUrl?.startsWith('http') ? existingUrl : existingUrl ? `${API_URL}${existingUrl}` : null);
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <label className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 hover:border-secondary rounded-xl cursor-pointer transition-all group overflow-hidden bg-slate-950">
        {display
          ? <img src={display} alt="Preview" className="w-full h-full object-cover" />
          : <div className="flex flex-col items-center space-y-1.5 text-slate-600 group-hover:text-secondary transition">
              <Upload size={22} />
              <span className="text-xs font-semibold">Click to upload</span>
              <span className="text-[10px]">{hint}</span>
            </div>
        }
        {display && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="text-white text-xs font-bold flex items-center space-x-1"><RotateCcw size={14} /><span>Replace Image</span></span>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={onChange} />
      </label>
    </div>
  );
};

// ─── SLIDE EDIT FORM (inline, shared by both Add and Edit modes) ──────────────
const SlideForm = ({ initial, onSave, onCancel, isSaving, isEdit = false }) => {
  const [titleBn, setTitleBn]       = useState(initial?.titleBn || '');
  const [titleEn, setTitleEn]       = useState(initial?.titleEn || '');
  const [subtitleBn, setSubBn]      = useState(initial?.subtitleBn || '');
  const [subtitleEn, setSubEn]      = useState(initial?.subtitleEn || '');
  const [btnTextBn, setBtnBn]       = useState(initial?.btnTextBn || '');
  const [btnTextEn, setBtnEn]       = useState(initial?.btnTextEn || '');
  const [btnLink, setBtnLink]       = useState(initial?.btnLink || '');
  const [hasCountdown, setCountdown]= useState(initial?.hasCountdown || false);
  const [hasDonation, setDonation]  = useState(initial?.hasDonation || false);
  const [imageFile, setImageFile]   = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEdit && !imageFile) { alert('Please select a slide image.'); return; }
    onSave({ titleBn, titleEn, subtitleBn, subtitleEn, btnTextBn, btnTextEn, btnLink, hasCountdown, hasDonation, imageFile, existingImage: initial?.image });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
      <ImageUploadBox preview={imagePreview} existingUrl={initial?.image} onChange={handleFileChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel>Title (বাংলা)</FieldLabel>
          <input className={`${inp} font-bn`} value={titleBn} onChange={e => setTitleBn(e.target.value)} placeholder="বাংলায় শিরোনাম" />
        </div>
        <div>
          <FieldLabel>Title (English)</FieldLabel>
          <input className={inp} value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="Slide Title in English" />
        </div>
        <div>
          <FieldLabel>Subtitle (বাংলা)</FieldLabel>
          <textarea className={`${ta} font-bn`} value={subtitleBn} onChange={e => setSubBn(e.target.value)} rows={2} placeholder="বাংলায় উপশিরোনাম" />
        </div>
        <div>
          <FieldLabel>Subtitle (English)</FieldLabel>
          <textarea className={ta} value={subtitleEn} onChange={e => setSubEn(e.target.value)} rows={2} placeholder="Slide subtitle in English" />
        </div>
        <div>
          <FieldLabel>Button Text (বাংলা)</FieldLabel>
          <input className={`${inp} font-bn`} value={btnTextBn} onChange={e => setBtnBn(e.target.value)} placeholder="e.g. আরও জানুন" />
        </div>
        <div>
          <FieldLabel>Button Text (English)</FieldLabel>
          <input className={inp} value={btnTextEn} onChange={e => setBtnEn(e.target.value)} placeholder="e.g. Learn More" />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Button Link (URL or /route)</FieldLabel>
          <div className="relative">
            <LinkIcon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className={`${inp} pl-9`} value={btnLink} onChange={e => setBtnLink(e.target.value)} placeholder="/events" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
        <Toggle on={hasCountdown} onToggle={() => setCountdown(v => !v)} color="bg-blue-500"   label="Show Countdown Timer"   hint="Live countdown to nearest event" />
        <Toggle on={hasDonation}  onToggle={() => setDonation(v => !v)}  color="bg-emerald-500" label="Show Donation Progress" hint="Donation progress bar on slide" />
      </div>

      <div className="flex items-center space-x-3 pt-1">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-5 py-2.5 rounded-lg shadow transition text-sm disabled:opacity-60"
        >
          {isSaving
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
            : isEdit
              ? <><Save size={14} /><span>Save Changes</span></>
              : <><Plus size={14} /><span>Add Slide</span></>
          }
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-800 transition">
            <X size={14} />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </form>
  );
};

// ─── SLIDE CARD (view + inline edit) ─────────────────────────────────────────
const SlideCard = ({ slide, index, total, onDelete, onEdit, onMoveUp, onMoveDown }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  const imageUrl = slide.image?.startsWith('http')
    ? slide.image
    : slide.image ? `${API_URL}${slide.image}` : null;

  const handleSave = async (formData) => {
    setSaving(true);
    await onEdit(index, formData);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${editing ? 'border-secondary bg-slate-950' : 'border-slate-700 bg-slate-900'}`}>
      {/* ── Row header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        {/* Thumbnail + info */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-16 h-11 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
            {imageUrl
              ? <img src={imageUrl} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
              : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-slate-600" /></div>
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-200 truncate">{slide.titleEn || slide.titleBn || 'Untitled Slide'}</p>
            <div className="flex items-center flex-wrap gap-1 mt-0.5">
              <span className="text-[9px] text-slate-500 font-mono font-bold">SLIDE #{index + 1}</span>
              {slide.hasCountdown && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">Countdown</span>}
              {slide.hasDonation  && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">Donation</span>}
              {slide.btnLink      && <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded max-w-[120px] truncate block">{slide.btnLink}</span>}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 shrink-0">
          {/* Reorder */}
          <button onClick={() => onMoveUp(index)} disabled={index === 0} className="p-1.5 rounded hover:bg-slate-800 text-slate-600 hover:text-slate-300 disabled:opacity-30 transition" title="Move Up">
            <ArrowUp size={13} />
          </button>
          <button onClick={() => onMoveDown(index)} disabled={index === total - 1} className="p-1.5 rounded hover:bg-slate-800 text-slate-600 hover:text-slate-300 disabled:opacity-30 transition" title="Move Down">
            <ArrowDown size={13} />
          </button>
          {/* Expand details */}
          {!editing && (
            <button onClick={() => setExpanded(v => !v)} className="p-1.5 rounded hover:bg-slate-800 text-slate-400 transition" title="Expand Details">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          {/* Edit */}
          <button
            onClick={() => { setEditing(v => !v); setExpanded(false); }}
            className={`p-1.5 rounded transition ${editing ? 'bg-secondary/20 text-secondary' : 'hover:bg-slate-800 text-slate-400'}`}
            title={editing ? 'Cancel Edit' : 'Edit Slide'}
          >
            {editing ? <X size={14} /> : <Pencil size={14} />}
          </button>
          {/* Delete */}
          <button onClick={() => onDelete(index)} className="p-1.5 rounded hover:bg-red-500/15 text-red-400 transition" title="Delete Slide">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Expanded detail view ──────────────────────────── */}
      {expanded && !editing && (
        <div className="px-4 pb-4 border-t border-slate-800 pt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {[
            ['Title (বাংলা)',     slide.titleBn,    true ],
            ['Title (English)',   slide.titleEn,    false],
            ['Subtitle (বাংলা)', slide.subtitleBn, true ],
            ['Subtitle (English)',slide.subtitleEn, false],
            ['Button Bn',        slide.btnTextBn,  true ],
            ['Button En',        slide.btnTextEn,  false],
          ].map(([lbl, val, bn]) => (
            <div key={lbl}>
              <span className="text-slate-600 block">{lbl}</span>
              <span className={`text-slate-300 ${bn ? 'font-bn' : ''}`}>{val || <em className="text-slate-700">—</em>}</span>
            </div>
          ))}
          <div className="col-span-2">
            <span className="text-slate-600 block">Button Link</span>
            <span className="text-secondary">{slide.btnLink || <em className="text-slate-700">—</em>}</span>
          </div>
        </div>
      )}

      {/* ── Inline edit form ──────────────────────────────── */}
      {editing && (
        <div className="px-4 pb-5 border-t border-slate-800/60 pt-2">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider py-2">Editing Slide #{index + 1}</p>
          <SlideForm
            initial={slide}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            isSaving={saving}
            isEdit={true}
          />
        </div>
      )}
    </div>
  );
};

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general', label: 'General Info',  icon: <Settings size={15} /> },
  { id: 'slider',  label: 'Hero Slider',   icon: <Monitor  size={15} /> },
  { id: 'social',  label: 'Social Media',  icon: <Globe    size={15} /> },
  { id: 'media',   label: 'Video & Media', icon: <Video    size={15} /> },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const CmsSettings = () => {
  const [activeTab,    setActiveTab]    = useState('general');
  const [success,      setSuccess]      = useState('');
  const [error,        setError]        = useState('');

  // General settings
  const [schoolNameEn, setSchoolNameEn] = useState('');
  const [schoolNameBn, setSchoolNameBn] = useState('');
  const [siteTitleEn,  setSiteTitleEn]  = useState('');
  const [siteTitleBn,  setSiteTitleBn]  = useState('');
  const [email,        setEmail]        = useState('');
  const [phone,        setPhone]        = useState('');
  const [addressEn,    setAddressEn]    = useState('');
  const [addressBn,    setAddressBn]    = useState('');
  const [welcomeText,  setWelcomeText]  = useState('');
  const [facebook,     setFacebook]     = useState('');
  const [linkedin,     setLinkedin]     = useState('');
  const [youtube,      setYoutube]      = useState('');
  const [introVideoUrl,setIntroVideoUrl]= useState('');

  // Slider
  const [slides,       setSlides]       = useState([]);
  const [addingSlide,  setAddingSlide]  = useState(false);
  const [savingSlide,  setSavingSlide]  = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [genRes, welcomeRes, slidesRes] = await Promise.all([
        api.get(`${API_URL}/api/v1/settings/general_settings`),
        api.get(`${API_URL}/api/v1/settings/welcome_text`),
        api.get(`${API_URL}/api/v1/settings/hero_slides`),
      ]);
      if (genRes.data.success && genRes.data.data) {
        const v = genRes.data.data;
        setSchoolNameEn(v.schoolNameEn || ''); setSchoolNameBn(v.schoolNameBn || '');
        setSiteTitleEn(v.siteTitleEn   || ''); setSiteTitleBn(v.siteTitleBn   || '');
        setEmail(v.email     || '');           setPhone(v.phone     || '');
        setAddressEn(v.addressEn || '');       setAddressBn(v.addressBn || '');
        setFacebook(v.facebook   || '');       setLinkedin(v.linkedin   || '');
        setYoutube(v.youtube     || '');       setIntroVideoUrl(v.introVideoUrl || '');
      }
      if (welcomeRes.data.success && welcomeRes.data.data)
        setWelcomeText(welcomeRes.data.data.welcomeText || '');
      if (slidesRes.data.success && Array.isArray(slidesRes.data.data?.slides))
        setSlides(slidesRes.data.data.slides);
    } catch (e) { console.log(e); }
  };

  // ── Upload helper ──────────────────────────────────────────
  const uploadImage = async (file) => {
    const token = localStorage.getItem('accessToken');
    const fd = new FormData();
    fd.append('image', file);
    const res = await api.post(`${API_URL}/api/v1/settings/upload`, fd, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });
    if (!res.data.success || !res.data.data.url) throw new Error('Upload failed');
    return res.data.data.url;
  };

  // ── Persist slides array ───────────────────────────────────
  const persistSlides = async (updatedSlides) => {
    const token = localStorage.getItem('accessToken');
    const res = await api.put(`${API_URL}/api/v1/settings/hero_slides`,
      { value: { slides: updatedSlides } },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.success) setSlides(updatedSlides);
    return res.data.success;
  };

  // ── ADD new slide ──────────────────────────────────────────
  const handleAddSlide = async (formData) => {
    setSavingSlide(true);
    try {
      const imageUrl = await uploadImage(formData.imageFile);
      const newSlide = {
        image: imageUrl,
        titleBn: formData.titleBn, titleEn: formData.titleEn,
        subtitleBn: formData.subtitleBn, subtitleEn: formData.subtitleEn,
        btnTextBn: formData.btnTextBn, btnTextEn: formData.btnTextEn,
        btnLink: formData.btnLink,
        hasCountdown: formData.hasCountdown, hasDonation: formData.hasDonation,
      };
      if (await persistSlides([...slides, newSlide])) {
        setAddingSlide(false);
        showSuccess('Slide added successfully!');
      }
    } catch (e) { showError(e.response?.data?.message || 'Failed to add slide'); }
    finally { setSavingSlide(false); }
  };

  // ── EDIT existing slide ────────────────────────────────────
  const handleEditSlide = async (index, formData) => {
    try {
      let imageUrl = formData.existingImage; // keep old image by default
      if (formData.imageFile) {
        imageUrl = await uploadImage(formData.imageFile); // replace if new file chosen
      }
      const updatedSlide = {
        image: imageUrl,
        titleBn: formData.titleBn, titleEn: formData.titleEn,
        subtitleBn: formData.subtitleBn, subtitleEn: formData.subtitleEn,
        btnTextBn: formData.btnTextBn, btnTextEn: formData.btnTextEn,
        btnLink: formData.btnLink,
        hasCountdown: formData.hasCountdown, hasDonation: formData.hasDonation,
      };
      const updated = slides.map((s, i) => i === index ? updatedSlide : s);
      if (await persistSlides(updated)) showSuccess('Slide updated successfully!');
    } catch (e) { showError('Failed to update slide'); }
  };

  // ── DELETE slide ───────────────────────────────────────────
  const handleDeleteSlide = async (index) => {
    if (!window.confirm('Delete this slide?')) return;
    try {
      if (await persistSlides(slides.filter((_, i) => i !== index)))
        showSuccess('Slide deleted!');
    } catch (e) { showError('Failed to delete slide'); }
  };

  // ── REORDER slides ─────────────────────────────────────────
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const arr = [...slides];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    if (await persistSlides(arr)) showSuccess('Slide order updated!');
  };

  const handleMoveDown = async (index) => {
    if (index === slides.length - 1) return;
    const arr = [...slides];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    if (await persistSlides(arr)) showSuccess('Slide order updated!');
  };

  // ── Save general settings ──────────────────────────────────
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const getRes = await api.get(`${API_URL}/api/v1/settings/general_settings`);
      const existing = getRes.data.success && getRes.data.data ? getRes.data.data : {};
      const newValue = { ...existing, schoolNameEn, schoolNameBn, siteTitleEn, siteTitleBn, email, phone, addressEn, addressBn, facebook, linkedin, youtube, introVideoUrl };
      const res = await api.put(`${API_URL}/api/v1/settings/general_settings`, { value: newValue }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) showSuccess('Settings saved!');
    } catch (e) { showError('Failed to save settings'); }
  };

  const handleSaveWelcome = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await api.put(`${API_URL}/api/v1/settings/welcome_text`, { value: { welcomeText } }, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) showSuccess('Welcome text saved!');
    } catch (e) { showError('Failed to save'); }
  };

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3500); };
  const showError   = (msg) => { setError(msg);   setTimeout(() => setError(''),   3500); };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100">CMS Settings</h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Manage site info, hero slider, social links, and media</p>
      </div>

      {/* Toasts */}
      {success && (
        <div className="flex items-center space-x-2 p-3 bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-500/20 sticky top-4 z-50 backdrop-blur-md animate-fadeIn">
          <CheckCircle size={16} /><span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-500/10 text-red-400 text-sm font-semibold rounded-xl border border-red-500/20 sticky top-4 z-50 backdrop-blur-md animate-fadeIn">
          <AlertCircle size={16} /><span>{error}</span>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex items-center space-x-1 bg-slate-900 rounded-xl p-1 border border-slate-800">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${
              activeTab === tab.id ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.icon}<span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════ TAB: GENERAL INFO ══════════ */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2"><Settings size={15} className="text-secondary" /><span>Organization Information</span></h3>
            <form onSubmit={handleSaveGeneral} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><FieldLabel>School Name (English)</FieldLabel><input className={inp} value={schoolNameEn} onChange={e => setSchoolNameEn(e.target.value)} placeholder="Dhuapalong Govt. Primary School" /></div>
                <div><FieldLabel>School Name (বাংলা)</FieldLabel><input className={`${inp} font-bn`} value={schoolNameBn} onChange={e => setSchoolNameBn(e.target.value)} placeholder="ধোয়াপালং সরকারি প্রাথমিক বিদ্যালয়" /></div>
                <div><FieldLabel>Site Title (English)</FieldLabel><input className={inp} value={siteTitleEn} onChange={e => setSiteTitleEn(e.target.value)} placeholder="Practon Alumni Association" /></div>
                <div><FieldLabel>Site Title (বাংলা)</FieldLabel><input className={`${inp} font-bn`} value={siteTitleBn} onChange={e => setSiteTitleBn(e.target.value)} placeholder="প্রাক্তন শিক্ষার্থী পরিষদ" /></div>
                <div>
                  <FieldLabel>Contact Email</FieldLabel>
                  <div className="relative"><Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input className={`${inp} pl-9`} value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="info@example.org" /></div>
                </div>
                <div>
                  <FieldLabel>Contact Phone</FieldLabel>
                  <div className="relative"><Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input className={`${inp} pl-9`} value={phone} onChange={e => setPhone(e.target.value)} type="tel" placeholder="+880 1234 567890" /></div>
                </div>
                <div><FieldLabel>Address (English)</FieldLabel><textarea className={ta} value={addressEn} onChange={e => setAddressEn(e.target.value)} rows={2} placeholder="Full address in English" /></div>
                <div><FieldLabel>Address (বাংলা)</FieldLabel><textarea className={`${ta} font-bn`} value={addressBn} onChange={e => setAddressBn(e.target.value)} rows={2} placeholder="সম্পূর্ণ ঠিকানা বাংলায়" /></div>
              </div>
              <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition shadow"><Save size={14} /><span>Save Organization Info</span></button>
            </form>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2"><Star size={15} className="text-secondary" /><span>Homepage Welcome Text</span></h3>
            <form onSubmit={handleSaveWelcome} className="space-y-4">
              <div>
                <FieldLabel>Welcome Title</FieldLabel>
                <input className={inp} value={welcomeText} onChange={e => setWelcomeText(e.target.value)} placeholder="স্বাগতম প্রাক্তন পরিষদে" />
                <p className="text-[10px] text-slate-600 mt-1">Short welcome headline shown in the homepage intro banner</p>
              </div>
              <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition shadow"><Save size={14} /><span>Save Welcome Text</span></button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ TAB: HERO SLIDER ══════════ */}
      {activeTab === 'slider' && (
        <div className="space-y-5">
          {/* Slides list */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Monitor size={15} className="text-secondary" />
                <span>Hero Slides <span className="text-slate-500 font-normal">({slides.length})</span></span>
              </h3>
              <button
                onClick={() => setAddingSlide(v => !v)}
                className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  addingSlide ? 'bg-slate-800 text-slate-400' : 'bg-secondary/15 hover:bg-secondary/25 text-secondary'
                }`}
              >
                {addingSlide ? <><X size={13} /><span>Cancel</span></> : <><Plus size={13} /><span>Add Slide</span></>}
              </button>
            </div>

            {slides.length > 0 ? (
              <div className="p-4 space-y-3">
                {slides.map((slide, i) => (
                  <SlideCard
                    key={i}
                    slide={slide}
                    index={i}
                    total={slides.length}
                    onDelete={handleDeleteSlide}
                    onEdit={handleEditSlide}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-slate-600 font-semibold">
                No slides yet — click <span className="text-secondary">+ Add Slide</span> above to create one.
              </div>
            )}
          </div>

          {/* Add slide inline panel */}
          {addingSlide && (
            <div className="bg-slate-900 border border-secondary/40 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                <Plus size={15} className="text-secondary" />
                <span>New Slide</span>
              </h3>
              <SlideForm
                initial={null}
                onSave={handleAddSlide}
                onCancel={() => setAddingSlide(false)}
                isSaving={savingSlide}
                isEdit={false}
              />
            </div>
          )}
        </div>
      )}

      {/* ══════════ TAB: SOCIAL MEDIA ══════════ */}
      {activeTab === 'social' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2"><Globe size={15} className="text-secondary" /><span>Social Media Links</span></h3>
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div>
              <FieldLabel>Facebook Page URL</FieldLabel>
              <div className="relative"><Facebook size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" /><input className={`${inp} pl-9`} value={facebook} onChange={e => setFacebook(e.target.value)} type="url" placeholder="https://facebook.com/yourpage" /></div>
            </div>
            <div>
              <FieldLabel>LinkedIn Profile URL</FieldLabel>
              <div className="relative"><Linkedin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" /><input className={`${inp} pl-9`} value={linkedin} onChange={e => setLinkedin(e.target.value)} type="url" placeholder="https://linkedin.com/in/profile" /></div>
            </div>
            <div>
              <FieldLabel>YouTube Channel URL</FieldLabel>
              <div className="relative"><Youtube size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" /><input className={`${inp} pl-9`} value={youtube} onChange={e => setYoutube(e.target.value)} type="url" placeholder="https://youtube.com/@channel" /></div>
            </div>
            <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition shadow"><Save size={14} /><span>Save Social Links</span></button>
          </form>
        </div>
      )}

      {/* ══════════ TAB: VIDEO & MEDIA ══════════ */}
      {activeTab === 'media' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2"><Video size={15} className="text-secondary" /><span>Introduction Video</span></h3>
          <form onSubmit={handleSaveGeneral} className="space-y-5">
            <div>
              <FieldLabel>Intro Video URL</FieldLabel>
              <div className="relative"><Video size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input className={`${inp} pl-9`} value={introVideoUrl} onChange={e => setIntroVideoUrl(e.target.value)} type="url" placeholder="https://www.youtube.com/watch?v=..." />
              </div>
              <p className="text-[10px] text-slate-600 mt-1">Shown in the Mission &amp; Vision section on the homepage. Supports YouTube, Facebook, Cloudinary, and direct video URLs.</p>
            </div>

            {introVideoUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-700 aspect-video bg-black">
                <iframe className="w-full h-full" src={introVideoUrl.includes('watch?v=') ? introVideoUrl.replace('watch?v=', 'embed/') : introVideoUrl} title="Preview" frameBorder="0" allowFullScreen />
              </div>
            )}

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-300 mb-2">Supported Sources</p>
              <div className="grid grid-cols-2 gap-1">
                <span><span className="text-red-400 font-semibold">YouTube</span> — youtube.com/watch or youtu.be</span>
                <span><span className="text-blue-400 font-semibold">Facebook</span> — facebook.com (public videos)</span>
                <span><span className="text-purple-400 font-semibold">Cloudinary</span> — res.cloudinary.com direct link</span>
                <span><span className="text-slate-400 font-semibold">Direct</span> — .mp4 / .webm / .ogg URL</span>
              </div>
            </div>

            <button type="submit" className="flex items-center space-x-2 bg-secondary hover:bg-yellow-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition shadow"><Save size={14} /><span>Save Video Settings</span></button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CmsSettings;
