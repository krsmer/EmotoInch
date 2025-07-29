import { NextRequest, NextResponse } from 'next/server'
import { oneInchAPI } from '@/lib/oneinch'
import { SwapParams } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as SwapParams & {
      slippage?: number
      gasPrice?: string
      disableEstimate?: boolean
    }
    
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

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(body.from)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid wallet address format'
        },
        { status: 400 }
      )
    }

    console.log('Executing swap transaction:', {
      from: body.src,
      to: body.dst,
      amount: body.amount,
      wallet: body.from,
      slippage: body.slippage || 1
    })

    const swapTransaction = await oneInchAPI.executeSwap({
      ...body,
      slippage: body.slippage || 1, // Default 1% slippage
      gasPrice: body.gasPrice || '20000000000', // Default 20 gwei
      disableEstimate: body.disableEstimate || false
    })

    if (!swapTransaction) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create swap transaction'
        },
        { status: 500 }
      )
    }

    console.log('Successfully created swap transaction')

    return NextResponse.json({
      success: true,
      data: swapTransaction,
      message: 'Swap transaction ready for signing'
    })
  } catch (error) {
    console.error('Swap API error:', error)
    
    // Handle specific 1inch API errors
    if (error instanceof Error && error.message.includes('1inch API Error')) {
      const match = error.message.match(/1inch API Error: (\d+)/)
      const statusCode = match ? parseInt(match[1]) : 500
      
      return NextResponse.json(
        {
          success: false,
          error: 'Swap execution failed',
          message: error.message,
          code: statusCode
        },
        { status: statusCode }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to execute swap',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
