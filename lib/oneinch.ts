import { Token, TokenPrice, SwapQuote, SwapParams, OneInchTokenListResponse, OneInchPriceResponse, OneInchQuoteResponse, OneInchSwapResponse } from '@/types'

class OneInchAPI {
  private baseURL: string
  private apiKey: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_1INCH_API_URL || 'https://api.1inch.dev'
    this.apiKey = process.env.NEXT_PUBLIC_1INCH_API_KEY || ''
    
    if (!this.apiKey) {
      console.warn('1inch API key not found. Please add NEXT_PUBLIC_1INCH_API_KEY to .env.local')
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`1inch API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('1inch API request failed:', error)
      throw error
    }
  }

  // Get token list for Ethereum mainnet
  async getTokenList(): Promise<Token[]> {
    try {
      const response = await this.request<Record<string, any>>('/token/v1.2/1')
      
      console.log('1inch API response type:', typeof response)
      console.log('Sample token keys:', Object.keys(response).slice(0, 5))
      
      // Check if response is a direct object of tokens
      if (!response || typeof response !== 'object') {
        console.error('Invalid response structure from 1inch API:', response)
        return []
      }
      
      // Convert object to array and add some filtering
      const tokens = Object.values(response)
        .filter((token: any) => token.logoURI && token.symbol) // Only tokens with logo and symbol
        .slice(0, 50) // Limit to first 50 for MVP
        .map((token: any) => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          decimals: token.decimals,
          logoURI: token.logoURI,
          price: 0 // Will be fetched separately
        }))
      
      console.log(`Processed ${tokens.length} tokens successfully`)
      return tokens
    } catch (error) {
      console.error('Failed to fetch token list:', error)
      return []
    }
  }

  // Get token prices
  async getTokenPrices(addresses: string[]): Promise<TokenPrice[]> {
    if (addresses.length === 0) return []
    
    try {
      const addressString = addresses.join(',')
      const response = await this.request<OneInchPriceResponse>(`/price/v1.1/1/${addressString}`)
      
      return Object.entries(response).map(([address, price]) => ({
        address,
        price: parseFloat(price),
      }))
    } catch (error) {
      console.error('Failed to fetch token prices:', error)
      return []
    }
  }

  // Get swap quote
  async getSwapQuote(params: SwapParams): Promise<SwapQuote | null> {
    try {
      const queryParams = new URLSearchParams({
        src: params.src,
        dst: params.dst,
        amount: params.amount,
        from: params.from,
        slippage: params.slippage.toString(),
      })

      const response = await this.request<OneInchQuoteResponse>(`/swap/v6.0/1/quote?${queryParams}`)
      
      return {
        fromToken: response.fromToken,
        toToken: response.toToken,
        fromAmount: response.fromAmount,
        toAmount: response.toAmount,
        estimatedGas: response.estimatedGas?.toString(),
        protocols: response.protocols,
      }
    } catch (error) {
      console.error('Failed to get swap quote:', error)
      return null
    }
  }

  // Execute swap transaction
  async executeSwap(params: SwapParams): Promise<any> {
    try {
      console.log('Creating swap transaction for 1inch API...')
      
      const queryParams = new URLSearchParams({
        src: params.src,
        dst: params.dst,
        amount: params.amount,
        from: params.from,
        slippage: params.slippage.toString(),
      })

      // Add optional parameters
      if (params.gasPrice) {
        queryParams.append('gasPrice', params.gasPrice)
      }
      if (params.disableEstimate !== undefined) {
        queryParams.append('disableEstimate', params.disableEstimate.toString())
      }

      console.log('Swap parameters:', Object.fromEntries(queryParams))

      const response = await this.request<OneInchSwapResponse>(`/swap/v6.0/1/swap?${queryParams}`)
      
      console.log('1inch swap response received:', {
        hasTransaction: !!response.tx,
        gasPrice: response.tx?.gasPrice,
        to: response.tx?.to
      })

      return {
        transaction: response.tx,
        fromToken: response.fromToken,
        toToken: response.toToken,
        fromAmount: response.fromAmount,
        toAmount: response.toAmount,
        protocols: response.protocols,
        gasPrice: response.tx?.gasPrice,
        gas: response.tx?.gas
      }
    } catch (error) {
      console.error('Failed to execute swap:', error)
      throw error
    }
  }
}

// Export singleton instance
export const oneInchAPI = new OneInchAPI()

// Export class for testing
export { OneInchAPI }
