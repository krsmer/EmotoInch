# EmotoInch - 1inch API Integration Plan - MVP Version

## 🎯 MVP API Strategy - Essential Integration Only

### Strategic Goal: **Core 1inch API Usage for Hackathon MVP**
This document outlines how EmotoInch will use essential 1inch APIs to create a functional trading experience within 6 days, focusing on core functionality over comprehensive integration.

---

## 📋 Essential 1inch APIs for MVP

### 🔍 1. Token List API - Basic Implementation

#### **API Endpoint:** `/tokens`
```typescript
// Simplified token service for MVP
const tokenService = {
  // Get basic token list for mood filtering
  async getBasicTokenList(): Promise<Token[]> {
    try {
      const response = await fetch('/api/tokens')
      return await response.json()
    } catch (error) {
      console.error('Token fetch failed:', error)
      return []
    }
  },
  
  // Simple mood-based filtering
  filterTokensByMood(tokens: Token[], mood: Mood): Token[] {
    const categories = getMoodCategories(mood)
    return tokens
      .filter(token => categories.some(cat => token.tags?.includes(cat)))
      .slice(0, 20) // Limit to top 20 for MVP
  }
}
```

**MVP Integration Points:**
- ✅ **Basic Token Filtering:** Filter by mood categories only
- ✅ **Simple Display:** Logo, name, symbol for UI
- ✅ **Essential Metadata:** Tags for mood matching
- ❌ **Skip:** Complex categorization, extensive metadata

---

### � 2. Price Feed API - Essential Pricing

#### **API Endpoint:** `/price/v1.1/{chain}/{addresses}`
```typescript
const priceService = {
  // Simple price fetching for recommended tokens
  async getTokenPrices(addresses: string[]): Promise<PriceData[]> {
    try {
      const response = await fetch(`/api/prices?addresses=${addresses.join(',')}`)
      return await response.json()
    } catch (error) {
      console.error('Price fetch failed:', error)
      return []
    }
  },
  
  // Basic price display formatting
  formatPrice(price: number): string {
    return price < 1 ? price.toFixed(6) : price.toFixed(2)
  }
}
```

**MVP Integration Points:**
- ✅ **Real-time Pricing:** Current prices for recommended tokens
- ✅ **Basic Display:** Price formatting for UI
- ❌ **Skip:** Historical data, complex analytics, price charts

### 🔍 1. Token List & Metadata APIs

#### **API Endpoint:** `/tokens`
```typescript
// Primary Usage: Token Discovery Engine
const tokenListService = {
  // Get comprehensive token list for mood-based filtering
  async getTokensByChain(chainId: number): Promise<Token[]> {
    return await oneInchAPI.get(`/token/v1.2/${chainId}`)
  },
  
  // Filter tokens based on mood criteria
  async getTokensByCategory(category: string[]): Promise<Token[]> {
    const allTokens = await this.getTokensByChain(1)
    return allTokens.filter(token => 
      token.tags?.some(tag => category.includes(tag))
    )
  }
}
```

**EmotoInch Integration Points:**
-  **Mood-Based Token Filtering:** Filter 1000+ tokens by mood categories
-  **Token Metadata Display:** Logo, name, symbol, decimals for UI
-  **Category Mapping:** Map 1inch token tags to mood categories
-  **Search Functionality:** Allow users to search within mood-filtered tokens

#### **API Endpoint:** `/tokens/{address}`
```typescript
// Detailed token information for individual token pages
const tokenDetailService = {
  async getTokenDetails(address: string): Promise<TokenDetails> {
    return await oneInchAPI.get(`/token/v1.2/1/${address}`)
  },
  
  // Enhanced with mood scoring
  async getTokenWithMoodScore(address: string, mood: MoodProfile): Promise<EnhancedToken> {
    const tokenDetails = await this.getTokenDetails(address)
    const moodScore = calculateMoodCompatibility(tokenDetails, mood)
    return { ...tokenDetails, moodScore, moodExplanation }
  }
}
```

---

###  2. Price Feed & Market Data APIs

#### **API Endpoint:** `/price/v1.1/{chain}/{addresses}`
```typescript
const priceService = {
  // Real-time price updates for mood-based recommendations
  async getTokenPrices(addresses: string[]): Promise<PriceData[]> {
    const chunks = chunkArray(addresses, 50) // Batch requests
    const promises = chunks.map(chunk => 
      oneInchAPI.get(`/price/v1.1/1/${chunk.join(',')}`)
    )
    return Promise.all(promises).then(results => results.flat())
  },
  
  // Price tracking for mood performance analytics
  async getPriceChanges(addresses: string[], timeframe: string): Promise<PriceChange[]> {
    const prices = await this.getTokenPrices(addresses)
    return prices.map(price => ({
      ...price,
      change24h: price.change24h,
      moodPerformanceScore: calculateMoodPerformance(price, timeframe)
    }))
  }
}
```

