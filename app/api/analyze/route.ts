import { NextResponse } from 'next/server'
import * as pdfjsLib from 'pdfjs-dist'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Configure PDF.js worker
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry')
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// Enhanced keywords and categories for resume analysis
const RESUME_CRITERIA = {
  technicalSkills: {
    programming: [
      'javascript', 'python', 'java', 'c++', 'ruby', 'swift', 'kotlin', 'go',
      'rust', 'php', 'typescript', 'scala', 'r', 'matlab'
    ],
    webTechnologies: [
      'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
      'html5', 'css3', 'sass', 'webpack', 'babel', 'jquery', 'bootstrap'
    ],
    databases: [
      'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
      'cassandra', 'oracle', 'dynamodb', 'firebase'
    ],
    cloud: [
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
      'circleci', 'github actions', 'serverless', 'lambda'
    ],
    tools: [
      'git', 'jira', 'confluence', 'bitbucket', 'gitlab', 'vscode', 'intellij',
      'postman', 'swagger', 'figma', 'sketch'
    ]
  },
  softSkills: {
    leadership: [
      'leadership', 'team lead', 'managed', 'supervised', 'mentored', 'directed',
      'coordinated', 'spearheaded', 'initiated'
    ],
    communication: [
      'communication', 'presentation', 'documentation', 'client interaction',
      'stakeholder', 'collaboration', 'interpersonal', 'public speaking'
    ],
    projectManagement: [
      'agile', 'scrum', 'kanban', 'waterfall', 'sprint planning', 'roadmap',
      'project management', 'risk management', 'budget', 'timeline'
    ],
    problemSolving: [
      'problem solving', 'analytical', 'troubleshooting', 'debugging',
      'optimization', 'innovation', 'strategic thinking', 'research'
    ]
  },
  certifications: [
    'aws certified', 'google certified', 'microsoft certified', 'cisco certified',
    'pmp', 'scrum master', 'comptia', 'cka', 'ceh', 'cissp', 'itil'
  ],
  education: [
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'certification', 'diploma'
  ],
  experience: [
    'years of experience', 'work history', 'professional experience',
    'employment history', 'career history'
  ],
  achievements: [
    'achieved', 'improved', 'increased', 'reduced', 'saved', 'awarded',
    'recognized', 'delivered', 'implemented', 'launched', 'developed'
  ],
  metrics: [
    '%', 'percent', 'million', 'billion', 'k', 'users', 'customers',
    'revenue', 'cost', 'budget', 'roi', 'kpi'
  ]
}

// Resume sections that should be present
const ESSENTIAL_SECTIONS = [
  'summary',
  'experience',
  'education',
  'skills',
  'contact'
]

function isValidResume(text: string): { isValid: boolean; reason?: string } {
  const textLower = text.toLowerCase()
  
  // Check minimum length (roughly 300 words for a professional resume)
  if (text.split(/\s+/).length < 300) {
    return { 
      isValid: false, 
      reason: 'Resume appears too brief. A professional resume typically contains at least 300 words.' 
    }
  }

  // Check for essential sections
  const missingSections = ESSENTIAL_SECTIONS.filter(section => 
    !textLower.includes(section.toLowerCase())
  )
  
  if (missingSections.length > 2) {
    return { 
      isValid: false, 
      reason: `Resume is missing essential sections: ${missingSections.join(', ')}` 
    }
  }

  // Check for contact information (email pattern)
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  if (!emailPattern.test(text)) {
    return { 
      isValid: false, 
      reason: 'No valid email address found. Professional resumes should include contact information.' 
    }
  }

  return { isValid: true }
}

