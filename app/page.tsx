'use client'

import ResumeUploader from '../components/ResumeUploader'
import Link from 'next/link'
import { FiAward, FiCpu, FiTarget } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await logout()
      router.push('/auth/signin')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-opacity-90 bg-slate-900 backdrop-blur-lg z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Resume Analyzer
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-300">
                  Welcome, <span className="text-cyan-400 font-medium">{user.email}</span>
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-slate-200 px-6 py-2 hover:text-white transition-all duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/signup" 
                  className="text-slate-200 px-6 py-2 hover:text-white transition-all duration-200"
                >
                  Sign up
                </Link>
                <Link 
                  href="/auth/signin" 
                  className="text-white px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-sm font-medium">
              AI-Powered Resume Analysis
            </span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Create a Resume That{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Stands Out
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Get instant, AI-powered insights to optimize your resume and increase your chances of landing your dream job.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-32">
          {user ? (
            <ResumeUploader />
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Sign in to Upload Your Resume</h3>
              <p className="text-slate-300 mb-6">Create an account or sign in to analyze your resume and get personalized feedback.</p>
              <div className="flex justify-center gap-4">
                <Link 
                  href="/auth/signup" 
                  className="text-slate-200 px-6 py-2 hover:text-white transition-all duration-200"
                >
                  Sign up
                </Link>
                <Link 
                  href="/auth/signin" 
                  className="text-white px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            {
              title: 'AI-Powered Analysis',
              description: 'Advanced machine learning algorithms analyze your resume in seconds',
              icon: <FiCpu className="w-6 h-6" />
            },
            {
              title: 'ATS Optimization',
              description: 'Ensure your resume passes through Applicant Tracking Systems',
              icon: <FiAward className="w-6 h-6" />
            },
            {
              title: 'Expert Recommendations',
              description: 'Receive tailored suggestions to enhance your professional profile',
              icon: <FiTarget className="w-6 h-6" />
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 hover:bg-slate-800/60 
                           transition-all duration-300 border border-slate-700 hover:border-blue-500/50">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-6">
                  <div className="text-blue-400">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}