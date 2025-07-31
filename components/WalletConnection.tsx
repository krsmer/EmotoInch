'use client'

import React from 'react'
import { useWallet } from '@/hooks/useWallet'
import { Button } from '@/components/ui/Button'

interface WalletConnectionProps {
  className?: string
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ className = "" }) => {
  const { 
    isConnected, 
    address, 
    balance, 
    isLoading, 
    error, 
    connectWallet, 
    connectWithWallet,
    disconnectWallet,
    connectors,
    isMetaMaskInstalled
  } = useWallet()

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="text-red-500">⚠️</div>
          <div className="flex-1">
            <p className="text-red-800 font-medium">Connection Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <Button
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (isConnected && address) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <div>
              <p className="text-green-800 font-medium">
                Connected: {formatAddress(address)}
              </p>
              <p className="text-green-600 text-sm">
                Balance: {balance || '0.0000'} ETH
              </p>
            </div>
          </div>
          <Button
            onClick={disconnectWallet}
            className="bg-gray-500 hover:bg-gray-600 text-white text-sm"
          >
            Disconnect
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-blue-500">🦊</div>
          <div>
            <p className="text-blue-800 font-medium">Connect Your Wallet</p>
            <p className="text-blue-600 text-sm">
              Connect with MetaMask to start trading
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={async () => {
              console.log('Connecting to MetaMask...')
              
              if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask) {
                try {
                  const accounts = await (window as any).ethereum.request({
                    method: 'eth_requestAccounts',
                  })
                  console.log('Connected accounts:', accounts)
                  
                  // You could add additional logic here to update state if needed
                  // For now, the connection success will be detected by wagmi automatically
                  
                } catch (error) {
                  console.error('Connection error:', error)
                }
              } else {
                // If MetaMask not detected, show install button
                window.open('https://metamask.io/', '_blank')
              }
            }}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? 'Connecting...' : '🦊 Connect Wallet'}
          </Button>
        </div>
      </div>
    </div>
  )
}
