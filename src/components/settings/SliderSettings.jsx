import React from 'react';
import { Plus, Trash, Upload } from 'lucide-react';

const SliderSettings = ({
  slides,
  handleAddSlide,
  handleDeleteSlide,
  slideImageFileName,
  setSlideImageFile,
  setSlideImageFileName,
  slideTitleBn, setSlideTitleBn,
  slideTitleEn, setSlideTitleEn,
  slideSubtitleBn, setSlideSubtitleBn,
  slideSubtitleEn, setSlideSubtitleEn,
  slideBtnTextBn, setSlideBtnTextBn,
  slideBtnTextEn, setSlideBtnTextEn,
  slideBtnLink, setSlideBtnLink,
  slideHasCountdown, setSlideHasCountdown,
  slideHasDonation, setSlideHasDonation,
  uploadingSlide
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Create Form */}
      <div className="lg:col-span-5 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Plus size={18} className="text-secondary" />
          <span>Create Homepage Slide</span>
        </h3>

        <form onSubmit={handleAddSlide} className="space-y-3.5 text-xs">
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
              <label className="block text-slate-400 mb-1">Slide Title (Bn)</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100 font-bn" value={slideTitleBn} onChange={(e) => setSlideTitleBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Slide Title (En)</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100" value={slideTitleEn} onChange={(e) => setSlideTitleEn(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Slide Subtitle / Body (Bn)</label>
            <textarea rows={2} className="w-full bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded text-slate-100 font-bn" value={slideSubtitleBn} onChange={(e) => setSlideSubtitleBn(e.target.value)} required />
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Slide Subtitle / Body (En)</label>
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

      {/* List Active Slides */}
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
  );
};

export default SliderSettings;
