import { Token, Mood } from '@/types'

/**
 * EmotoInch Mood-Based Token Scoring Algorithm
 * Scores tokens based on user's emotional state and risk tolerance
 */

export interface TokenScore {
  token: Token
  moodScore: number
  riskScore: number
  totalScore: number
  reasoning: string[]
}

export class MoodAlgorithm {
  /**
   * Calculate compatibility score between mood and token
   * Score ranges from 0-100 (higher is better match)
   */
  static scoreToken(token: Token, mood: Mood): TokenScore {
    let moodScore = 0
    let riskScore = 0
    const reasoning: string[] = []

    // 1. Category matching (40% weight)
    const categoryScore = this.calculateCategoryScore(token, mood)
    moodScore += categoryScore.score
    reasoning.push(...categoryScore.reasons)

    // 2. Risk level matching (30% weight)
    const riskLevelScore = this.calculateRiskScore(token, mood)
    riskScore += riskLevelScore.score
    reasoning.push(...riskLevelScore.reasons)

    // 3. Token characteristics (30% weight)
    const characteristicScore = this.calculateCharacteristicScore(token, mood)
    moodScore += characteristicScore.score
    reasoning.push(...characteristicScore.reasons)

    // Calculate total score (weighted average)
    const totalScore = Math.round(
      (moodScore * 0.7) + (riskScore * 0.3)
    )

    return {
      token,
      moodScore: Math.round(moodScore),
      riskScore: Math.round(riskScore),
      totalScore: Math.min(100, Math.max(0, totalScore)),
      reasoning
    }
  }

  /**
   * Filter and sort tokens based on mood compatibility
   */
  static getRecommendations(
    tokens: Token[], 
    mood: Mood, 
    limit: number = 10
  ): TokenScore[] {
    return tokens
      .map(token => this.scoreToken(token, mood))
      .filter(scored => scored.totalScore > 30) // Minimum threshold
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit)
  }

  /**
   * Calculate score based on token categories vs mood preferences
   */
  private static calculateCategoryScore(token: Token, mood: Mood): {
    score: number
    reasons: string[]
  } {
    let score = 0
    const reasons: string[] = []
    
    if (!token.tags || token.tags.length === 0) {
      return { score: 20, reasons: ['No category information available'] }
    }

    // Check direct category matches
    const moodCategories = mood.categories
    const tokenTags = token.tags.map(tag => tag.toLowerCase())
    
    let matchCount = 0
    moodCategories.forEach(category => {
      if (tokenTags.some(tag => tag.includes(category.toLowerCase()))) {
        matchCount++
        score += 15
        reasons.push(`Matches ${category} preference`)
      }
    })

    // Bonus for multiple matches
    if (matchCount > 1) {
      score += 10
      reasons.push(`Multiple category matches (+${matchCount})`)
    }

    // Default score if no matches but has categories
    if (matchCount === 0) {
      score = 10
      reasons.push('No direct category match')
    }

    return { score: Math.min(50, score), reasons }
  }

  /**
   * Calculate risk score based on mood risk tolerance
   */
  private static calculateRiskScore(token: Token, mood: Mood): {
    score: number
    reasons: string[]
  } {
    let score = 0
    const reasons: string[] = []

    // Risk assessment based on token characteristics
    const isStablecoin = token.tags?.some(tag => 
      tag.toLowerCase().includes('stable') || 
      tag.toLowerCase().includes('peg:usd')
    )
    
    const isBlueChip = token.tags?.some(tag => 
      ['eth', 'btc', 'usdc', 'usdt'].includes(token.symbol.toLowerCase())
    )

    const isMeme = token.tags?.some(tag => 
      tag.toLowerCase().includes('meme')
    )

    // Score based on mood risk tolerance
    switch (mood.riskLevel) {
      case 'low':
        if (isStablecoin) {
          score = 90
          reasons.push('Perfect for cautious investors - stablecoin')
        } else if (isBlueChip) {
          score = 70
          reasons.push('Good for cautious investors - established token')
        } else {
          score = 20
          reasons.push('Higher risk than preferred')
        }
        break

      case 'medium':
        if (isStablecoin) {
          score = 60
          reasons.push('Safe but low reward potential')
        } else if (isBlueChip) {
          score = 80
          reasons.push('Good balance of safety and growth')
        } else {
          score = 50
          reasons.push('Moderate risk level')
        }
        break

      case 'high':
        if (isMeme || !isBlueChip) {
          score = 85
          reasons.push('High reward potential - matches risk appetite')
        } else if (isBlueChip) {
          score = 40
          reasons.push('Lower risk than preferred')
        } else {
          score = 60
          reasons.push('Moderate risk level')
        }
        break
    }

    return { score: Math.min(100, score), reasons }
  }

  /**
   * Calculate score based on additional token characteristics
   */
  private static calculateCharacteristicScore(token: Token, mood: Mood): {
    score: number
    reasons: string[]
  } {
    let score = 50 // Base score
    const reasons: string[] = []

    // Logo availability (trust indicator)
    if (token.logoURI) {
      score += 10
      reasons.push('Verified token with logo')
    }

    // Symbol length (shorter often means more established)
    if (token.symbol.length <= 5) {
      score += 5
      reasons.push('Concise symbol name')
    }

    // Mood-specific bonuses
    switch (mood.id) {
      case 'excited':
        if (token.symbol.includes('AI') || token.symbol.includes('GAME')) {
          score += 15
          reasons.push('Trending technology sector')
        }
        break
      
      case 'fomo':
        // Would check volume/price change in real implementation
        score += 10
        reasons.push('Trending momentum')
        break
      
      case 'dip-buyer':
        // Would check 24h price change in real implementation
        score += 10
        reasons.push('Potential value opportunity')
        break
    }

    return { score: Math.min(100, score), reasons }
  }

  /**
   * Get human-readable explanation for recommendation
   */
  static getRecommendationExplanation(score: TokenScore, mood: Mood): string {
    const { totalScore, reasoning } = score
    
    let explanation = `This token scores ${totalScore}/100 for your ${mood.name} mood because: `
    explanation += reasoning.slice(0, 3).join(', ')
    
    if (totalScore >= 80) {
      explanation += '. This is an excellent match for your current mood!'
    } else if (totalScore >= 60) {
      explanation += '. This is a good match for your preferences.'
    } else if (totalScore >= 40) {
      explanation += '. This could work but consider the risks.'
    } else {
      explanation += '. This might not align well with your current mood.'
    }
    
    return explanation
  }
}

// Export default scoring function for simple usage
export const scoreTokenForMood = (token: Token, mood: Mood): number => {
  return MoodAlgorithm.scoreToken(token, mood).totalScore
}

// Export recommendation function for simple usage
export const getTokenRecommendations = (
  tokens: Token[], 
  mood: Mood, 
  limit?: number
): TokenScore[] => {
  return MoodAlgorithm.getRecommendations(tokens, mood, limit)
}
