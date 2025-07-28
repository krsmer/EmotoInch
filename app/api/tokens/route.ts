import { NextRequest, NextResponse } from 'next/server'
import { oneInchAPI } from '@/lib/oneinch'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching token list from 1inch API...')
    
    const tokens = await oneInchAPI.getTokenList()
    
    console.log(`Successfully fetched ${tokens.length} tokens`)
    
    return NextResponse.json({
      success: true,
      data: tokens,
      count: tokens.length
    })
  } catch (error) {
    console.error('Token API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tokens',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
