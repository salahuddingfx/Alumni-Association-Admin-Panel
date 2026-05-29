import React from 'react';
import { Layout } from 'lucide-react';

const GeneralSettings = ({
  siteTitleBn, setSiteTitleBn,
  siteTitleEn, setSiteTitleEn,
  schoolNameBn, setSchoolNameBn,
  schoolNameEn, setSchoolNameEn,
  email, setEmail,
  phone, setPhone,
  addressBn, setAddressBn,
  addressEn, setAddressEn,
  facebook, setFacebook,
  linkedin, setLinkedin,
  youtube, setYoutube,
  introVideoUrl, setIntroVideoUrl,
  bkash, setBkash,
  nagad, setNagad,
  rocket, setRocket
}) => {
  return (
    <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
      <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
        <Layout size={18} className="text-secondary" />
        <span>General Organization & System Settings</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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
        <div>
          <label className="block text-slate-400 mb-1">Intro Video URL (YouTube, Facebook, or Cloudinary)</label>
          <input
            type="url"
            className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm"
            value={introVideoUrl}
            onChange={(e) => setIntroVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or https://facebook.com/watch/?v=... or Cloudinary link"
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
    </div>
  );
};

export default GeneralSettings;
