'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FileInfo {
  name: string
  size: number
}

interface DownloadData {
  senderName: string
  files: FileInfo[]
  totalSize: number
}

export default function DownloadPage() {
  const [shareCode, setShareCode] = useState('')
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const validateShareCode = async () => {
    if (!shareCode.trim()) {
      setError('Please enter a share code')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/validate?code=${shareCode}`)
      
      if (response.ok) {
        const data = await response.json()
        setDownloadData(data)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Invalid share code or files expired')
      }
    } catch (error) {
      console.error('Validation error:', error)
      setError('Failed to validate share code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!downloadData) return

    try {
      const response = await fetch(`/api/download?code=${shareCode}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `files-${shareCode}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Download failed. Please try again.')
      }
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    }
  }

  if (downloadData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Files Ready to Download</h1>
            <p className="text-gray-600">Files shared by <span className="font-semibold text-blue-600">{downloadData.senderName}</span></p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-4">Files ({downloadData.files.length}):</h3>
            <ul className="space-y-2">
              {downloadData.files.map((file, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span className="text-gray-700">{file.name}</span>
                  <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">Total Size:</span>
                <span className="text-blue-600">{(downloadData.totalSize / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Download All Files
            </button>
            
            <button
              onClick={() => {
                setDownloadData(null)
                setShareCode('')
              }}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Enter Different Code
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Files will be automatically deleted after 24 hours. Download them now to avoid losing access.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Download Files</h1>
            <p className="text-gray-600">Enter the share code to download files</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Code
              </label>
              <input
                type="text"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-lg tracking-wider"
                placeholder="A9F-KQ21"
                maxLength={12}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={validateShareCode}
              disabled={loading || !shareCode.trim()}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Validating...' : 'Download Files'}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-green-600 hover:text-green-800 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}