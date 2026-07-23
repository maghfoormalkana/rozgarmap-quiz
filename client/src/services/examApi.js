import api from './api';

export const examService = {
  // Popup
  getPopup: async () => {
    const response = await api.get('/popup'); // Removed /api
    return response.data;
  },

  // Student Exam Flow
  registerStudent: async (data) => {
    const response = await api.post('/exam/register', data); // Removed /api
    return response.data;
  },
  
  getExamQuestions: async (categoryId) => {
    const response = await api.get(`/exam/questions/${categoryId}`); // Removed /api
    return response.data;
  },
  
  submitExam: async (data) => {
    const response = await api.post('/exam/submit', data); // Removed /api
    return response.data;
  },

  // Admin Routes
  updatePopup: async (data) => {
    const response = await api.put('/popup', data); // Removed /api
    return response.data;
  },
  
  getSubmissions: async () => {
    const response = await api.get('/exam/submissions'); // Removed /api
    return response.data;
  },
  
  getSubmissionDetails: async (id) => {
    const response = await api.get(`/exam/submissions/${id}`); // Removed /api
    return response.data;
  },
  
  deleteSubmission: async (id) => {
    const response = await api.delete(`/exam/submissions/${id}`); // Removed /api
    return response.data;
  }
};