**EmotoInch Integration Points:**
-  **Live Price Updates:** Real-time pricing for all recommended tokens
-  **Price Change Indicators:** 24h changes with mood context
-  **Performance Tracking:** Track how mood-based picks perform
-  **Market Trend Analysis:** Identify trending tokens for "FOMO" mood

#### **Custom Price Analytics Integration:**
```typescript
const moodPriceAnalytics = {
  // Analyze price volatility for mood-risk mapping
  calculateVolatilityScore(priceHistory: PriceData[]): number {
    // Implementation for mood-based risk assessment
  },
  
  // Track correlation between mood selections and market performance
  analyzeMoodMarketCorrelation(userMoods: MoodHistory[], marketData: PriceData[]): CorrelationData {
    // Analytics for user education and improved recommendations
  }
}
```

---

###  3. Swap Quote & Execution APIs

#### **API Endpoint:** `/swap/v6.0/{chain}/quote`
```typescript
const swapQuoteService = {
  // Enhanced quote with mood-based explanation
  async getMoodEnhancedQuote(params: SwapParams, mood: MoodProfile): Promise<EnhancedQuote> {
    const quote = await oneInchAPI.get('/swap/v6.0/1/quote', { params })
    
    return {
      ...quote,
      moodJustification: generateMoodExplanation(params.dst, mood),
      riskAssessment: assessSwapRisk(quote, mood),
      alternativeRecommendations: suggestAlternatives(params.dst, mood)
    }
  },
  
  // Batch quotes for multiple mood recommendations
  async getBatchQuotes(fromToken: string, toTokens: string[], amount: string): Promise<QuoteComparison[]> {
    const promises = toTokens.map(toToken => 
      this.getMoodEnhancedQuote({ src: fromToken, dst: toToken, amount }, currentMood)
    )
    return Promise.all(promises)
  }
}
```

#### **API Endpoint:** `/swap/v6.0/{chain}/swap`
```typescript
const swapExecutionService = {
  // Execute swap with mood tracking
  async executeSwapWithMoodTracking(params: SwapExecutionParams): Promise<SwapResult> {
    const swapData = await oneInchAPI.get('/swap/v6.0/1/swap', { params })
    
    // Track swap in mood analytics
    await trackMoodBasedSwap({
      mood: currentMood,
      fromToken: params.src,
      toToken: params.dst,
      amount: params.amount,
      timestamp: Date.now()
    })
    
    return swapData
  }
}
```

**EmotoInch Integration Points:**
- ✅ **Mood-Contextual Quotes:** Explain why the swap aligns with user's mood
- ✅ **Risk-Adjusted Pricing:** Show quotes with mood-appropriate risk warnings
- ✅ **Alternative Suggestions:** Offer similar tokens that match the mood
- ✅ **Swap Analytics:** Track performance of mood-based swaps

---

### 💳 4. Wallet Balance & Portfolio APIs

#### **API Endpoint:** `/balance/v1.2/{chain}/{address}`
```typescript
const portfolioService = {
  // Get wallet balance with mood analysis
  async getWalletWithMoodAnalysis(address: string): Promise<MoodAnalyzedPortfolio> {
    const balance = await oneInchAPI.get(`/balance/v1.2/1/${address}`)
    
    return {
      ...balance,
      currentMoodFit: analyzePortfolioMoodFit(balance, currentMood),
      suggestedRebalancing: suggestMoodBasedRebalancing(balance, currentMood),
      portfolioMoodScore: calculatePortfolioMoodScore(balance)
    }
  },
  
  // Track portfolio changes over time with mood context
  async getPortfolioMoodHistory(address: string): Promise<PortfolioMoodHistory> {
    const currentBalance = await this.getWalletWithMoodAnalysis(address)
    const historicalMoods = getUserMoodHistory(address)
    
    return correlatePortfolioWithMoods(currentBalance, historicalMoods)
  }
}
```

**EmotoInch Integration Points:**
- ✅ **Portfolio Mood Analysis:** Show how current holdings align with mood
- ✅ **Rebalancing Suggestions:** Recommend changes based on mood shift
- ✅ **Performance Tracking:** Track mood-based trading performance
- ✅ **Diversification Scoring:** Assess portfolio risk vs mood tolerance

---

### ⛽ 5. Gas Price & Fee Optimization APIs

