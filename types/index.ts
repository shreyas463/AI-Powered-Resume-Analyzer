export interface User {
  uid: string
  email: string
  username: string
  createdAt: Date
}

export interface ResumeAnalysis {
  id: string
  userId: string
  fileName: string
  score: number
  summary: string
  keywords: string[]
  improvements: string[]
  jobFit: string
  createdAt: Date
} 