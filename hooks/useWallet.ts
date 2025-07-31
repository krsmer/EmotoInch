'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'

export const useWallet = () => {
  const [mounted, setMounted] = useState(false)
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, error: connectError, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  
  // Get ETH balance
  const { data: balanceData, isLoading: isLoadingBalance } = useBalance({
    address: address,
    query: {
      enabled: !!address,
    },
  })

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for MetaMask account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum?.isMetaMask) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('Accounts changed:', accounts)
        // Wagmi will automatically detect this change
      }

      const ethereum = (window as any).ethereum
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [mounted])

  // Format balance for display
  const balance = balanceData ? parseFloat(balanceData.formatted).toFixed(4) : null

  // Connect to MetaMask specifically
  const connectWallet = () => {
    const metaMaskConnector = connectors.find(
      (connector) => connector.id === 'metaMask'
    )
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector })
    }
  }

  // Connect with wallet selection
  const connectWithWallet = (walletType: 'metaMask' | 'coinbaseWallet') => {
    const connector = connectors.find((c) => c.id === walletType)
    if (connector) {
      connect({ connector })
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    disconnect()
  }

  // Check if MetaMask is available (only on client)
  const isMetaMaskInstalled = () => {
    if (typeof window === 'undefined') return false
    return !!(window as any).ethereum?.isMetaMask
  }

  return {
    // Wallet state
    isConnected,
    address: address || null,
    balance,
    isLoading: isConnecting || isPending || isLoadingBalance,
    error: connectError?.message || null,

    // Actions
    connectWallet,
    connectWithWallet,
    disconnectWallet,

    // Available connectors
    connectors,
    
    // Utilities
    isMetaMaskInstalled: isMetaMaskInstalled(),
    
    // Hydration state
    mounted
  }
}
