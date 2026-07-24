import React, { useState, useEffect } from 'react';
import { examService } from '../services/examApi';
import api from '../services/api'; // Using your existing api for categories
import LoadingSpinner from '../components/LoadingSpinner';
import { Settings, Save, Image as ImageIcon, Type, Link as LinkIcon } from 'lucide-react';

const AdminPopupSettings = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
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
        // Fetch existing categories for the dropdown
        const catRes = await api.get('/categories');
        setCategories(catRes.data);

        // Fetch current popup config
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await examService.updatePopup(formData);
      setMessage({ type: 'success', text: 'Popup configuration updated successfully!' });
      
      // Clear message after 3 seconds
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

          {(formData.type === 'image' || formData.type === 'image-content') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/banner.jpg"
                className="w-full p-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-rozgar-blue focus:border-rozgar-blue"
              />
            </div>
          )}

          {(formData.type === 'content' || formData.type === 'image-content') && (
            <>
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
            </>
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