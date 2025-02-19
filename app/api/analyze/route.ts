import { NextResponse } from 'next/server'
import * as pdfjsLib from 'pdfjs-dist'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

// Configure PDF.js worker
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry')
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// Keywords to look for in resumes
const SKILL_KEYWORDS = {
  technical: [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'aws', 'docker',
    'kubernetes', 'mongodb', 'typescript', 'git', 'ci/cd', 'html', 'css'
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem solving', 'project management',
    'agile', 'scrum', 'collaboration', 'analytical', 'time management'
  ],
  certifications: [
    'aws certified', 'google certified', 'microsoft certified', 'cisco certified',
    'pmp', 'scrum master', 'comptia'
  ]
}

// Add resume validation criteria
const RESUME_INDICATORS = {
  sections: [
    'education',
    'experience',
    'skills',
    'work history',
    'employment',
    'qualification',
    'professional summary',
    'objective'
  ],
  contactInfo: [
    'email',
    'phone',
    '@',
    'linkedin',
    'github'
  ]
}

function isValidResume(text: string): { isValid: boolean; reason?: string } {
  const textLower = text.toLowerCase()
  
  // Check minimum length (roughly 200 words)
  if (text.split(/\s+/).length < 200) {
    return { 
      isValid: false, 
      reason: 'Document is too short to be a resume. A typical resume should be at least 200 words.' 
    }
  }

  // Check for essential resume sections
  const foundSections = RESUME_INDICATORS.sections.filter(section => 
    textLower.includes(section.toLowerCase())
  )
  if (foundSections.length < 2) {
    return { 
      isValid: false, 
      reason: 'Document appears to be missing essential resume sections like education, experience, or skills.' 
    }
  }

  // Check for contact information
  const hasContactInfo = RESUME_INDICATORS.contactInfo.some(item => 
    textLower.includes(item.toLowerCase())
  )
  if (!hasContactInfo) {
    return { 
      isValid: false, 
      reason: 'No contact information found. A resume should include email, phone, or other contact details.' 
    }
  }

  return { isValid: true }
}

function analyzeResume(text: string) {
  const textLower = text.toLowerCase()
  
  // First validate if it's a resume
  const validation = isValidResume(text)
  if (!validation.isValid) {
    throw new Error(validation.reason || 'Invalid resume format')
  }
  
  // Find skills
  const foundSkills = {
    technical: SKILL_KEYWORDS.technical.filter(skill => textLower.includes(skill.toLowerCase())),
    soft: SKILL_KEYWORDS.soft.filter(skill => textLower.includes(skill.toLowerCase())),
    certifications: SKILL_KEYWORDS.certifications.filter(cert => textLower.includes(cert.toLowerCase()))
  }

  // Calculate score based on various factors
  let score = 70 // Base score
  
  // Add points for skills
  score += Math.min(20, foundSkills.technical.length * 2) // Up to 20 points for technical skills
  score += Math.min(10, foundSkills.soft.length * 2) // Up to 10 points for soft skills
  score += Math.min(10, foundSkills.certifications.length * 5) // Up to 10 points for certifications

  // Check for education section
  if (textLower.includes('education') || textLower.includes('university') || textLower.includes('degree')) {
    score += 5
  }

  // Check for experience section
  if (textLower.includes('experience') || textLower.includes('work history')) {
    score += 5
  }

  // Generate improvements
  const improvements = []
  if (foundSkills.technical.length < 4) {
    improvements.push('Add more technical skills relevant to your field')
  }
  if (foundSkills.soft.length < 3) {
    improvements.push('Include more soft skills and interpersonal abilities')
  }
  if (!textLower.includes('achievement') && !textLower.includes('accomplished')) {
    improvements.push('Add specific achievements and quantifiable results')
  }
  if (foundSkills.certifications.length === 0) {
    improvements.push('Consider adding relevant certifications')
  }
  if (!textLower.includes('project')) {
    improvements.push('Include relevant project experience')
  }

  // Determine job fit
  const jobFit = score >= 85 ? 'Excellent fit for technical roles' :
                 score >= 70 ? 'Good fit with some areas for improvement' :
                 'Consider enhancing resume with suggested improvements'

  return {
    summary: `Resume shows ${foundSkills.technical.length} technical skills and ${foundSkills.soft.length} soft skills. ${jobFit.toLowerCase()}.`,
    keywords: [...foundSkills.technical, ...foundSkills.soft].slice(0, 8),
    improvements: improvements.slice(0, 4),
    score,
    jobFit
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