import { NextRequest, NextResponse } from 'next/server'
import { oneInchAPI } from '@/lib/oneinch'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const addressesParam = searchParams.get('tokenAddresses') || searchParams.get('addresses')
    
    if (!addressesParam) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing tokenAddresses parameter'
        },
        { status: 400 }
      )
    }
    
    const addresses = addressesParam.split(',').filter(addr => addr.trim())
    
    if (addresses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid addresses provided'
        },
        { status: 400 }
      )
    }
    
    console.log(`Fetching prices for ${addresses.length} tokens...`)
    
    const prices = await oneInchAPI.getTokenPrices(addresses)
    
    console.log(`Successfully fetched ${prices.length} prices`)
    
    return NextResponse.json({
      success: true,
      data: prices,
      count: prices.length
    })
  } catch (error) {
    console.error('Prices API error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prices',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
