'use client'

import React, { useState } from 'react'
import { MoodSelector } from '@/components/MoodSelector'
import { TokenCard } from '@/components/TokenCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { WalletConnection } from '@/components/WalletConnection'
import { SwapModal } from '@/components/SwapModal'
import TextType from '@/components/ui/TextType'
import ClientOnly from '@/components/ClientOnly'
import { Mood, Token } from '@/types'

interface TokenRecommendation {
  token: Token
  moodScore: number
  riskScore: number
  totalScore: number
  reasoning: string[]
}

const Page = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [recommendations, setRecommendations] = useState<TokenRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [swapModal, setSwapModal] = useState<{ isOpen: boolean; token: Token | null }>({
    isOpen: false,
    token: null
  })

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood)
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/recommendations?mood=${mood.id}&limit=6`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.data.recommendations)
      } else {
        throw new Error(data.error || 'Failed to get recommendations')
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = (token: Token) => {
    setSwapModal({ isOpen: true, token })
  }

  const closeSwapModal = () => {
    setSwapModal({ isOpen: false, token: null })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-500">
      {/* Header */}
      <header className="bg-white shadow-2xl border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              EmotoInch 🎭
            </h1>
            <p className="text-lg text-gray-600">
              Trade with your emotions, powered by <span className='bg-blue-800 rounded-lg p-2.5 text-white'>1Inch</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnection />
        </div>

        {/* Mood Selector */}
        <div className="mb-12">
          <MoodSelector 
            onMoodSelect={handleMoodSelect}
            selectedMood={selectedMood}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <LoadingSpinner />
            <p className="text-gray-600 mt-4">
              Finding the perfect tokens for your {selectedMood?.name} mood...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && !loading && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recommended Tokens for your {selectedMood?.name} mood {selectedMood?.emoji}
              </h2>
              <p className="text-gray-600">
                Based on your risk tolerance and trading preferences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <TokenCard
                  key={recommendation.token.address}
                  recommendation={recommendation}
                  onSwap={handleSwap}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedMood && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              <TextType 
                text={[
                  "How are you feeling today about trading?",
                  "Select your trading mood",
                  "Get personalized recommendations",
                  "Trade with your emotions"
                ]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="text-xl font-semibold text-gray-900"
              />
            </h2>
            <p className="text-gray-600 mt-4">
              Get <span className='font-extrabold text-blue-800'>personalized</span> token 
              recommendations based on how you're feeling
            </p>
          </div>
        )}
      </main>

      {/* Swap Modal */}
      {swapModal.isOpen && swapModal.token && (
        <ClientOnly>
          <SwapModal
            token={swapModal.token}
            isOpen={swapModal.isOpen}
            onClose={closeSwapModal}
          />
        </ClientOnly>
      )}
    </div>
  )
}

export default Page
