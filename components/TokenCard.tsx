'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Token } from '@/types'

interface TokenRecommendation {
  token: Token
  moodScore: number
  riskScore: number
  totalScore: number
  reasoning: string[]
}

interface TokenCardProps {
  recommendation: TokenRecommendation
  onSwap?: (token: Token) => void
  className?: string
}

export function TokenCard({ recommendation, onSwap, className = '' }: TokenCardProps) {
  const { token, moodScore, riskScore, totalScore, reasoning } = recommendation
  
  // Score color based on total score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 75) return 'text-blue-600 bg-blue-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  // Risk level badge
  const getRiskBadge = (riskScore: number) => {
    if (riskScore <= 30) return { label: 'Low Risk', class: 'bg-green-100 text-green-800' }
    if (riskScore <= 60) return { label: 'Medium Risk', class: 'bg-yellow-100 text-yellow-800' }
    return { label: 'High Risk', class: 'bg-red-100 text-red-800' }
  }

  const riskBadge = getRiskBadge(riskScore)

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        {/* Token Info */}
        <div className="flex items-center gap-3">
          {token.logoURI && (
            <img 
              src={token.logoURI} 
              alt={token.symbol}
              className="w-12 h-12 rounded-full border-2 border-gray-100"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">{token.symbol}</h3>
            <p className="text-sm text-gray-600 leading-tight">{token.name}</p>
            {token.price && token.price > 0 && (
              <p className="text-sm font-medium text-gray-800 mt-1">
                ${token.price.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* Total Score Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(totalScore)}`}>
          {totalScore}/100
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mood Match</div>
          <div className="text-lg font-bold text-blue-600">{moodScore}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Risk Level</div>
          <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${riskBadge.class}`}>
            {riskBadge.label}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Why this token?</h4>
        <ul className="space-y-1">
          {reasoning.slice(0, 3).map((reason, index) => (
            <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Progress bars for scores */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Mood Compatibility</span>
            <span className="text-xs font-medium">{moodScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${moodScore}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Risk Assessment</span>
            <span className="text-xs font-medium">{100 - riskScore}% Safe</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                riskScore <= 30 ? 'bg-green-500' : 
                riskScore <= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${100 - riskScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      {onSwap && (
        <Button
          onClick={() => onSwap(token)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Trade {token.symbol} →
        </Button>
      )}

      {/* Token Address (for debugging) */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 font-mono break-all">
          {token.address}
        </p>
      </div>
    </Card>
  )
}
