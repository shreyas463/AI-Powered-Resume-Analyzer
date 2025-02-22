import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const analysisRef = doc(db, 'analyses', params.id)
    const analysisSnap = await getDoc(analysisRef)

    if (!analysisSnap.exists()) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    const analysis = analysisSnap.data()

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error fetching analysis results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis results' },
      { status: 500 }
    )
  }
}