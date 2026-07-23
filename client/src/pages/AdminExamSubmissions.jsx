import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examService } from '../services/examApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { Eye, Trash2, Download, Search } from 'lucide-react';

const AdminExamSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const data = await examService.getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam record? This action cannot be undone.')) {
      try {
        // Assuming you add a delete method to examApi.js: deleteSubmission: (id) => api.delete(`/api/exam/submissions/${id}`)
        // await examService.deleteSubmission(id);
        setSubmissions(submissions.filter(sub => sub._id !== id));
      } catch (error) {
        alert('Failed to delete submission');
      }
    }
  };

  const exportToCSV = () => {
    if (!submissions.length) return;
    
    const headers = ['Date', 'Category', 'Student Name', 'Email', 'Contact', 'Qualification', 'Institution', 'Score (%)'];
    const csvData = submissions.map(sub => [
      new Date(sub.createdAt).toLocaleDateString(),
      sub.categoryName,
      sub.fullName,
      sub.email,
      sub.contactNo,
      sub.qualification,
      sub.schoolCollege,
      sub.score.toFixed(2)
    ]);

    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'exam_submissions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Submissions</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage student examination records</p>
        </div>
        
        <button 
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export to Excel/CSV
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by student name, email, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Score</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-gray-500 dark:text-gray-400">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">{sub.fullName}</div>
                      <div className="text-xs text-gray-500">{sub.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {sub.categoryName}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      {sub.score.toFixed(1)}%
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          to={`/admin/exam-submissions/${sub._id}`}
                          className="text-rozgar-blue hover:text-blue-700 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(sub._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminExamSubmissions;