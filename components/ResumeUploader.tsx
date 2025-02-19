'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ErrorMessage from './ErrorMessage'
import { useAuth } from '@/contexts/AuthContext'

export default function ResumeUploader() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please upload a PDF file')
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !user) {
      setError('Please sign in to analyze resumes')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('userId', user.uid)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume')
      }

      router.push(`/results/${data.analysisId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Resume</h2>
        <p className="text-gray-600 mb-6">Get detailed analysis and improvement suggestions</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out
              ${file 
                ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              } cursor-pointer group`}
            onClick={() => document.getElementById('resume-upload')?.click()}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            
            <div className="space-y-4 text-center">
              {file ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-green-600">{file.name}</p>
                    <p className="text-sm text-green-500">Click to change file</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-100">
                    <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700 group-hover:text-blue-600">
                      Drop your resume here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">Supports PDF format only</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full py-4 px-6 rounded-xl text-white font-medium text-lg 
              flex items-center justify-center transition-all duration-200
              ${!file || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Analyzing Resume...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </form>
      </div>
    </div>
  )
} 