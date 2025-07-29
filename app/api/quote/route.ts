import { NextRequest, NextResponse } from 'next/server'
import { oneInchAPI } from '@/lib/oneinch'
import { SwapParams } from '@/types'

export async function POST(request: NextRequest) {
  try {
    console.log('Quote API called - processing request...')
    const body = await request.json()
    
    console.log('Quote API received body:', body)
    
    // Handle different parameter names for backward compatibility
    const src = body.src || body.from
    const dst = body.dst || body.to  
    const amount = body.amount
    const from = body.from || body.wallet
    
    console.log('Extracted parameters:', { src, dst, amount, from })
    
    // Validate required parameters
    if (!src || !dst || !amount || !from) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: src/from, dst/to, amount, from/wallet',
          received: body
        },
        { status: 400 }
      )
    }
    
    const params: SwapParams = {
      src,
      dst,
      amount,
      from,
      slippage: body.slippage || 1
    }
    
    console.log('Getting swap quote with params:', params)
    
    const quote = await oneInchAPI.getSwapQuote(params)
    
    if (!quote) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to get swap quote from 1inch API'
        },
        { status: 500 }
      )
    }
    
    console.log('Successfully generated swap quote:', quote)
    
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
