import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  responsibilities: string[]
}

interface Education {
  degree: string
  school: string
  location: string
  graduationDate: string
  gpa?: string
  highlights: string[]
}

interface Certification {
  name: string
  issuer: string
  date: string
  url?: string
}

interface FormData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedIn?: string
    portfolio?: string
  }
  summary: string
  experience: Experience[]
  education: Education[]
  skills: {
    technical: string[]
    soft: string[]
  }
  certifications: Certification[]
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId, formData } = await request.json() as { userId: string, formData: FormData }

    if (!userId || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Format the resume content
    const resumeContent = `
${formData.personalInfo.fullName}
${formData.personalInfo.email} | ${formData.personalInfo.phone} | ${formData.personalInfo.location}
${formData.personalInfo.linkedIn ? formData.personalInfo.linkedIn : ''}
${formData.personalInfo.portfolio ? formData.personalInfo.portfolio : ''}

PROFESSIONAL SUMMARY
${formData.summary}

WORK EXPERIENCE
${formData.experience.map((exp: Experience) => `
${exp.title}
${exp.company} | ${exp.location}
${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.responsibilities.map((resp: string) => `• ${resp}`).join('\n')}
`).join('\n')}

EDUCATION
${formData.education.map((edu: Education) => `
${edu.degree}
${edu.school} | ${edu.location}
Graduated: ${edu.graduationDate}
${edu.gpa ? `GPA: ${edu.gpa}` : ''}
${edu.highlights.map((highlight: string) => `• ${highlight}`).join('\n')}
`).join('\n')}

SKILLS
Technical Skills:
${formData.skills.technical.join(', ')}

Professional Skills:
${formData.skills.soft.join(', ')}

${formData.certifications.length > 0 ? `
CERTIFICATIONS
${formData.certifications.map((cert: Certification) => `
${cert.name}
${cert.issuer} | ${cert.date}
${cert.url ? cert.url : ''}
`).join('\n')}
` : ''}
`.trim()

    // Store in Firestore
    const analysisData = {
      userId,
      createdAt: new Date().toISOString(),
      formData,
      resumeContent,
      type: 'created',
      score: 85, // Base score for AI-created resumes
      professionalAssessment: 'Professional resume created with AI assistance',
      strengths: [
        'Well-structured format',
        'Clear professional summary',
        'Detailed work experience'
      ],
      improvements: [
        'Consider adding more quantifiable achievements',
        'Expand your skill set in relevant areas',
        'Add more industry certifications'
      ],
      keyDifferentiators: [
        ...formData.skills.technical.slice(0, 3),
        ...formData.skills.soft.slice(0, 2)
      ],
      details: {
        technicalSkills: {
          programming: formData.skills.technical.filter((skill: string) => 
            skill.toLowerCase().includes('javascript') || 
            skill.toLowerCase().includes('python') ||
            skill.toLowerCase().includes('java')
          ),
          webTechnologies: formData.skills.technical.filter((skill: string) =>
            skill.toLowerCase().includes('react') ||
            skill.toLowerCase().includes('node') ||
            skill.toLowerCase().includes('html') ||
            skill.toLowerCase().includes('css')
          ),
          databases: formData.skills.technical.filter((skill: string) =>
            skill.toLowerCase().includes('sql') ||
            skill.toLowerCase().includes('mongo') ||
            skill.toLowerCase().includes('database')
          ),
          cloud: formData.skills.technical.filter((skill: string) =>
            skill.toLowerCase().includes('aws') ||
            skill.toLowerCase().includes('azure') ||
            skill.toLowerCase().includes('cloud')
          ),
          tools: formData.skills.technical.filter((skill: string) =>
            skill.toLowerCase().includes('git') ||
            skill.toLowerCase().includes('docker') ||
            skill.toLowerCase().includes('kubernetes')
          )
        },
        softSkills: {
          leadership: formData.skills.soft.filter((skill: string) =>
            skill.toLowerCase().includes('lead') ||
            skill.toLowerCase().includes('manage') ||
            skill.toLowerCase().includes('direct')
          ),
          communication: formData.skills.soft.filter((skill: string) =>
            skill.toLowerCase().includes('communicat') ||
            skill.toLowerCase().includes('present') ||
            skill.toLowerCase().includes('speak')
          ),
          projectManagement: formData.skills.soft.filter((skill: string) =>
            skill.toLowerCase().includes('project') ||
            skill.toLowerCase().includes('agile') ||
            skill.toLowerCase().includes('scrum')
          ),
          problemSolving: formData.skills.soft.filter((skill: string) =>
            skill.toLowerCase().includes('problem') ||
            skill.toLowerCase().includes('analytic') ||
            skill.toLowerCase().includes('solution')
          )
        },
        certifications: formData.certifications.map((cert: Certification) => cert.name),
        hasQuantifiableAchievements: formData.experience.some((exp: Experience) =>
          exp.responsibilities.some((resp: string) =>
            resp.match(/\d+%|\$\d+|\d+ years|\d+ team|\d+ project/i)
          )
        )
      }
    }

    const analysisRef = await addDoc(collection(db, 'analyses'), analysisData)

    return NextResponse.json({
      analysisId: analysisRef.id,
      message: 'Resume created successfully'
    })
  } catch (error) {
    console.error('Error creating resume:', error)
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    )
  }
}
