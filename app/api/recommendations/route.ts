import { NextRequest, NextResponse } from 'next/server'
import { oneInchAPI } from '@/lib/oneinch'
import { MoodAlgorithm } from '@/lib/mood-algorithm'
import { MOODS, getMoodById } from '@/data/moods'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const moodId = searchParams.get('mood') || 'balanced'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    console.log(`Getting recommendations for mood: ${moodId}`)
    
    // Get mood
    const mood = getMoodById(moodId)
    if (!mood) {
      return NextResponse.json(
        { success: false, error: 'Invalid mood ID' },
        { status: 400 }
      )
    }
    
    // Get tokens from 1inch
    const tokens = await oneInchAPI.getTokenList()
    
    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No tokens available' },
        { status: 500 }
      )
    }
    
    // Get mood-based recommendations
    const recommendations = MoodAlgorithm.getRecommendations(tokens, mood, limit)
    
    console.log(`Generated ${recommendations.length} recommendations for ${mood.name} mood`)
    
    return NextResponse.json({
      success: true,
      data: {
        mood: mood,
        recommendations: recommendations,
        totalTokens: tokens.length
      },
      count: recommendations.length
    })
  } catch (error) {
    console.error('Recommendations API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get recommendations',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
