'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { FiAward, FiBriefcase, FiCode, FiEdit3, FiBookOpen, FiUser, FiEye, FiLayout } from 'react-icons/fi'
import ResumePreview from '@/components/ResumePreview'
import TemplateSelector from '@/components/TemplateSelector'
import { templates } from '@/components/resumeTemplates'

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface FormData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    portfolio: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: {
    technical: string[];
    soft: string[];
  };
  certifications: Certification[];
}

const initialFormData: FormData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: ''
  },
  summary: '',
  experience: [{
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    responsibilities: ['']
  }],
  education: [{
    degree: '',
    school: '',
    location: '',
    graduationDate: '',
    gpa: '',
    highlights: ['']
  }],
  skills: {
    technical: [''],
    soft: ['']
  },
  certifications: [{
    name: '',
    issuer: '',
    date: '',
    url: ''
  }]
}

export default function CreateResume() {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')

  const steps = [
    {
      title: 'Choose Template',
      icon: <FiLayout className="w-6 h-6" />,
      description: 'Select a professional template for your resume'
    },
    {
      title: 'Personal Information',
      icon: <FiUser className="w-6 h-6" />,
      description: 'Start with your basic contact information'
    },
    {
      title: 'Professional Summary',
      icon: <FiEdit3 className="w-6 h-6" />,
      description: 'Write a brief overview of your professional background'
    },
    {
      title: 'Work Experience',
      icon: <FiBriefcase className="w-6 h-6" />,
      description: 'Add your work history and achievements'
    },
    {
      title: 'Education',
      icon: <FiBookOpen className="w-6 h-6" />,
      description: 'List your educational background'
    },
    {
      title: 'Skills',
      icon: <FiCode className="w-6 h-6" />,
      description: 'Add your technical and soft skills'
    },
    {
      title: 'Certifications',
      icon: <FiAward className="w-6 h-6" />,
      description: 'Include relevant certifications and achievements'
    },
    {
      title: 'Preview & Download',
      icon: <FiEye className="w-6 h-6" />,
      description: 'Review and download your resume'
    }
  ]

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }))
  }

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      summary: e.target.value
    }))
  }

  const handleEducationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newEducation = [...prev.education]
      newEducation[index] = {
        ...newEducation[index],
        [field]: value
      }
      return { ...prev, education: newEducation }
    })
  }

  const handleExperienceChange = (index: number, field: string, value: string | boolean) => {
    setFormData(prev => {
      const newExperience = [...prev.experience]
      newExperience[index] = {
        ...newExperience[index],
        [field]: value
      }
      return { ...prev, experience: newExperience }
    })
  }

  const handleSkillsChange = (type: 'technical' | 'soft', index: number, value: string) => {
    setFormData(prev => {
      const newSkills = [...prev.skills[type]]
      newSkills[index] = value
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [type]: newSkills
        }
      }
    })
  }

  const handleCertificationChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newCertifications = [...prev.certifications]
      newCertifications[index] = {
        ...newCertifications[index],
        [field]: value
      }
      return { ...prev, certifications: newCertifications }
    })
  }

  const addListItem = (section: 'education' | 'experience' | 'certifications') => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], initialFormData[section][0]]
    }))
  }

  const removeListItem = (section: 'education' | 'experience' | 'certifications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const addSkill = (type: 'technical' | 'soft') => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], '']
      }
    }))
  }

  const removeSkill = (type: 'technical' | 'soft', index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index)
      }
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.uid,
          formData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create resume')
      }

      const data = await response.json()
      router.push(`/results/${data.analysisId}`)
    } catch (error) {
      console.error('Error creating resume:', error)
      // Handle error (show notification, etc.)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Create Your Resume</h1>
          <p className="text-slate-300">Build a professional resume with our AI-powered assistant</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-blue-400' : 'text-slate-600'
                }`}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${index <= currentStep ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'}
                  border-2 transition-colors duration-200
                `}>
                  {step.icon}
                </div>
                <span className="text-sm font-medium hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 left-0 h-1 bg-slate-700 w-full rounded">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>
              
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                             text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                             text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                             text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.personalInfo.location}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                             text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    LinkedIn (optional)
                  </label>
                  <input
                    type="url"
                    name="linkedIn"
                    value={formData.personalInfo.linkedIn}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                             text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Portfolio Website (optional)
                  </label>
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.personalInfo.portfolio}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                             text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="https://johndoe.com"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Professional Summary
                </label>
                <textarea
                  value={formData.summary}
                  onChange={handleSummaryChange}
                  rows={6}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                           text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Write a brief summary of your professional background, key achievements, and career goals..."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>

              {formData.experience.map((exp, index) => (
                <div key={index} className="bg-slate-900/50 p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Experience {index + 1}</h3>
                    {index > 0 && (
                      <button
                        onClick={() => removeListItem('experience', index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index] = { ...exp, title: e.target.value };
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index] = { ...exp, company: e.target.value };
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index] = { ...exp, location: e.target.value };
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="City, State"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index] = { ...exp, startDate: e.target.value };
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index] = { ...exp, endDate: e.target.value };
                          setFormData({ ...formData, experience: newExp });
                        }}
                        disabled={exp.current}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors
                                 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current}
                        onChange={(e) => {
                          const newExp = [...formData.experience];
                          newExp[index] = { ...exp, current: e.target.checked };
                          setFormData({ ...formData, experience: newExp });
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`current-${index}`} className="text-sm font-medium text-slate-300">
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Key Responsibilities & Achievements
                    </label>
                    <textarea
                      value={exp.responsibilities.join('\n')}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index] = { 
                          ...exp, 
                          responsibilities: e.target.value.split('\n').filter(r => r.trim() !== '') 
                        };
                        setFormData({ ...formData, experience: newExp });
                      }}
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                               text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addListItem('experience')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Add Another Experience
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>

              {formData.education.map((edu, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-6 mb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index] = { ...edu, degree: e.target.value };
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        School
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const newEdu = [...formData.education];
                          newEdu[index] = { ...edu, school: e.target.value };
                          setFormData({ ...formData, education: newEdu });
                        }}
                        className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Highlights & Achievements (one per line)
                    </label>
                    <textarea
                      value={edu.highlights.join('\n')}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index] = {
                          ...edu,
                          highlights: e.target.value.split('\n').filter(h => h.trim() !== '')
                        };
                        setFormData({ ...formData, education: newEdu });
                      }}
                      rows={4}
                      className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Technical Skills (one per line)
                </label>
                <textarea
                  value={formData.skills.technical.join('\n')}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      skills: {
                        ...formData.skills,
                        technical: e.target.value.split('\n').filter(s => s.trim() !== '')
                      }
                    });
                  }}
                  rows={4}
                  className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each skill on a new line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Professional Skills (one per line)
                </label>
                <textarea
                  value={formData.skills.soft.join('\n')}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      skills: {
                        ...formData.skills,
                        soft: e.target.value.split('\n').filter(s => s.trim() !== '')
                      }
                    });
                  }}
                  rows={4}
                  className="w-full bg-slate-900 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter each skill on a new line"
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>

              {formData.certifications.map((cert, index) => (
                <div key={index} className="bg-slate-900/50 p-6 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Certification {index + 1}</h3>
                    {index > 0 && (
                      <button
                        onClick={() => removeListItem('certifications', index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Issuing Organization
                      </label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Amazon Web Services"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Date Earned
                      </label>
                      <input
                        type="month"
                        value={cert.date}
                        onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Credential URL (optional)
                      </label>
                      <input
                        type="url"
                        value={cert.url}
                        onChange={(e) => handleCertificationChange(index, 'url', e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="https://www.credential.net/..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addListItem('certifications')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                + Add Another Certification
              </button>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-300 mb-8">{steps[currentStep].description}</p>

              <ResumePreview 
                formData={formData}
                templateId={selectedTemplate}
              />
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className={`px-6 py-2 rounded-lg text-slate-300 hover:text-white transition-colors
                       ${currentStep === 0 ? 'invisible' : ''}`}
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  handleSubmit()
                } else {
                  setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
                }
              }}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 
                       text-white font-medium hover:from-blue-600 hover:to-cyan-600 
                       transition-all duration-200 shadow-lg shadow-blue-500/20 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? (
                loading ? 'Creating...' : 'Create Resume'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
