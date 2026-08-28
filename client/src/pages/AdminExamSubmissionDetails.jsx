// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { examService } from '../services/examApi';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { ArrowLeft, User, CheckCircle, XCircle, Award, BookOpen, GraduationCap, Building2, Phone, Mail } from 'lucide-react';

// const AdminExamSubmissionDetails = () => {
//   const { id } = useParams();
//   const [submission, setSubmission] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const data = await examService.getSubmissionDetails(id);
//         setSubmission(data);
//       } catch (error) {
//         console.error('Failed to fetch submission details', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDetails();
//   }, [id]);

//   if (loading) return <LoadingSpinner />;
//   if (!submission) return <div className="p-8 text-center text-red-500 font-bold">Submission not found</div>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6">
      
//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <Link to="/admin/exam-submissions" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
//           <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//         </Link>
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Report</h1>
//           <p className="text-gray-500 text-sm mt-1">Submitted on {new Date(submission.createdAt).toLocaleString()}</p>
//         </div>
//       </div>

//       {/* Top Info Cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Student Profile Card */}
//         <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
//           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//             <User className="w-5 h-5 text-rozgar-blue" />
//             Candidate Information
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
//             <div>
//               <p className="text-sm text-gray-500">Full Name</p>
//               <p className="font-medium text-gray-900 dark:text-white">{submission.fullName}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> Email</p>
//               <p className="font-medium text-gray-900 dark:text-white">{submission.email}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> Contact</p>
//               <p className="font-medium text-gray-900 dark:text-white">{submission.contactNo}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500 flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5"/> Qualification</p>
//               <p className="font-medium text-gray-900 dark:text-white">{submission.qualification}</p>
//             </div>
//             <div className="sm:col-span-2">
//               <p className="text-sm text-gray-500 flex items-center gap-1"><Building2 className="w-3.5 h-3.5"/> Institution</p>
//               <p className="font-medium text-gray-900 dark:text-white">{submission.schoolCollege}</p>
//             </div>
//           </div>
//         </div>

//         {/* Score Summary Card */}
//         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col justify-center items-center text-center">
//           <div className="w-20 h-20 rounded-full border-4 border-rozgar-blue flex items-center justify-center mb-3">
//             <span className="text-2xl font-bold text-rozgar-blue">{submission.score.toFixed(0)}%</span>
//           </div>
//           <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
//             <BookOpen className="w-5 h-5 text-gray-400" />
//             {submission.categoryName}
//           </h3>
//           <div className="flex gap-4 mt-4 w-full justify-center">
//             <div className="text-center px-3 border-r border-gray-200 dark:border-slate-600">
//               <p className="text-2xl font-bold text-green-500">{submission.correctAnswers}</p>
//               <p className="text-xs text-gray-500 uppercase font-semibold">Correct</p>
//             </div>
//             <div className="text-center px-3 border-r border-gray-200 dark:border-slate-600">
//               <p className="text-2xl font-bold text-red-500">{submission.wrongAnswers}</p>
//               <p className="text-xs text-gray-500 uppercase font-semibold">Wrong</p>
//             </div>
//             <div className="text-center px-3">
//               <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{submission.totalQuestions}</p>
//               <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Answer Snapshot Review */}
//       <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
//         <div className="p-6 border-b border-gray-100 dark:border-slate-700">
//           <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
//             <Award className="w-5 h-5 text-rozgar-blue" />
//             Detailed Question Review
//           </h2>
//         </div>
        
//         <div className="divide-y divide-gray-100 dark:divide-slate-700">
//           {submission.answers.map((ans, idx) => (
//             <div key={idx} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
//               <div className="flex gap-4">
//                 <div className="shrink-0 mt-1">
//                   {ans.isCorrect ? (
//                     <CheckCircle className="w-6 h-6 text-green-500" />
//                   ) : (
//                     <XCircle className="w-6 h-6 text-red-500" />
//                   )}
//                 </div>
//                 <div className="w-full">
//                   <p className="font-medium text-gray-900 dark:text-white text-lg mb-4">
//                     <span className="text-gray-400 mr-2">{idx + 1}.</span> 
//                     {ans.question}
//                   </p>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
//                     {ans.options.map((opt, optIdx) => {
//                       let badgeClass = "border-gray-200 text-gray-600 dark:border-slate-600 dark:text-gray-400";
//                       let indicator = "";

