import { useState, useEffect, useRef } from 'react'
import {
  Plus, Pencil, Trash2, Search, X, Upload, FileJson,
  Filter, HelpCircle, FileSpreadsheet
} from 'lucide-react'
import {
  getQuestions, getCategories, createQuestion, updateQuestion,
  deleteQuestion, bulkUploadQuestions, uploadExcel
} from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import toast from 'react-hot-toast'

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showExcelModal, setShowExcelModal] = useState(false)
  const [showJsonModal, setShowJsonModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    categoryId: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  })

  const [jsonInput, setJsonInput] = useState('')
  const [bulkCategory, setBulkCategory] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [selectedCategory, currentPage, searchTerm])

  const fetchCategories = async () => {
    try {
      const res = await getCategories()
      setCategories(res.data || [])
    } catch (err) {
      console.error('Fetch categories error:', err)
      toast.error('Failed to load categories')
    }
  }

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 10,
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      }
      const res = await getQuestions(params)
      setQuestions(res.data?.questions || [])
      setTotalPages(res.data?.totalPages || 1)
    } catch (err) {
      console.error('Fetch questions error:', err)
      toast.error('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.categoryId || !formData.question.trim() || !formData.correctAnswer.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    if (formData.options.some(o => !o.trim())) {
      toast.error('All options are required')
      return
    }

    setSubmitting(true)
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, formData)
        toast.success('Question updated successfully')
      } else {
        await createQuestion(formData)
        toast.success('Question created successfully')
      }
      setShowModal(false)
      setEditingQuestion(null)
      resetForm()
      fetchQuestions()
    } catch (err) {
      console.error('Submit error:', err)
      toast.error(err.response?.data?.message || 'Operation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteQuestion(deleteTarget._id)
      toast.success('Question deleted successfully')
      fetchQuestions()
    } catch (err) {
      console.error('Delete error:', err)
      toast.error(err.response?.data?.message || 'Failed to delete question')
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!bulkCategory) {
      toast.error('Please select a category first')
      return
    }

    const formDataFile = new FormData()
    formDataFile.append('file', file)
    formDataFile.append('categoryId', bulkCategory)

    setSubmitting(true)
    try {
      await uploadExcel(formDataFile)
      toast.success('Questions uploaded successfully')
      setShowExcelModal(false)
      setBulkCategory('')
      fetchQuestions()
    } catch (err) {
      console.error('Excel upload error:', err)
      toast.error(err.response?.data?.message || 'Failed to upload file')
    } finally {
      setSubmitting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleJsonUpload = async () => {
    if (!bulkCategory) {
      toast.error('Please select a category')
      return
    }
    if (!jsonInput.trim()) {
      toast.error('Please enter JSON data')
      return
    }

    setSubmitting(true)
    try {
      let questions
      try {
        questions = JSON.parse(jsonInput)
      } catch {
        toast.error('Invalid JSON format')
        setSubmitting(false)
        return
      }

      if (!Array.isArray(questions)) {
        toast.error('JSON must be an array of questions')
        setSubmitting(false)
        return
      }

      await bulkUploadQuestions({ categoryId: bulkCategory, questions })
      toast.success(`${questions.length} questions added successfully`)
      setShowJsonModal(false)
      setJsonInput('')
      setBulkCategory('')
      fetchQuestions()
    } catch (err) {
      console.error('JSON upload error:', err)
      toast.error(err.response?.data?.message || 'Failed to upload questions')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      categoryId: selectedCategory || '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    })
  }

  const openCreate = () => {
    setEditingQuestion(null)
    resetForm()
    setShowModal(true)
  }

  const openEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      categoryId: question.categoryId?._id || question.categoryId || '',
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer
    })
    setShowModal(true)
  }

  const updateOption = (index, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((o, i) => i === index ? value : o)
    }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Questions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage quiz questions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowExcelModal(true)} className="btn-outline text-sm py-2 px-3 flex items-center gap-1">
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button onClick={() => setShowJsonModal(true)} className="btn-outline text-sm py-2 px-3 flex items-center gap-1">
            <FileJson className="w-4 h-4" />
            JSON
          </button>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-3 flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="input-field pl-10"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1) }}
          className="input-field w-full sm:w-64"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Questions Table */}
      {loading ? (
        <LoadingSpinner />
      ) : questions.length === 0 ? (
        <div className="card p-12 text-center">
          <HelpCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || selectedCategory ? 'No questions match your filters' : 'No questions yet. Add your first question!'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header w-16">#</th>
                  <th className="table-header">Question</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">Options</th>
                  <th className="table-header">Correct</th>
                  <th className="table-header w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {questions.map((q, idx) => (
                  <tr key={q._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="table-cell text-gray-500">{(currentPage - 1) * 10 + idx + 1}</td>
                    <td className="table-cell max-w-xs">
                      <p className="truncate" title={q.question}>{q.question}</p>
                    </td>
                    <td className="table-cell">
                      <span className="px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                        {q.categoryId?.name || 'Unknown'}
                      </span>
                    </td>
                    <td className="table-cell text-gray-500 dark:text-gray-400">{q.options?.length || 0}</td>
                    <td className="table-cell">
                      <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                        {q.correctAnswer}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(q)} className="p-1.5 rounded text-gray-500 hover:text-rozgar-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(q)} className="p-1.5 rounded text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingQuestion(null); }}
        title={editingQuestion ? 'Edit Question' : 'Add Question'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the question..."
              className="input-field min-h-[80px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options *
            </label>
            <div className="space-y-2">
              {formData.options.map((option, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="input-field"
                  required
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Correct Answer *
            </label>
            <select
              value={formData.correctAnswer}
              onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: e.target.value }))}
              className="input-field"
              required
            >
              <option value="">Select correct answer</option>
              {formData.options.filter(o => o.trim()).map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowModal(false); setEditingQuestion(null); }}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary disabled:opacity-50" disabled={submitting}>
              {submitting ? 'Saving...' : (editingQuestion ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Excel Upload Modal */}
      <Modal
        isOpen={showExcelModal}
        onClose={() => { setShowExcelModal(false); setBulkCategory(''); }}
        title="Upload Excel Questions"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-rozgar-blue dark:text-blue-300 font-medium mb-2">Expected Format:</p>
            <div className="overflow-x-auto">
              <table className="text-xs w-full">
                <thead>
                  <tr className="border-b border-blue-200 dark:border-blue-800">
                    <th className="text-left py-1 pr-4">Question</th>
                    <th className="text-left py-1 pr-4">Option1</th>
                    <th className="text-left py-1 pr-4">Option2</th>
                    <th className="text-left py-1 pr-4">Option3</th>
                    <th className="text-left py-1 pr-4">Option4</th>
                    <th className="text-left py-1">CorrectAnswer</th>
                  </tr>
                </thead>
              </table>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Supports .xlsx, .xls, .csv files</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Category *
            </label>
            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Choose category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-rozgar-blue dark:hover:border-rozgar-blue transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {submitting ? 'Uploading...' : 'Click to upload file'}
            </p>
            <p className="text-xs text-gray-400 mt-1">.xlsx, .xls, .csv</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              className="hidden"
              disabled={submitting}
            />
          </div>
        </div>
      </Modal>

      {/* JSON Upload Modal */}
      <Modal
        isOpen={showJsonModal}
        onClose={() => { setShowJsonModal(false); setBulkCategory(''); setJsonInput(''); }}
        title="Import JSON Questions"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-rozgar-blue dark:text-blue-300 font-medium mb-2">Expected JSON Format:</p>
            <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto text-gray-700 dark:text-gray-300">
{`[
  {
    "question": "What is SEO?",
    "options": ["Search Engine Optimization", "Social Engine Optimization", "Search Engine Operator", "None"],
    "correctAnswer": "Search Engine Optimization"
  }
]`}
            </pre>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Category *
            </label>
            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Choose category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Paste JSON *
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your JSON array here..."
              className="input-field min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowJsonModal(false); setBulkCategory(''); setJsonInput(''); }}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              onClick={handleJsonUpload} 
              className="flex-1 btn-primary disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Importing...' : 'Import Questions'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default QuestionsPage