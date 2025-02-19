'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface AnalysisResult {
  summary: string
  keywords: string[]
  improvements: string[]
  score: number
  jobFit: string
}

export default function ResultsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/results/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch analysis results')
        }
        const data = await response.json()
        setAnalysis(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [params.id])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600'
    if (score >= 60) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your resume...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Link href="/" className="text-blue-500 hover:underline">
            Return to upload page
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume Analysis Results</h1>
          <p className="text-gray-600">Detailed feedback and suggestions for your resume</p>
        </div>
        
        {analysis && (
          <div className="space-y-8">
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className={`bg-gradient-to-r ${getScoreColor(analysis.score)} p-8 text-white`}>
                <h2 className="text-2xl font-semibold mb-2">Overall Score</h2>
                <div className="flex items-end">
                  <div className="text-6xl font-bold">{analysis.score}</div>
                  <div className="text-2xl ml-2 mb-1">/100</div>
                </div>
                <p className="mt-2 text-white/90">{analysis.jobFit}</p>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Key Skills Identified</h2>
              <div className="flex flex-wrap gap-3">
                {analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium
                             hover:bg-blue-100 transition-colors duration-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Improvements Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Suggested Improvements</h2>
              <div className="space-y-4">
                {analysis.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl
                           hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Analyze Another Resume
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 