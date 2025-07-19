'use client'

import { useState } from 'react'
import { X, Flag } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string, description: string) => void
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')

  const reportReasons = [
    { value: 'spam', label: '스팸 또는 광고' },
    { value: 'hate', label: '혐오 발언' },
    { value: 'harassment', label: '괴롭힘 또는 공격' },
    { value: 'fake', label: '허위 정보' },
    { value: 'inappropriate', label: '부적절한 내용' },
    { value: 'copyright', label: '저작권 침해' },
    { value: 'other', label: '기타' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedReason) {
      onSubmit(selectedReason, description)
      // 폼 초기화
      setSelectedReason('')
      setDescription('')
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedReason('')
    setDescription('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Flag className="w-5 h-5 text-red-500" />
            <span>댓글 신고하기</span>
          </h3>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              신고 사유를 선택해주세요
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label key={reason.value} className="flex items-center">
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-gray-700">{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              상세 설명 (선택사항)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="신고 사유에 대한 상세한 설명을 입력해주세요..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>안내:</strong> 신고된 댓글은 관리자가 검토한 후 적절한 조치를 취합니다. 
              허위 신고는 제재 대상이 될 수 있습니다.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!selectedReason}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              신고하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
