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
    const reasoning: string[] = []

    // 1. Category matching (50% weight)
    const categoryScore = this.calculateCategoryScore(token, mood)
    reasoning.push(...categoryScore.reasons)

    // 2. Risk level matching (30% weight)  
    const riskLevelScore = this.calculateRiskScore(token, mood)
    reasoning.push(...riskLevelScore.reasons)

    // 3. Token characteristics (20% weight)
    const characteristicScore = this.calculateCharacteristicScore(token, mood)
    reasoning.push(...characteristicScore.reasons)

    // Calculate weighted total score
    const moodScore = Math.round(
      (categoryScore.score * 0.5) + (characteristicScore.score * 0.2)
    )
    const riskScore = Math.round(riskLevelScore.score * 0.3)
    const totalScore = Math.round(moodScore + riskScore)

    return {
      token,
      moodScore: Math.min(100, Math.max(0, moodScore)),
      riskScore: Math.min(100, Math.max(0, riskScore)),
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
    
    // Smart categorization based on token name and symbol
    const tokenInfo = `${token.symbol} ${token.name}`.toLowerCase()
    const moodCategories = mood.categories.map(cat => cat.toLowerCase())
    
    // Define category patterns
    const categoryPatterns: Record<string, string[]> = {
      'gaming': ['game', 'gaming', 'play', 'enjin', 'axie', 'sand', 'mana', 'gala'],
      'ai': ['ai', 'artificial', 'intelligence', 'neural', 'fet', 'agix', 'ocean'],
      'defi': ['uni', 'aave', 'comp', 'curve', 'maker', 'yearn', 'sushi', 'pancake', 'dex'],
      'meme': ['doge', 'shiba', 'pepe', 'floki', 'baby', 'moon', 'safe', 'inu'],
      'layer2': ['polygon', 'matic', 'arbitrum', 'optimism', 'layer'],
      'layer-2': ['polygon', 'matic', 'arbitrum', 'optimism', 'layer'],
      'layer-1': ['eth', 'btc', 'ada', 'sol', 'dot', 'atom', 'avax', 'near'],
      'metaverse': ['meta', 'virtual', 'reality', 'land', 'world', 'space'],
      'nft': ['nft', 'collectible', 'art', 'rare', 'unique'],
      'infrastructure': ['link', 'dot', 'ada', 'sol', 'atom', 'avax', 'near', 'ftm'],
      'stable': ['usdt', 'usdc', 'dai', 'busd', 'frax', 'tusd', 'stable'],
      'stablecoin': ['usdt', 'usdc', 'dai', 'busd', 'frax', 'tusd', 'stable'],
      'blue-chip': ['eth', 'btc', 'bnb', 'ada', 'sol', 'dot', 'link', 'uni', 'aave'],
      'defi-blue-chip': ['uni', 'aave', 'comp', 'maker', 'link', 'curve'],
      'social': ['social', 'media', 'creator', 'content', 'fan'],
      'energy': ['energy', 'green', 'carbon', 'climate', 'renewable'],
      'privacy': ['privacy', 'private', 'anonymous', 'stealth', 'monero', 'zcash'],
      'new-listings': ['new', 'recent', 'launch', 'listing'],
      'trending': ['trend', 'viral', 'hot', 'popular'],
      'social-sentiment': ['social', 'community', 'reddit', 'twitter'],
      'high-volume': ['volume', 'liquid', 'active'],
      'oversold': ['oversold', 'discount', 'cheap'],
      'down-24h': ['down', 'dip', 'fall'],
      'value': ['value', 'undervalued', 'cheap']
    }
    
    let matchCount = 0
    
    // Check for category matches
    moodCategories.forEach(moodCategory => {
      let categoryMatched = false
      
      // Direct category name match
      if (tokenInfo.includes(moodCategory)) {
        matchCount++
        score += 20
        reasons.push(`Direct ${moodCategory} category match`)
        categoryMatched = true
      } else if (categoryPatterns[moodCategory]) {
        // Pattern-based matching
        const patterns = categoryPatterns[moodCategory]
        const foundPattern = patterns.find(pattern => tokenInfo.includes(pattern))
        if (foundPattern) {
          matchCount++
          score += 15
          reasons.push(`${moodCategory} category match (${foundPattern})`)
          categoryMatched = true
        }
      }
    })
    
    // Bonus for multiple matches (but cap total category score)
    if (matchCount > 1) {
      score += 5 // Reduced bonus
      reasons.push(`Multiple category matches (+${matchCount})`)
    }
    
    // Base score if no direct matches
    if (matchCount === 0) {
      score = 15
      reasons.push('No specific category match')
    }

    return { score: Math.min(100, score), reasons }
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
    const tokenInfo = `${token.symbol} ${token.name}`.toLowerCase()
    
    const isStablecoin = tokenInfo.includes('usd') || 
                        ['usdt', 'usdc', 'dai', 'busd', 'frax', 'tusd'].some(stable => 
                          tokenInfo.includes(stable))
    
    const isBlueChip = ['eth', 'btc', 'bnb', 'ada', 'sol', 'dot', 'link', 'uni', 'aave'].some(blue => 
                      tokenInfo.includes(blue))

    const isMeme = ['doge', 'shiba', 'pepe', 'floki', 'baby', 'moon', 'safe', 'inu', 'meme'].some(meme => 
                   tokenInfo.includes(meme))

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
    const tokenInfo = `${token.symbol} ${token.name}`.toLowerCase()
    
    switch (mood.id) {
      case 'excited':
        if (tokenInfo.includes('ai') || tokenInfo.includes('game') || tokenInfo.includes('meta')) {
          score += 15
          reasons.push('Trending technology sector')
        }
        break
      
      case 'fomo':
        // Favor trending tokens and memes
        if (tokenInfo.includes('doge') || tokenInfo.includes('shiba') || tokenInfo.includes('pepe')) {
          score += 15
          reasons.push('Viral trending momentum')
        } else {
          score += 10
          reasons.push('General momentum potential')
        }
        break
      
      case 'dip-buyer':
        // Favor established tokens that might be undervalued
        if (['eth', 'btc', 'ada', 'sol', 'link', 'uni'].some(symbol => tokenInfo.includes(symbol))) {
          score += 15
          reasons.push('Established token with dip potential')
        } else {
          score += 10
          reasons.push('Potential value opportunity')
        }
        break
        
      case 'cautious':
        // Favor stable and established tokens
        if (tokenInfo.includes('usd') || ['eth', 'btc'].some(symbol => tokenInfo.includes(symbol))) {
          score += 15
          reasons.push('Safe and established choice')
        }
        break
        
      case 'balanced':
        // No specific bonus, balanced approach
        score += 5
        reasons.push('Balanced approach')
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
