'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { FiAward, FiBarChart2, FiCheckCircle, FiCpu, FiMessageCircle, FiStar, FiTrendingUp } from 'react-icons/fi'

interface AnalysisResult {
  score: number
  professionalAssessment: string
  strengths: string[]
  improvements: string[]
  keyDifferentiators: string[]
  details: {
    technicalSkills: {
      programming: string[]
      webTechnologies: string[]
      databases: string[]
      cloud: string[]
      tools: string[]
    }
    softSkills: {
      leadership: string[]
      communication: string[]
      projectManagement: string[]
      problemSolving: string[]
    }
    certifications: string[]
    hasQuantifiableAchievements: boolean
  }
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
    if (score >= 90) return 'from-emerald-400 to-emerald-600'
    if (score >= 80) return 'from-blue-400 to-blue-600'
    if (score >= 70) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Exceptional'
    if (score >= 80) return 'Strong'
    if (score >= 70) return 'Good'
    return 'Needs Improvement'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Analyzing your resume...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            Return to upload page
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Resume Analysis Results</h1>
          <p className="text-slate-300">Comprehensive evaluation and professional insights</p>
        </div>
        
        {analysis && (
          <div className="space-y-8">
            {/* Score and Assessment Card */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                <div className={`bg-gradient-to-r ${getScoreColor(analysis.score)} p-8`}>
                  <h2 className="text-2xl font-semibold mb-2 text-white">Resume Score</h2>
                  <div className="flex items-end">
                    <div className="text-6xl font-bold text-white">{analysis.score}</div>
                    <div className="text-2xl ml-2 mb-1 text-white/90">/100</div>
                  </div>
                  <p className="mt-2 text-white/90">{getScoreDescription(analysis.score)}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-8">
                <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
                  <FiBarChart2 className="mr-2" />
                  Professional Assessment
                </h2>
                <p className="text-slate-300 leading-relaxed">{analysis.professionalAssessment}</p>
              </div>
            </div>

            {/* Key Differentiators */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                <FiStar className="mr-2" />
                Key Differentiators
              </h2>
              <div className="flex flex-wrap gap-3">
                {analysis.keyDifferentiators.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-500/10 text-blue-300 border border-blue-500/20 
                             rounded-xl text-sm font-medium hover:bg-blue-500/20 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths and Improvements Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-8">
                <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Key Strengths
                </h2>
                <div className="space-y-4">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 
                                    rounded-xl flex items-center justify-center mr-3">
                        <span className="text-emerald-400 font-medium">✓</span>
                      </div>
                      <p className="text-slate-300 mt-1">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-8">
                <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Areas for Improvement
                </h2>
                <div className="space-y-4">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 border border-blue-500/20 
                                    rounded-xl flex items-center justify-center mr-3">
                        <span className="text-blue-400 font-medium">{index + 1}</span>
                      </div>
                      <p className="text-slate-300 mt-1">{improvement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Skills Analysis */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-8 text-white flex items-center">
                <FiCpu className="mr-2" />
                Detailed Skills Analysis
              </h2>
              
              {/* Technical Skills */}
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-medium text-white mb-4">Technical Competencies</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(analysis.details.technicalSkills).map(([category, skills]) => (
                    skills.length > 0 && (
                      <div key={category} className="space-y-2">
                        <h4 className="text-blue-300 font-medium capitalize">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 
                                       rounded-lg text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-white mb-4">Professional Skills</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(analysis.details.softSkills).map(([category, skills]) => (
                    skills.length > 0 && (
                      <div key={category} className="space-y-2">
                        <h4 className="text-cyan-300 font-medium capitalize">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 
                                       rounded-lg text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            {analysis.details.certifications.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-8">
                <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                  <FiAward className="mr-2" />
                  Professional Certifications
                </h2>
                <div className="flex flex-wrap gap-3">
                  {analysis.details.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-purple-500/10 text-purple-300 border border-purple-500/20 
                               rounded-xl text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 
                           text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 
                           transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl"
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