'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { FiUploadCloud, FiFile, FiCheck, FiLoader } from 'react-icons/fi'

export default function ResumeUploader() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

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

  if (!user) {
    return null
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Upload Your Resume</h2>
            <p className="text-slate-400">Get detailed analysis and improvement suggestions</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Logged in as</p>
            <p className="text-cyan-400 font-medium">{user.displayName || user.email}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out
              ${file 
                ? 'border-cyan-400/50 bg-cyan-500/5' 
                : 'border-slate-700 hover:border-blue-500/50 hover:bg-blue-500/5'
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
            
            <div className="space-y-4 text-center py-12">
              {file ? (
                <>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto">
                    <FiCheck className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-cyan-400">{file.name}</p>
                    <p className="text-slate-400 mt-1">Click to change file</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 flex items-center justify-center mx-auto border border-blue-500/20 group-hover:border-blue-500/40">
                    <FiUploadCloud className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-white">Drop your resume here</p>
                    <p className="text-slate-400 mt-1">Supports PDF format only</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/50 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className={`w-full rounded-xl py-4 px-6 flex items-center justify-center text-white font-medium
              ${!file || loading 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/20'
              } transition-all duration-200`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                Analyzing...
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