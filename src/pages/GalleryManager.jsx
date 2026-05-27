import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash, Image as ImageIcon } from 'lucide-react';

const GalleryManager = () => {
  const [items, setItems] = useState([]);
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('reunion');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get('http://localhost:5000/api/v1/gallery')
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
      const payload = {
        title: { en: titleEn, bn: titleBn },
        url,
        category,
      };

      const token = localStorage.getItem('accessToken');
      const res = await axios.post('http://localhost:5000/api/v1/gallery', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTitleEn('');
        setTitleBn('');
        setUrl('');
        fetchItems();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/v1/gallery/${id}`, {
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

        <form onSubmit={handleCreate} className="space-y-4 text-sm">
          <div>
            <label className="block text-slate-400 mb-1">Bengali Title</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">English Title</label>
            <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Image URL</label>
            <input type="text" placeholder="https://unsplash.com/..." className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded" value={url} onChange={(e) => setUrl(e.target.value)} required />
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
              <img src={item.url} className="w-full h-20 object-cover" alt="" />
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