function analyzeResume(text: string) {
  const textLower = text.toLowerCase()
  const words = text.split(/\s+/)
  
  // Validate resume
  const validation = isValidResume(text)
  if (!validation.isValid) {
    throw new Error(validation.reason || 'Invalid resume format')
  }
  
  // Initialize scoring categories
  const analysis = {
    technicalSkills: {
      programming: [],
      webTechnologies: [],
      databases: [],
      cloud: [],
      tools: []
    },
    softSkills: {
      leadership: [],
      communication: [],
      projectManagement: [],
      problemSolving: []
    },
    certifications: [],
    metrics: [],
    achievements: []
  }
  
  // Analyze each category
  Object.entries(RESUME_CRITERIA.technicalSkills).forEach(([category, keywords]) => {
    analysis.technicalSkills[category] = keywords.filter(skill => 
      textLower.includes(skill.toLowerCase())
    )
  })
  
  Object.entries(RESUME_CRITERIA.softSkills).forEach(([category, keywords]) => {
    analysis.softSkills[category] = keywords.filter(skill => 
      textLower.includes(skill.toLowerCase())
    )
  })
  
  analysis.certifications = RESUME_CRITERIA.certifications.filter(cert => 
    textLower.includes(cert.toLowerCase())
  )
  
  analysis.metrics = RESUME_CRITERIA.metrics.filter(metric => 
    textLower.includes(metric.toLowerCase())
  )
  
  analysis.achievements = RESUME_CRITERIA.achievements.filter(achievement => 
    textLower.includes(achievement.toLowerCase())
  )

  // Calculate comprehensive score
  let score = 50 // Base score
  
  // Technical skills scoring (max 25 points)
  const technicalSkillsCount = Object.values(analysis.technicalSkills)
    .reduce((sum, skills) => sum + skills.length, 0)
  score += Math.min(25, technicalSkillsCount * 2)
  
  // Soft skills scoring (max 15 points)
  const softSkillsCount = Object.values(analysis.softSkills)
    .reduce((sum, skills) => sum + skills.length, 0)
  score += Math.min(15, softSkillsCount * 2)
  
  // Certifications (max 10 points)
  score += Math.min(10, analysis.certifications.length * 5)
  
  // Quantifiable achievements (max 15 points)
  const hasMetrics = analysis.metrics.length > 0
  const hasAchievements = analysis.achievements.length > 0
  score += hasMetrics ? 8 : 0
  score += Math.min(7, analysis.achievements.length)
  
  // Format and length (max 5 points)
  score += words.length >= 400 ? 5 : 
           words.length >= 300 ? 3 : 0

  // Generate professional insights
  const improvements = []
  const strengths = []
  
  // Technical skills analysis
  if (technicalSkillsCount < 6) {
    improvements.push('Enhance your technical skill set with more industry-relevant technologies')
  } else {
    strengths.push('Strong technical foundation across multiple domains')
  }
  
  // Soft skills analysis
  if (softSkillsCount < 4) {
    improvements.push('Incorporate more leadership and communication examples')
  } else {
    strengths.push('Well-rounded soft skills profile')
  }
  
  // Achievements analysis
  if (!hasMetrics) {
    improvements.push('Add quantifiable achievements and metrics to demonstrate impact')
  } else {
    strengths.push('Strong results-oriented profile with measurable achievements')
  }
  
  // Certifications analysis
  if (analysis.certifications.length === 0) {
    improvements.push('Consider adding relevant professional certifications')
  } else {
    strengths.push('Professional credentials demonstrate commitment to growth')
  }

  // Determine professional assessment
  const professionalAssessment = score >= 90 ? 'Outstanding professional profile' :
                                score >= 80 ? 'Strong candidate with proven expertise' :
                                score >= 70 ? 'Solid profile with room for enhancement' :
                                'Profile needs significant improvement'

  // Identify key differentiators
  const keyDifferentiators = [
    ...new Set([
      ...Object.values(analysis.technicalSkills).flat(),
      ...Object.values(analysis.softSkills).flat(),
      ...analysis.certifications
    ])
  ].slice(0, 10)

  return {
    score,
    professionalAssessment,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    keyDifferentiators,
    details: {
      technicalSkills: analysis.technicalSkills,
      softSkills: analysis.softSkills,
      certifications: analysis.certifications,
      hasQuantifiableAchievements: hasMetrics
    }
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer))
    const pdf = await loadingTask.promise
    let fullText = '';

    // Get all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
      fullText += pageText + ' '
    }

    return fullText.trim()
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    try {
      const text = await extractTextFromPDF(file)
      
      if (!text || text.length < 10) {
        return NextResponse.json(
          { error: 'Unable to extract text from PDF. Please ensure the file is not empty.' },
          { status: 400 }
        )
      }

      const analysis = analyzeResume(text)
      
      try {
        // Add timestamp and userId to analysis data
        const analysisData = {
          ...analysis,
          userId,
          fileName: file.name,
          createdAt: new Date().toISOString(),
        }

        // Store in Firestore
        const analysisRef = await addDoc(collection(db, 'analyses'), analysisData)

        return NextResponse.json({
          analysisId: analysisRef.id,
          ...analysis
        })
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError)
        return NextResponse.json(
          { error: 'Failed to save analysis results' },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('PDF processing error:', error)
      return NextResponse.json(
        { error: 'Failed to process PDF file. Please ensure it is a valid resume.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    )
  }
}