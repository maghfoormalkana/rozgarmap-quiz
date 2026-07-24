import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../services/examApi';

const ExamPopup = () => {
  const [popupData, setPopupData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const data = await examService.getPopup();
        // If it's enabled in the admin panel, always show it
        if (data && data.enabled) {
          setPopupData(data);
          setIsVisible(true); 
        }
      } catch (error) {
        console.error("Failed to load popup configuration:", error);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Removed sessionStorage so it will appear again on refresh
  };

  const handleCtaClick = () => {
    handleClose();
    if (popupData.categoryId) {
      // Extract the string ID if it comes back as a populated object
      const catId = typeof popupData.categoryId === 'object' 
        ? popupData.categoryId._id 
        : popupData.categoryId;
        
      navigate(`/exam/landing/${catId}`);
    }
  };

  if (!isVisible || !popupData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-2 text-gray-500 bg-white rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm"
          aria-label="Close popup"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col">
          {/* Conditional Image Rendering */}
          {(popupData.type === 'image' || popupData.type === 'image-content') && popupData.image && (
            <div className="w-full h-48 sm:h-64 bg-gray-100">
              <img 
                src={popupData.image} 
                alt={popupData.headline || "Exam Announcement"} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Conditional Content Rendering */}
          {(popupData.type === 'content' || popupData.type === 'image-content') && (
            <div className="p-6 sm:p-8 text-center">
              {popupData.headline && (
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {popupData.headline}
                </h2>
              )}
              
              {popupData.description && (
                <p className="text-gray-600 mb-6 whitespace-pre-wrap">
                  {popupData.description}
                </p>
              )}

              {popupData.categoryId && (
                <button 
                  onClick={handleCtaClick}
                  className="w-full py-3 px-6 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                >
                  {popupData.ctaText || 'Apply Now'}
                </button>
              )}
            </div>
          )}

          {/* Fallback CTA if type is 'image' only but we still need a button */}
          {popupData.type === 'image' && popupData.categoryId && (
             <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={handleCtaClick}
                  className="w-full py-3 px-6 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
                >
                  {popupData.ctaText || 'Apply Now'}
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPopup;