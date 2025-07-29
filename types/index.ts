// Core types for EmotoInch MVP

export interface Mood {
  id: string
  name: string
  description: string
  emoji: string
  color: string
  riskLevel: 'low' | 'medium' | 'high'
  categories: string[]
}

export interface Token {
  address: string
  symbol: string
  name: string
  logoURI?: string
  decimals: number
  tags?: string[]
  price?: number
}

export interface TokenPrice {
  address: string
  price: number
  change24h?: number
}

export interface SwapQuote {
  fromToken: Token
  toToken: Token
  fromAmount: string
  toAmount: string
  estimatedGas?: string
  protocols?: any[]
}

export interface SwapParams {
  src: string // from token address
  dst: string // to token address
  amount: string
  from: string // wallet address
  slippage: number
  gasPrice?: string // gas price setting
  disableEstimate?: boolean // disable gas estimation
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  isConnecting: boolean
}

export interface MoodContextType {
  selectedMood: Mood | null
  setSelectedMood: (mood: Mood | null) => void
  isLoading: boolean
}

// 1inch API response types
export interface OneInchTokenListResponse {
  tokens: Record<string, Token>
}

export interface OneInchPriceResponse {
  [address: string]: string
}

export interface OneInchQuoteResponse {
  fromToken: Token
  toToken: Token
  toAmount: string
  fromAmount: string
  protocols: any[]
  estimatedGas: number
}

export interface OneInchSwapResponse {
  fromToken: Token
  toToken: Token
  toAmount: string
  fromAmount: string
  protocols: any[]
  tx: {
    from: string
    to: string
    data: string
    value: string
    gasPrice: string
    gas: string
  }
}

// API Error types
export interface APIError {
  message: string
  code?: number
  details?: any
}