//                       if (opt === ans.correctAnswer) {
//                         badgeClass = "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400";
//                         indicator = "(Correct Answer)";
//                       } else if (opt === ans.selectedAnswer && !ans.isCorrect) {
//                         badgeClass = "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
//                         indicator = "(Candidate Answer)";
//                       }

//                       return (
//                         <div key={optIdx} className={`p-3 rounded-lg border flex justify-between items-center ${badgeClass}`}>
//                           <span>{opt}</span>
//                           {indicator && <span className="text-xs font-bold opacity-75">{indicator}</span>}
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {!ans.selectedAnswer && (
//                     <div className="inline-flex items-center px-3 py-1 rounded-md bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200">
//                       Question Unanswered (Skipped)
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminExamSubmissionDetails;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { examService } from '../services/examApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, User, CheckCircle, XCircle, Award, BookOpen, GraduationCap, Building2, Phone, Mail, Contact } from 'lucide-react';

const AdminExamSubmissionDetails = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await examService.getSubmissionDetails(id);
        setSubmission(data);
      } catch (error) {
        console.error('Failed to fetch submission details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!submission) return <div className="p-8 text-center text-red-500 font-bold">Submission not found</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/exam-submissions" className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Report</h1>
          <p className="text-gray-500 text-sm mt-1">Submitted on {new Date(submission.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Top Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Profile Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-rozgar-blue" />
            Candidate Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-900 dark:text-white">{submission.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Contact className="w-3.5 h-3.5"/> Roll Number</p>
              <p className="font-medium text-gray-900 dark:text-white">{submission.rollNo || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> Email</p>
              <p className="font-medium text-gray-900 dark:text-white">{submission.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5"/> Contact</p>
              <p className="font-medium text-gray-900 dark:text-white">{submission.contactNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5"/> Qualification</p>
              <p className="font-medium text-gray-900 dark:text-white">{submission.qualification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1"><Building2 className="w-3.5 h-3.5"/> Institution</p>
              <p className="font-medium text-gray-900 dark:text-white">{submission.schoolCollege}</p>
            </div>
          </div>
        </div>

        {/* Score Summary Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 rounded-full border-4 border-rozgar-blue flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-rozgar-blue">{submission.score.toFixed(0)}%</span>
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-400" />
            {submission.categoryName}
          </h3>
          <div className="flex gap-4 mt-4 w-full justify-center">
            <div className="text-center px-3 border-r border-gray-200 dark:border-slate-600">
              <p className="text-2xl font-bold text-green-500">{submission.correctAnswers}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">Correct</p>
            </div>
            <div className="text-center px-3 border-r border-gray-200 dark:border-slate-600">
              <p className="text-2xl font-bold text-red-500">{submission.wrongAnswers}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">Wrong</p>
            </div>
            <div className="text-center px-3">
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{submission.totalQuestions}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Snapshot Review */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-rozgar-blue" />
            Detailed Question Review
          </h2>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {submission.answers.map((ans, idx) => (
            <div key={idx} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  {ans.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="w-full">
                  <p className="font-medium text-gray-900 dark:text-white text-lg mb-4">
                    <span className="text-gray-400 mr-2">{idx + 1}.</span> 
                    {ans.question}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {ans.options.map((opt, optIdx) => {
                      let badgeClass = "border-gray-200 text-gray-600 dark:border-slate-600 dark:text-gray-400";
                      let indicator = "";

                      if (opt === ans.correctAnswer) {
                        badgeClass = "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400";
                        indicator = "(Correct Answer)";
                      } else if (opt === ans.selectedAnswer && !ans.isCorrect) {
                        badgeClass = "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
                        indicator = "(Candidate Answer)";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-lg border flex justify-between items-center ${badgeClass}`}>
                          <span>{opt}</span>
                          {indicator && <span className="text-xs font-bold opacity-75">{indicator}</span>}
                        </div>
                      );
                    })}
                  </div>

                  {!ans.selectedAnswer && (
                    <div className="inline-flex items-center px-3 py-1 rounded-md bg-yellow-50 text-yellow-700 text-sm font-medium border border-yellow-200">
                      Question Unanswered (Skipped)
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminExamSubmissionDetails;