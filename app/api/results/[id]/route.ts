import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In a real application, you would fetch the results from a database
    // For now, we'll return mock data
    const mockAnalysis = {
      summary: "Your resume demonstrates strong technical skills and professional experience. The format is clear and well-structured, making it easy for both ATS systems and human recruiters to parse.",
      keywords: [
        "React",
        "TypeScript",
        "Node.js",
        "Project Management",
        "Team Leadership",
        "Agile Development"
      ],
      improvements: [
        "Consider adding more quantifiable achievements",
        "Include specific metrics and results from your projects",
        "Add relevant certifications if available",
        "Strengthen your professional summary"
      ],
      score: 85,
      jobFit: "Strong match for software development roles"
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error('Error fetching analysis results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis results' },
      { status: 500 }
    )
  }
} 