import { NextRequest, NextResponse } from 'next/server'
import { oneInchAPI } from '@/lib/oneinch'
import { SwapParams } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SwapParams
    
    // Validate required parameters
    if (!body.src || !body.dst || !body.amount || !body.from) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: src, dst, amount, from'
        },
        { status: 400 }
      )
    }
    
    console.log('Getting swap quote:', {
      from: body.src,
      to: body.dst,
      amount: body.amount,
      slippage: body.slippage || 1
    })
    
    const quote = await oneInchAPI.getSwapQuote({
      ...body,
      slippage: body.slippage || 1 // Default 1% slippage
    })
    
    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get swap quote'
        },
        { status: 500 }
      )
    }
    
    console.log('Successfully generated swap quote')
    
    return NextResponse.json({
      success: true,
      data: quote
    })
  } catch (error) {
    console.error('Quote API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get swap quote',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
