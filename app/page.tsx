import ResumeUploader from '../components/ResumeUploader'
import ParticleBackground from '../components/ParticleBackground'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 relative overflow-hidden">
      <ParticleBackground />
      
      {/* Updated Navigation with red background */}
      <nav className="absolute top-0 left-0 w-full bg-red-600">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-blue-100">Resume Analyzer</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/auth/signup" 
              className="text-blue-100 px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-200"
            >
              Sign up
            </Link>
            <Link 
              href="/auth/signin" 
              className="text-blue-100 px-6 py-2 rounded-full bg-red-700 hover:bg-red-800 transition-all duration-200"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-16">
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-6xl font-bold text-blue-100 mb-6 animate-fade-in">
            Resume That Stands Out !!
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto animate-fade-in-delay">
            Analyze resume that perfectly describes your skills and job profile.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <ResumeUploader />
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 animate-fade-in-up">
          {[
            {
              title: 'AI-Powered Analysis',
              description: 'Get instant feedback on your resume using advanced AI',
              icon: '🤖'
            },
            {
              title: 'ATS-Friendly',
              description: 'Ensure your resume passes Applicant Tracking Systems',
              icon: '✨'
            },
            {
              title: 'Expert Insights',
              description: 'Receive professional recommendations for improvement',
              icon: '🎯'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 
                         transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-100">{feature.title}</h3>
              <p className="text-blue-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 