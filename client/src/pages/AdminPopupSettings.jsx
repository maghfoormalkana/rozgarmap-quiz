import React, { useState, useEffect } from 'react';
import { examService } from '../services/examApi';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Settings, Save, Image as ImageIcon, Type, Link as LinkIcon, UploadCloud, X } from 'lucide-react';

const AdminPopupSettings = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // New state to toggle between URL and Upload
  const [imageSource, setImageSource] = useState('url'); 

  const [formData, setFormData] = useState({
    enabled: false,
    type: 'image-content',
    image: '',
    headline: '',
    description: '',
    ctaText: 'Apply Now',
    categoryId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data);

        const popupRes = await examService.getPopup();
        if (popupRes && popupRes._id) {
          setFormData({
            enabled: popupRes.enabled || false,
            type: popupRes.type || 'image-content',
            image: popupRes.image || '',
            headline: popupRes.headline || '',
            description: popupRes.description || '',
            ctaText: popupRes.ctaText || 'Apply Now',
            categoryId: popupRes.categoryId || (catRes.data.length > 0 ? catRes.data[0]._id : '')
          });
          
          // Auto-switch to upload tab if the saved string is a Base64 data URL
          if (popupRes.image && popupRes.image.startsWith('data:image')) {
            setImageSource('upload');
          }
        } else if (catRes.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: catRes.data[0]._id }));
        }
      } catch (error) {
        console.error("Failed to load setup data", error);
        setMessage({ type: 'error', text: 'Failed to load configuration.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Convert uploaded file to Base64 String
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
         setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await examService.updatePopup(formData);
      setMessage({ type: 'success', text: 'Popup configuration updated successfully!' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update configuration.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-rozgar-blue" />
          Homepage Exam Popup Configuration
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage the entrance exam announcement banner on the homepage.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-200 dark:border-slate-600">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Enable Popup</h3>
              <p className="text-sm text-gray-500">Show this announcement to homepage visitors</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rozgar-blue"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <Type className="w-4 h-4" /> Popup Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-rozgar-blue focus:border-rozgar-blue"
              >
                <option value="content">Content Only (Text & Button)</option>
                <option value="image">Image Only (Banner & Button)</option>
                <option value="image-content">Image & Content (Full Layout)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> Linked Exam Category
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-rozgar-blue focus:border-rozgar-blue"
              >
                <option value="" disabled>Select an exam category...</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* DUAL IMAGE INPUT SECTION */}
          {(formData.type === 'image' || formData.type === 'image-content') && (
            <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-rozgar-blue" /> Image Source
                </label>
                
                {/* Custom Toggle Pills */}
                <div className="flex bg-gray-200 dark:bg-slate-800 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setImageSource('url')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${imageSource === 'url' ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSource('upload')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${imageSource === 'upload' ? 'bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {/* URL Input */}
              {imageSource === 'url' && (
                <input
                  type="text"
                  name="image"
                  // Don't show long base64 strings in the URL input box
                  value={formData.image.startsWith('data:image') ? '' : formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-rozgar-blue focus:border-rozgar-blue mb-4"
                />
              )}

              {/* File Upload Drag & Drop */}
              {imageSource === 'upload' && (
                <div className="flex items-center justify-center w-full mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white dark:bg-slate-700 hover:bg-gray-50 dark:border-slate-500 dark:hover:bg-slate-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                      <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-600 dark:text-gray-300"><span className="font-semibold text-rozgar-blue">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP (Max. 5MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
                </div>
              )}

              {/* Image Preview Area */}
              {formData.image && (
                <div className="relative w-full sm:w-2/3 md:w-1/2 h-40 bg-gray-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600 mt-2">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {(formData.type === 'content' || formData.type === 'image-content') && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Headline</label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g., National Scholarship Test 2026"
                  className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-rozgar-blue focus:border-rozgar-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter the announcement details..."
                  className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-rozgar-blue focus:border-rozgar-blue"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Call to Action (CTA) Text</label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText}
              onChange={handleChange}
              placeholder="e.g., Register Now"
              className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-rozgar-blue focus:border-rozgar-blue"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-rozgar-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPopupSettings;