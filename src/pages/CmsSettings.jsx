import React, { useEffect, useState } from 'react';
import api, { API_URL } from '../api/api';
import { Save, AlertCircle } from 'lucide-react';
import WelcomeSettings from '../components/settings/WelcomeSettings.jsx';
import SliderSettings from '../components/settings/SliderSettings.jsx';
import GeneralSettings from '../components/settings/GeneralSettings.jsx';
import EventFeesSettings from '../components/settings/EventFeesSettings.jsx';

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
  const [introVideoUrl, setIntroVideoUrl] = useState('https://www.youtube.com/embed/9ycVq2kU7L0');
  const [bkash, setBkash] = useState('+880 1700 000000');
  const [nagad, setNagad] = useState('+880 1800 000000');
  const [rocket, setRocket] = useState('+880 1900 000000');
  const [eventDefaultFee, setEventDefaultFee] = useState(1500);
  const [eventBatchFees, setEventBatchFees] = useState([]);
  const [digitalFeeType, setDigitalFeeType] = useState('percentage');
  const [digitalFeeValue, setDigitalFeeValue] = useState(2);

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
        setEventDefaultFee(val.eventDefaultFee || 1500);
        setEventBatchFees(val.eventBatchFees || []);
        setDigitalFeeType(val.digitalFeeType || 'percentage');
        setDigitalFeeValue(val.digitalFeeValue ?? 2);
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
          rocket,
          eventDefaultFee: Number(eventDefaultFee),
          eventBatchFees: eventBatchFees.map(f => ({ batches: f.batches, fee: Number(f.fee) })),
          digitalFeeType,
          digitalFeeValue: Number(digitalFeeValue)
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
    <div className="space-y-6 max-w-6xl text-slate-100">
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
        <WelcomeSettings
          welcomeText={welcomeText}
          setWelcomeText={setWelcomeText}
          handleSaveWelcome={handleSaveWelcome}
        />

        <SliderSettings
          slides={slides}
          handleAddSlide={handleAddSlide}
          handleDeleteSlide={handleDeleteSlide}
          slideImageFileName={slideImageFileName}
          setSlideImageFile={setSlideImageFile}
          setSlideImageFileName={slideImageFileName}
          slideTitleBn={slideTitleBn} setSlideTitleBn={setSlideTitleBn}
          slideTitleEn={slideTitleEn} setSlideTitleEn={setSlideTitleEn}
          slideSubtitleBn={slideSubtitleBn} setSlideSubtitleBn={setSlideSubtitleBn}
          slideSubtitleEn={slideSubtitleEn} setSlideSubtitleEn={setSlideSubtitleEn}
          slideBtnTextBn={slideBtnTextBn} setSlideBtnTextBn={setSlideBtnTextBn}
          slideBtnTextEn={slideBtnTextEn} setSlideBtnTextEn={setSlideBtnTextEn}
          slideBtnLink={slideBtnLink} setSlideBtnLink={setSlideBtnLink}
          slideHasCountdown={slideHasCountdown} setSlideHasCountdown={setSlideHasCountdown}
          slideHasDonation={slideHasDonation} setSlideHasDonation={setSlideHasDonation}
          uploadingSlide={uploadingSlide}
        />

        {/* Combined configuration form for Organization & Fees */}
        <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
          <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
            <GeneralSettings
              siteTitleBn={siteTitleBn} setSiteTitleBn={setSiteTitleBn}
              siteTitleEn={siteTitleEn} setSiteTitleEn={setSiteTitleEn}
              schoolNameBn={schoolNameBn} setSchoolNameBn={setSchoolNameBn}
              schoolNameEn={schoolNameEn} setSchoolNameEn={setSchoolNameEn}
              email={email} setEmail={setEmail}
              phone={phone} setPhone={setPhone}
              addressBn={addressBn} setAddressBn={setAddressBn}
              addressEn={addressEn} setAddressEn={setAddressEn}
              facebook={facebook} setFacebook={setFacebook}
              linkedin={linkedin} setLinkedin={setLinkedin}
              youtube={youtube} setYoutube={setYoutube}
              bkash={bkash} setBkash={setBkash}
              nagad={nagad} setNagad={setNagad}
              rocket={rocket} setRocket={setRocket}
            />

            <EventFeesSettings
              eventDefaultFee={eventDefaultFee} setEventDefaultFee={setEventDefaultFee}
              eventBatchFees={eventBatchFees} setEventBatchFees={setEventBatchFees}
              digitalFeeType={digitalFeeType} setDigitalFeeType={setDigitalFeeType}
              digitalFeeValue={digitalFeeValue} setDigitalFeeValue={setDigitalFeeValue}
            />

            <div className="pt-2">
              <button
                type="submit"
                className="bg-secondary hover:bg-yellow-500 text-white font-bold px-6 py-2.5 rounded shadow transition flex items-center space-x-1.5 text-xs uppercase tracking-wider"
              >
                <Save size={14} />
                <span>Save General & Fee Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CmsSettings;