#### **API Endpoint:** `/gas-price`
```typescript
const gasOptimizationService = {
  // Optimize gas based on mood urgency
  async getMoodBasedGasRecommendation(mood: MoodProfile): Promise<GasRecommendation> {
    const gasPrice = await oneInchAPI.get('/gas-price')
    
    const urgencyMultiplier = getMoodUrgencyFactor(mood) // FOMO = high, Cautious = low
    
    return {
      ...gasPrice,
      recommendedGasPrice: gasPrice.standard * urgencyMultiplier,
      moodJustification: `Based on your ${mood.name} mood, we recommend ${urgencyMultiplier > 1 ? 'faster' : 'standard'} transaction speed`,
      estimatedTime: calculateTransactionTime(gasPrice.standard * urgencyMultiplier)
    }
  }
}
```

**EmotoInch Integration Points:**
- ✅ **Mood-Based Gas Optimization:** Adjust gas price based on emotional urgency
- ✅ **Cost Transparency:** Show gas costs with mood-appropriate explanations
- ✅ **Time Estimates:** Provide transaction time based on mood preferences

---

### 📊 6. Limit Order Protocol Integration

#### **API Endpoints:** `/orderbook/v4.0/{chain}/order/*`
```typescript
const limitOrderService = {
  // Create mood-based limit orders
  async createMoodLimitOrder(params: LimitOrderParams, mood: MoodProfile): Promise<LimitOrder> {
    // Adjust order parameters based on mood
    const adjustedParams = adjustOrderForMood(params, mood)
    
    return await oneInchAPI.post('/orderbook/v4.0/1/order', adjustedParams)
  },
  
  // Get active orders with mood context
  async getMoodOrderbook(tokenPair: string): Promise<MoodEnhancedOrderbook> {
    const orderbook = await oneInchAPI.get(`/orderbook/v4.0/1/orderbook/${tokenPair}`)
    
    return {
      ...orderbook,
      moodRecommendations: analyzeLimitOrderOpportunities(orderbook, currentMood)
    }
  }
}
```

**EmotoInch Integration Points:**
- ✅ **Advanced Trading Features:** Limit orders for sophisticated mood strategies
- ✅ **Patience vs Urgency:** Map mood to order types (market vs limit)
- ✅ **Order Management:** Track and manage mood-based orders

---

### 🌐 7. Web3 API & Blockchain Interactions

#### **API Endpoints:** `/web3/v1/*`
```typescript
const web3IntegrationService = {
  // Enhanced blockchain interactions with mood context
  async sendMoodTransaction(txData: TransactionData): Promise<TransactionResult> {
    return await oneInchAPI.post('/web3/v1/transaction/send', {
      ...txData,
      metadata: {
        moodContext: currentMood,
        timestamp: Date.now(),
        emotionalJustification: generateEmotionalJustification(txData, currentMood)
      }
    })
  },
  
  // Get transaction history with mood analysis
  async getTransactionMoodHistory(address: string): Promise<MoodTransactionHistory> {
    const transactions = await oneInchAPI.get(`/web3/v1/transactions/${address}`)
    
    return transactions.map(tx => ({
      ...tx,
      associatedMood: findTransactionMood(tx.timestamp),
      performanceOutcome: calculateTransactionOutcome(tx),
      moodSuccessRate: calculateMoodSuccessRate(tx.associatedMood)
    }))
  }
}
```

---

## 🔄 API Integration Architecture

### Request Flow Architecture:
```typescript
// Centralized API client with mood context
class EmotoInchAPIClient {
  private oneInchClient: OneInchAPI
  private moodContext: MoodContext
  private analyticsTracker: AnalyticsTracker
  
  async makeRequest<T>(endpoint: string, params: any): Promise<T> {
    // Add mood context to all requests
    const enhancedParams = {
      ...params,
      moodContext: this.moodContext.current,
      sessionId: this.moodContext.sessionId
    }
    
    // Track API usage for hackathon demonstration
    this.analyticsTracker.trackAPIUsage(endpoint, enhancedParams)
    
    const response = await this.oneInchClient.request(endpoint, enhancedParams)
    
    // Apply mood-based post-processing
    return this.applyMoodEnhancement(response, endpoint)
  }
}
```

### Caching Strategy:
```typescript
const cachingStrategy = {
  // Token list: Cache for 1 hour
  tokens: { ttl: 3600, strategy: 'memory' },
  
  // Prices: Cache for 30 seconds (real-time feel)
  prices: { ttl: 30, strategy: 'memory' },
  
  // User moods: Cache in localStorage
  moods: { ttl: Infinity, strategy: 'localStorage' },
  
  // Swap quotes: No caching (always fresh)
  quotes: { ttl: 0, strategy: 'none' }
}
```

