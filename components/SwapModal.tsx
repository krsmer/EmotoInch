'use client'

import React, { useState, useEffect } from 'react'
import { Token } from '@/types'
import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface SwapModalProps {
  token: Token
  isOpen: boolean
  onClose: () => void
}

export const SwapModal: React.FC<SwapModalProps> = ({ token, isOpen, onClose }) => {
  const { isConnected, address } = useWallet()
  const [amount, setAmount] = useState('')
  const [quote, setQuote] = useState<any>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slippage, setSlippage] = useState('1')
  const [tokenPrice, setTokenPrice] = useState<number | null>(null)
  const [ethPrice, setEthPrice] = useState<number | null>(null)

  // ETH token address (for swapping FROM ETH)
  const ETH_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

  // Get token prices on component mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        console.log('Fetching prices for:', { ETH_TOKEN, tokenAddress: token.address })
        
        // Try 1inch API first
        const response = await fetch(`/api/prices?addresses=${ETH_TOKEN},${token.address}`)
        const data = await response.json()
        console.log('Prices API response:', data)
        
        if (data.success && data.data && data.data.length > 0) {
          const ethPriceData = data.data.find((p: any) => p.address === ETH_TOKEN)
          const tokenPriceData = data.data.find((p: any) => p.address === token.address)
          
          console.log('Found price data:', { 
            ethPriceData, 
            tokenPriceData,
            allPrices: data.data 
          })
          
          setEthPrice(ethPriceData?.price || null)
          setTokenPrice(tokenPriceData?.price || null)
          console.log('Prices set:', { ethPrice: ethPriceData?.price, tokenPrice: tokenPriceData?.price })
        } else {
          // Fallback to mock prices for demo
          console.log('Using fallback prices for demo')
          setEthPrice(3200) // Mock ETH price
          
          // Mock token prices based on symbol
          const mockPrice = getMockTokenPrice(token.symbol)
          setTokenPrice(mockPrice)
          console.log('Mock prices set:', { ethPrice: 3200, tokenPrice: mockPrice })
        }
      } catch (err) {
        console.error('Error fetching prices:', err)
        // Fallback to mock prices
        setEthPrice(3200)
        setTokenPrice(getMockTokenPrice(token.symbol))
      }
    }
    
    if (isOpen) {
      fetchPrices()
    }
  }, [isOpen, token.address])

  const getMockTokenPrice = (symbol: string): number => {
    // Mock prices for common tokens
    const mockPrices: Record<string, number> = {
      'USDT': 1.0,
      'USDC': 1.0,
      'DAI': 1.0,
      'WETH': 3200,
      'UNI': 8.5,
      'AAVE': 85,
      'LINK': 12,
      'COMP': 45,
      'MKR': 1800,
      'eMAID': 0.000015, // Very small price for eMAID
      'LTO': 0.08,
      'XAI': 0.25
    }
    
    return mockPrices[symbol] || 0.001 // Default small price for unknown tokens
  }

  // Get quote when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && isConnected && address) {
      getSwapQuote()
    } else {
      setQuote(null)
    }
  }, [amount, isConnected, address])

  const getSwapQuote = async () => {
    if (!amount || !address) return

    try {
      setIsLoadingQuote(true)
      setError(null)

      // Convert amount to wei (18 decimals for ETH)
      const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString()

      console.log('Getting quote for:', { amount, amountInWei, from: ETH_TOKEN, to: token.address })

      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          src: ETH_TOKEN, // From ETH
          dst: token.address, // To selected token
          amount: amountInWei,
          from: address,
          slippage: parseFloat(slippage)
        })
      })

      const data = await response.json()
      console.log('Quote API response:', data)

      if (data.success && data.data) {
        setQuote(data.data)
        console.log('Quote set successfully:', data.data)
      } else {
        throw new Error(data.error || 'Failed to get quote')
      }
    } catch (err) {
      console.error('Error getting quote:', err)
      setError(err instanceof Error ? err.message : 'Failed to get quote')
      setQuote(null)
    } finally {
      setIsLoadingQuote(false)
    }
  }

  const executeSwap = async () => {
    if (!quote || !address || !amount) return

    try {
      setIsSwapping(true)
      setError(null)

      // Convert amount to wei
      const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString()

      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: ETH_TOKEN,
          to: token.address,
          amount: amountInWei,
          wallet: address,
          slippage: parseFloat(slippage)
        })
      })

      const data = await response.json()

      if (data.success && data.data?.transaction) {
        // Execute transaction via MetaMask
        const txHash = await window.ethereum!.request({
          method: 'eth_sendTransaction',
          params: [data.data.transaction]
        })

        console.log('Transaction sent:', txHash)
        
        // Show success message
        alert(`Swap transaction sent! Hash: ${txHash}`)
        onClose()
      } else {
        throw new Error(data.error || 'Failed to execute swap')
      }
    } catch (err) {
      console.error('Error executing swap:', err)
      setError(err instanceof Error ? err.message : 'Failed to execute swap')
    } finally {
      setIsSwapping(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Swap ETH → {token.symbol}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Please connect your wallet to continue
              </p>
            </div>
          )}

          {/* Token Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {token.logoURI && (
              <img 
                src={token.logoURI} 
                alt={token.symbol}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900">{token.name}</p>
              <p className="text-sm text-gray-600">{token.symbol}</p>
              {tokenPrice && tokenPrice > 0 && (
                <p className="text-xs text-green-600">
                  ${tokenPrice < 0.001 ? tokenPrice.toExponential(3) : tokenPrice.toFixed(6)} per token
                </p>
              )}
            </div>
          </div>

          {/* Current Market Info */}
          {(ethPrice || tokenPrice) && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              {ethPrice && (
                <div>
                  <p className="text-xs text-blue-600">ETH Price</p>
                  <p className="font-medium text-blue-900">${ethPrice.toFixed(2)}</p>
                </div>
              )}
              {tokenPrice && (
                <div>
                  <p className="text-xs text-blue-600">{token.symbol} Price</p>
                  <p className="font-medium text-blue-900">
                    ${tokenPrice < 0.001 ? tokenPrice.toExponential(3) : tokenPrice.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isConnected}
              step="0.001"
              min="0"
            />
            {amount && ethPrice && (
              <p className="text-xs text-gray-500 mt-1">
                ≈ ${(parseFloat(amount) * ethPrice).toFixed(2)} USD
              </p>
            )}
          </div>

          {/* Slippage Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slippage Tolerance (%)
            </label>
            <div className="flex gap-2">
              {['0.5', '1', '3'].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded text-sm ${
                    slippage === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                step="0.1"
                min="0.1"
                max="50"
              />
            </div>
          </div>

          {/* Quote Display */}
          {isLoadingQuote && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner />
              <span className="ml-2 text-gray-600">Getting best quote...</span>
            </div>
          )}

          {quote && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700 mb-2">
                You will receive approximately:
              </p>
              <div className="space-y-2">
                <p className="text-xl font-bold text-green-900">
                  {quote.toAmount ? 
                    (parseInt(quote.toAmount) / Math.pow(10, token.decimals)).toFixed(6)
                    : 'N/A'
                  } {token.symbol}
                </p>
                
                {quote.toAmount && tokenPrice && (
                  <p className="text-sm text-green-700">
                    ≈ ${((parseInt(quote.toAmount) / Math.pow(10, token.decimals)) * tokenPrice).toFixed(2)} USD
                  </p>
                )}
                
                <div className="text-xs text-green-600 space-y-1">
                  {quote.estimatedGas && (
                    <p>Gas estimate: {parseInt(quote.estimatedGas).toLocaleString()}</p>
                  )}
                  {amount && quote.toAmount && (
                    <p>
                      Rate: 1 ETH = {((parseInt(quote.toAmount) / Math.pow(10, token.decimals)) / parseFloat(amount)).toFixed(6)} {token.symbol}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* No Quote Available */}
          {!isLoadingQuote && !quote && amount && parseFloat(amount) > 0 && isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                No quote available for this amount. Try a different amount or check if the token is tradeable.
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={executeSwap}
              disabled={!isConnected || !quote || !amount || isSwapping || isLoadingQuote}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300"
            >
              {isSwapping ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Swapping...</span>
                </>
              ) : (
                'Confirm Swap'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
