import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          type === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors ${
              type === 'danger'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-rozgar-blue hover:bg-rozgar-blue-dark'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog