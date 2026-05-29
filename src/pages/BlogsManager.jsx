import React, { useEffect, useState } from 'react';
import api, { API_URL } from '../api/api';
import { Plus, Trash, BookOpen, Upload, Send, Edit, X } from 'lucide-react';
import { getImageUrl } from '../utils/image';

const BlogsManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('news');
  const [readTime, setReadTime] = useState(3);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    api.get(`${API_URL}/api/v1/blogs`)
      .then(res => {
        if (res.data.success) {
          setBlogs(res.data.data);
        }
      })
      .catch(err => console.log('Error fetching blogs:', err));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      const formData = new FormData();
      formData.append('title', JSON.stringify({ en: titleEn, bn: titleBn }));
      formData.append('content', JSON.stringify({ en: contentEn, bn: contentBn }));
      formData.append('author', author);
      formData.append('category', category);
      formData.append('readTime', Number(readTime));
      
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const res = await api.post(`${API_URL}/api/v1/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setTitleEn('');
        setTitleBn('');
        setContentEn('');
        setContentBn('');
        setAuthor('');
        setCategory('news');
        setReadTime(3);
        setThumbnailFile(null);
        setThumbnailFileName('');
        fetchBlogs();
        setMessage('Blog post published successfully!');
        setTimeout(() => setMessage(''), 3500);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Failed to publish blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      const formData = new FormData();
      formData.append('title', JSON.stringify({ en: titleEn, bn: titleBn }));
      formData.append('content', JSON.stringify({ en: contentEn, bn: contentBn }));
      formData.append('author', author);
      formData.append('category', category);
      formData.append('readTime', Number(readTime));
      
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      } else if (editingBlog.thumbnail) {
        formData.append('thumbnail', editingBlog.thumbnail);
      }

      const res = await api.put(`${API_URL}/api/v1/blogs/${editingBlog._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        setEditingBlog(null);
        setTitleEn('');
        setTitleBn('');
        setContentEn('');
        setContentBn('');
        setAuthor('');
        setCategory('news');
        setReadTime(3);
        setThumbnailFile(null);
        setThumbnailFileName('');
        fetchBlogs();
        setMessage('Blog post updated successfully!');
        setTimeout(() => setMessage(''), 3500);
      }
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || 'Failed to update blog post');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (blog) => {
    setEditingBlog(blog);
    setTitleEn(blog.title?.en || '');
    setTitleBn(blog.title?.bn || '');
    setContentEn(blog.content?.en || '');
    setContentBn(blog.content?.bn || '');
    setAuthor(blog.author || '');
    setCategory(blog.category || 'news');
    setReadTime(blog.readTime || 3);
    setThumbnailFile(null);
    setThumbnailFileName('');
    setMessage('');
  };

  const cancelEdit = () => {
    setEditingBlog(null);
    setTitleEn('');
    setTitleBn('');
    setContentEn('');
    setContentBn('');
    setAuthor('');
    setCategory('news');
    setReadTime(3);
    setThumbnailFile(null);
    setThumbnailFileName('');
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(`${API_URL}/api/v1/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
      setMessage('Blog post deleted successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Create / Edit form - 5 columns */}
      <div className="lg:col-span-5 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          {editingBlog ? <Edit size={20} className="text-secondary" /> : <Plus size={20} className="text-secondary" />}
          <span>{editingBlog ? 'Edit Blog Post' : 'Publish Blog Post'}</span>
        </h3>

        {message && (
          <div className="p-3 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-500/20">
            {message}
          </div>
        )}

        <form onSubmit={editingBlog ? handleUpdate : handleCreate} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Title (Bengali)</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 font-bn text-sm" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Title (English)</label>
              <input type="text" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Author</label>
              <input type="text" placeholder="Admin" className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <select className="w-full bg-slate-800 border border-slate-700 px-2 py-2 rounded text-slate-350" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="news">News</option>
                <option value="story">Story</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Read Time (Min)</label>
              <input type="number" min={1} className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100" value={readTime} onChange={(e) => setReadTime(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Content (Bengali)</label>
            <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 font-bn text-sm leading-relaxed" value={contentBn} onChange={(e) => setContentBn(e.target.value)} required />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Content (English)</label>
            <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 px-3 py-2 rounded text-slate-100 text-sm leading-relaxed" value={contentEn} onChange={(e) => setContentEn(e.target.value)} required />
          </div>

          {/* Thumbnail Image File Selector */}
          <div className="bg-slate-800/40 p-4 rounded-lg border border-dashed border-slate-700 text-center">
            <label className="cursor-pointer block">
              <Upload className="mx-auto text-secondary mb-2" size={20} />
              <span className="text-xs font-bold text-slate-300 block uppercase">Upload Thumbnail Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files[0]) {
                    setThumbnailFile(e.target.files[0]);
                    setThumbnailFileName(e.target.files[0].name);
                  }
                }}
              />
            </label>
            {thumbnailFileName && <span className="text-xs text-gray-500 font-semibold mt-1 block">Selected: {thumbnailFileName}</span>}
            {!thumbnailFileName && editingBlog && editingBlog.thumbnail && <span className="text-[10px] text-gray-500 font-medium mt-1 block">Leave empty to keep existing thumbnail</span>}
          </div>

          <div className="flex space-x-3 pt-2">
            {editingBlog && (
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded shadow transition flex items-center justify-center space-x-1 uppercase text-[10px]"
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded shadow transition flex items-center justify-center space-x-1.5 uppercase text-xs"
            >
              {editingBlog ? <Edit size={14} /> : <Send size={14} />}
              <span>{saving ? 'Saving...' : (editingBlog ? 'Save Changes' : 'Publish Article')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* List - 7 columns */}
      <div className="lg:col-span-7 bg-dark-card p-6 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
          <BookOpen size={20} className="text-secondary" />
          <span>Active Blog Articles</span>
        </h3>

        <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2">
          {blogs.length > 0 ? (
            blogs.map(blog => (
              <div key={blog._id} className="bg-slate-900 p-4 rounded border border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-10 bg-slate-800 rounded overflow-hidden shrink-0 flex items-center justify-center border border-slate-700">
                    {blog.thumbnail ? (
                      <img 
                        src={getImageUrl(blog.thumbnail)} 
                        className="w-full h-full object-cover" 
                        alt="" 
                      />
                    ) : (
                      <BookOpen size={16} className="text-slate-450" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 line-clamp-1">{blog.title.en}</h4>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                      By {blog.author} • {blog.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => startEdit(blog)} className="text-slate-400 hover:text-secondary p-1.5 rounded transition" title="Edit Blog">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(blog._id)} className="text-slate-500 hover:text-red-400 p-1.5 rounded transition" title="Delete Blog">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500 font-semibold">
              No blog articles found in the database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsManager;