### Error Handling & Resilience:
```typescript
const errorHandlingStrategy = {
  // Retry logic for transient failures
  retryConfig: {
    attempts: 3,
    delay: 1000,
    backoff: 'exponential'
  },
  
  // Fallback strategies
  fallbacks: {
    tokenPrices: 'cachedData',
    tokenList: 'defaultList',
    swapQuote: 'alternativeProvider'
  },
  
  // User-friendly error messages with mood context
  errorMapping: {
    rateLimit: 'We\'re getting lots of excited traders! Please wait a moment.',
    networkError: 'Network hiccup detected. Your mood is saved, let\'s try again.',
    invalidToken: 'This token doesn\'t match your mood. Let\'s find better options!'
  }
}
```

---

## 📊 API Usage Analytics & Optimization

### Usage Tracking:
```typescript
const apiUsageTracker = {
  // Track all API calls for hackathon demonstration
  trackCall(endpoint: string, mood: MoodProfile, params: any): void {
    analytics.track('1inch_api_call', {
      endpoint,
      moodId: mood.id,
      timestamp: Date.now(),
      parameters: Object.keys(params),
      userSession: sessionId
    })
  },
  
  // Generate usage report for hackathon submission
  generateUsageReport(): APIUsageReport {
    return {
      totalCalls: this.getTotalCalls(),
      uniqueEndpoints: this.getUniqueEndpoints(),
      moodDistribution: this.getMoodCallDistribution(),
      peakUsage: this.getPeakUsagePatterns(),
      integrationDepth: this.calculateIntegrationScore()
    }
  }
}
```

### Performance Optimization:
```typescript
const performanceOptimizer = {
  // Batch requests where possible
  batchTokenPrices: async (addresses: string[]) => {
    const chunks = chunkArray(addresses, 50)
    return Promise.all(chunks.map(chunk => getPrices(chunk)))
  },
  
  // Debounce rapid calls
  debouncedQuote: debounce(getSwapQuote, 500),
  
  // Prefetch data based on mood selection
  prefetchMoodData: async (mood: MoodProfile) => {
    const relevantTokens = getTokensForMood(mood)
    await Promise.all([
      prefetchTokenPrices(relevantTokens),
      prefetchTokenMetadata(relevantTokens)
    ])
  }
}
```

---

## 🎯 Hackathon Maximization Strategy

### 1. **Comprehensive API Coverage**
- ✅ Use ALL available 1inch APIs
- ✅ Document each integration point
- ✅ Show depth of integration beyond basic swap

### 2. **Innovation Layer**
- ✅ Add mood context to every API call
- ✅ Create unique user experience through emotion
- ✅ Build analytics on top of 1inch data

### 3. **Technical Excellence**
- ✅ Robust error handling
- ✅ Performance optimization
- ✅ Scalable architecture
- ✅ Comprehensive testing

### 4. **Demo-Ready Features**
- ✅ Real-time API usage dashboard
- ✅ Mood-based trading analytics
- ✅ Portfolio performance tracking
- ✅ Social mood trends

---

## 🔐 Security & Compliance

### API Key Management:
```typescript
const securityConfig = {
  apiKeys: {
    storage: 'environment', // Never in client code
    rotation: 'automatic',   // Regular rotation schedule
    monitoring: 'enabled'    // Track unusual usage
  },
  
  rateLimit: {
    clientSide: 'implemented', // Prevent accidental abuse
    backoff: 'exponential',    // Graceful degradation
    userFeedback: 'transparent' // Clear communication
  }
}
```

### Data Privacy:
- 🔐 **No Personal Data Storage:** Only wallet addresses and mood preferences
- 🔐 **Local First:** Sensitive data stays on client
- 🔐 **Anonymized Analytics:** Track usage patterns, not individuals
- 🔐 **Transparent Permissions:** Clear data usage disclosure

---

## 📈 Success Metrics

### Integration Depth Score:
```typescript
const integrationMetrics = {
  apiCoverage: 'number of unique 1inch APIs used',
  callVolume: 'total API calls per user session',
  dataUtilization: 'percentage of API response data used in UI',
  innovationFactor: 'unique features built on top of 1inch data',
  userEngagement: 'time spent interacting with 1inch-powered features'
}
```

### Target Metrics:
- **API Coverage:** 8/8 available API categories used
- **Integration Depth:** >90% of API response data utilized
- **Performance:** <500ms average API response time
- **Reliability:** >99% API call success rate
- **Innovation:** 5+ unique features built on 1inch data

---

**Document Version:** 1.0  
**Last Updated:** January 27, 2025  
**Next Review:** Development Sprint Planning  
**API Documentation:** https://docs.1inch.io/
