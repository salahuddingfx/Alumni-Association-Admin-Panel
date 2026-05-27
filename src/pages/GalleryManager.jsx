import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash, Image as ImageIcon, Upload } from 'lucide-react';

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [category, setCategory] = useState('reunion');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get(`${window.API_URL}/api/v1/gallery`)
      .then(res => {
        if (res.data.success) {
          setItems(res.data.data);
        }
      })
      .catch(err => console.log(err));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', JSON.stringify({ en: titleEn, bn: titleBn }));
      formData.append('category', category);
      if (imageFile) {
        formData.append('media', imageFile);
      }

      const token = localStorage.getItem('accessToken');
      const res = await axios.post(`${window.API_URL}/api/v1/gallery`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setTitleEn('');
        setTitleBn('');
        setImageFile(null);
        fetchItems();
        setMessage('Image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery item?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${window.API_URL}/api/v1/gallery/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Create form */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <Plus size={20} className="text-secondary" />
          <span>Upload Gallery Media</span>
        </h3>

        {message && (
          <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20">
            {message}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-400 mb-1">Bengali Title</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">English Title</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
          </div>

          {/* Photo File Selector */}
          <div className="bg-slate-800/40 p-4 rounded-lg border border-dashed border-slate-700 text-center">
            <label className="cursor-pointer block">
              <Upload className="mx-auto text-secondary mb-2" size={20} />
              <span className="text-xs font-bold text-slate-300 block uppercase">Upload Gallery Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => setImageFile(e.target.files[0])}
                required
              />
            </label>
            {imageFile && <span className="text-xs text-gray-500 font-semibold mt-1 block">Selected: {imageFile.name}</span>}
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Category</label>
            <select className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-300" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="reunion">Reunion</option>
              <option value="sports">Sports</option>
              <option value="seminar">Seminar</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded shadow transition">
            Add Image
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100">Gallery Media Collection</h3>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[500px]">
          {items.map(item => (
            <div key={item._id} className="relative group rounded overflow-hidden border border-slate-800 bg-slate-900">
              <img src={item.url.startsWith('http') ? item.url : `${window.API_URL}${item.url}`} className="w-full h-20 object-cover" alt="" />
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
