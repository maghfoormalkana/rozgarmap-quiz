import { useState } from 'react';
import { examService } from '../services/examApi';

export const useExam = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Store student details in session storage so it persists across the exam routes
  const saveStudentDetails = (details) => {
    sessionStorage.setItem('examStudentDetails', JSON.stringify(details));
  };

  const getStudentDetails = () => {
    const details = sessionStorage.getItem('examStudentDetails');
    return details ? JSON.parse(details) : null;
  };

  const clearExamSession = () => {
    sessionStorage.removeItem('examStudentDetails');
    sessionStorage.removeItem('examAnswers');
  };

  const registerForExam = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await examService.registerStudent(data);
      saveStudentDetails(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const questions = await examService.getExamQuestions(categoryId);
      return questions;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitFinalExam = async (categoryId, submittedAnswers) => {
    setLoading(true);
    setError(null);
    try {
      const studentDetails = getStudentDetails();
      const payload = {
        categoryId,
        studentDetails,
        submittedAnswers
      };
      const response = await examService.submitExam(payload);
      clearExamSession(); // Clear session after successful submission
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit exam');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getStudentDetails,
    registerForExam,
    fetchQuestions,
    submitFinalExam,
    clearExamSession
  };
};