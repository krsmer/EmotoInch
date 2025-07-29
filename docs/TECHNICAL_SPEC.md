# EmotoInch - Technical Specification - MVP Version

## 🏗️ System Architecture Overview - Simplified

### Architecture Pattern: **Simple Frontend + API Integration**
```
Frontend (Next.js 14) ↔ API Routes ↔ 1inch APIs
         ↕                    
   Local State Management   
   (React State + Context)
```

### Minimized Technology Stack:
- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State Management:** React State + Context API (no Zustand)
- **Web3 Integration:** RainbowKit (simplified setup)
- **API Integration:** Basic fetch wrapper for 1inch
- **Styling:** Tailwind CSS only (no Framer Motion)
- **Data Fetching:** Native fetch with basic caching

---

##  Project Structure & Architecture

### Architectural Layers:

```
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│  (Components, Pages, UI, Animations)    │
├─────────────────────────────────────────┤
│             Application Layer            │
│   (Hooks, Context, State Management)    │
├─────────────────────────────────────────┤
│              Business Layer              │
│  (Mood Algorithm, Token Scoring, Logic) │
├─────────────────────────────────────────┤
│               Data Layer                 │
│    (API Clients, Caching, Storage)      │
├─────────────────────────────────────────┤
│            Infrastructure Layer          │
│   (1inch APIs, Web3 Providers, Utils)   │
└─────────────────────────────────────────┘
```

### Simplified File Structure - MVP:
```
emotoinch/
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx               # ✅ Root layout (existing)
│   ├── page.tsx                 # Landing + Mood selection
│   ├── tokens/page.tsx          # Token recommendations
│   ├── swap/page.tsx            # Swap interface  
│   └── api/                     # API Routes (minimal)
│       ├── tokens/route.ts      # GET token list
│       ├── quote/route.ts       # POST swap quote
│       └── prices/route.ts      # GET price data
├── components/                   # React Components (essential only)
│   ├── ui/                      # Base UI (3 components)
│   │   ├── Button.tsx           # Reusable button
│   │   ├── Card.tsx             # Card container
│   │   └── LoadingSpinner.tsx   # Loading indicator
│   ├── MoodSelector.tsx         # Main mood selection
│   ├── TokenCard.tsx            # Individual token display
│   ├── SwapInterface.tsx        # Swap UI
│   └── WalletConnector.tsx      # Wallet connection
├── lib/                         # Core Logic (simplified)
│   ├── oneinch.ts              # 1inch API wrapper
│   ├── mood-algorithm.ts       # Basic mood scoring
│   └── utils.ts                # Helper functions
├── types/                       # TypeScript Definitions
│   └── index.ts                # All types in one file
├── data/                        # Static Data
│   └── moods.ts                # 5 mood definitions only
├── hooks/                       # Custom Hooks (minimal)
│   ├── useTokens.ts            # Token data
│   ├── useSwap.ts              # Swap operations  
│   └── useMood.ts              # Mood state
└── context/                     # React Context (2 only)
    ├── MoodContext.tsx         # Global mood state
    └── WalletContext.tsx       # Wallet state
```
│   │   ├── TokenRecommendations.tsx # Mood-based recommendations
│   │   ├── TokenDetails.tsx     # Detailed token view
│   │   ├── TokenPrice.tsx       # Price display component
│   │   └── TokenChart.tsx       # Price chart component
│   ├── swap/                    # Swap-related Components
│   │   ├── SwapInterface.tsx    # Main swap UI
│   │   ├── SwapCard.tsx         # Swap execution card
│   │   ├── SwapSettings.tsx     # Slippage, gas settings
│   │   ├── SwapPreview.tsx      # Transaction preview
│   │   └── SwapHistory.tsx      # Transaction history
│   ├── wallet/                  # Wallet Components
│   │   ├── WalletConnector.tsx  # Wallet connection UI
│   │   ├── WalletBalance.tsx    # Balance display
│   │   ├── WalletPortfolio.tsx  # Portfolio overview
│   │   └── WalletSettings.tsx   # Wallet settings
│   └── common/                  # Shared Components
│       ├── ErrorBoundary.tsx    # Error handling
│       ├── SEOHead.tsx          # SEO meta tags
│       ├── ThemeProvider.tsx    # Theme context
│       └── AnimationWrapper.tsx # Framer Motion wrapper
├── lib/                         # Core Business Logic
│   ├── api/                     # API Layer
│   │   ├── oneinch.ts           # 1inch API client
│   │   ├── base.ts              # Base API configuration
│   │   └── types.ts             # API response types
│   ├── mood/                    # Mood System
│   │   ├── algorithm.ts         # Mood-to-token algorithm
│   │   ├── scorer.ts            # Token scoring logic
│   │   ├── analyzer.ts          # Mood analysis functions
│   │   └── categories.ts        # Mood categorization
│   ├── web3/                    # Web3 Integration
│   │   ├── config.ts            # Wagmi configuration
│   │   ├── chains.ts            # Supported chains
│   │   ├── connectors.ts        # Wallet connectors
│   │   └── utils.ts             # Web3 utility functions
│   ├── utils/                   # Utility Functions
│   │   ├── format.ts            # Formatting helpers
│   │   ├── validation.ts        # Input validation
│   │   ├── constants.ts         # App constants
│   │   ├── storage.ts           # Local storage helpers
│   │   └── calculations.ts      # Mathematical calculations
│   └── services/                # External Services
│       ├── analytics.ts         # Analytics integration
│       ├── monitoring.ts        # Error monitoring
│       └── notifications.ts     # Push notifications
├── hooks/                       # Custom React Hooks
│   ├── api/                     # API Hooks
│   │   ├── useTokens.ts         # Token data hooks
│   │   ├── usePrices.ts         # Price data hooks
│   │   ├── useSwap.ts           # Swap operation hooks
│   │   └── useBalance.ts        # Balance hooks
│   ├── mood/                    # Mood Hooks
│   │   ├── useMoodSelection.ts  # Mood state management
│   │   ├── useMoodAnalysis.ts   # Mood analysis logic
│   │   └── useMoodHistory.ts    # Historical mood data
│   ├── web3/                    # Web3 Hooks
│   │   ├── useWallet.ts         # Wallet connection state
│   │   ├── useChain.ts          # Chain switching logic
│   │   └── useTransaction.ts    # Transaction state
│   └── common/                  # Common Hooks
│       ├── useLocalStorage.ts   # Local storage hook
│       ├── useDebounce.ts       # Debouncing hook
│       ├── useIntersection.ts   # Intersection observer
│       └── useMediaQuery.ts     # Responsive breakpoints
├── context/                     # React Context
│   ├── MoodContext.tsx          # Global mood state
│   ├── ThemeContext.tsx         # Theme/dark mode
│   ├── WalletContext.tsx        # Wallet connection state
│   └── NotificationContext.tsx  # Toast notifications
├── types/                       # TypeScript Definitions
│   ├── index.ts                 # Main type exports
│   ├── mood.ts                  # Mood-related types
│   ├── token.ts                 # Token-related types
│   ├── swap.ts                  # Swap-related types
│   ├── wallet.ts                # Wallet-related types
│   ├── api.ts                   # API response types
│   └── oneinch.ts               # 1inch API types
├── data/                        # Static Data
│   ├── moods.ts                 # Mood definitions
│   ├── chains.ts                # Supported blockchain networks
│   ├── tokens.ts                # Default token list
│   ├── categories.ts            # Token categories
│   └── risks.ts                 # Risk level definitions
├── styles/                      # Styling
│   ├── globals.css              # Global CSS
│   ├── components.css           # Component-specific styles
│   └── animations.css           # Animation definitions
└── config/                      # Configuration
    ├── env.ts                   # Environment configuration
    ├── database.ts              # Database configuration
    ├── api.ts                   # API configuration
    └── web3.ts                  # Web3 configuration
```

---

## 🔧 Core System Components - Simplified

### 1. Basic Mood System
```typescript
interface SimpleMoodSystem {
  selectMood(moodId: string): void
  getTokenRecommendations(mood: Mood): Token[]
  calculateBasicScore(token: Token, mood: Mood): number
}
```

**Algorithm Components:**
- **Risk Mapping:** Simple mood to risk level (1-5 scale)
- **Category Filtering:** Basic token category matching
- **Price Sorting:** Sort by market cap + volume
- **Simple Scoring:** Basic compatibility scoring

### 2. Basic Token Scoring
```typescript
interface SimpleTokenScorer {
  scoreToken(token: Token, mood: Mood): number
  filterByRisk(tokens: Token[], riskLevel: number): Token[]
  sortByRelevance(tokens: Token[]): Token[]
}
```

**Simplified Scoring:**
- **Market Cap (40%):** Stability indicator
- **Volume (30%):** Liquidity indicator  
- **Category Match (30%):** Mood alignment

### 3. 1inch Integration (REQUIRED FOR ETHGLOBAL)
```typescript
interface OneInchComplete {
  // Data APIs 
  getTokenList(): Promise<Token[]>
  getTokenPrices(addresses: string[]): Promise<PriceData[]>
  
  // Swap APIs 
  getSwapQuote(params: SwapParams): Promise<SwapQuote>
  executeSwap(params: SwapParams): Promise<Transaction>
  
  // Additional APIs for bonus points
  getWalletBalance(address: string): Promise<Balance[]>
  getTokenMetadata(address: string): Promise<TokenMetadata>
}
```

### 4. Simple State Management
```typescript
// React Context only
interface AppState {
  mood: Mood | null
  tokens: Token[]
  selectedToken: Token | null
  isLoading: boolean
  wallet: {
    isConnected: boolean
    address: string | null
  }
}
```
```

---

##  Security Architecture

### Authentication & Authorization:
- **Wallet-based Authentication:** No traditional login required
- **Message Signing:** Verify wallet ownership for sensitive operations
- **Session Management:** Temporary session storage for UX improvement
- **Rate Limiting:** Prevent API abuse and spam

### Data Protection:
- **Input Sanitization:** All user inputs validated and sanitized
- **XSS Prevention:** Content Security Policy and sanitization
- **API Security:** Rate limiting and request validation
- **Local Storage:** Minimize sensitive data storage

### Smart Contract Security:
- **1inch Protocol Usage:** Leverage audited, battle-tested contracts
- **Transaction Validation:** Client-side validation before execution
- **Gas Estimation:** Prevent failed transactions
- **Slippage Protection:** User-defined maximum slippage

---

##  Performance Architecture - MVP

### Frontend Optimizations (Basic):
- **Simple Code Splitting:** Page-level splitting only
- **Image Optimization:** Next.js Image component
- **Basic Responsive Design:** Mobile-first approach
- **Essential Loading States:** Spinner components only

### API Optimizations (Essential):
- **Basic Caching:** 5-minute cache for token list and prices
- **Simple Error Handling:** Retry failed requests once
- **Request Debouncing:** 500ms delay for search inputs

### Data Strategy (Minimal):
- **Local Storage:** Selected mood and basic preferences only
- **Session Storage:** Temporary token selections
- **No Complex Caching:** Keep it simple

---

##  Data Flow Architecture

### User Interaction Flow:
```
User Action → Component → Hook → Service → API → 1inch
     ↓         ↓        ↓       ↓       ↓       ↓
State Update ← Context ← Cache ← Parse ← Response ← Data
```

### Real-time Data Updates:
- **Price Updates:** WebSocket connections for live prices
- **Transaction Status:** Polling for pending transactions
- **Balance Updates:** Refresh after successful swaps
- **Recommendation Updates:** Refresh when mood changes

---

##  Testing Strategy - MVP

### Minimal Testing Approach:
- **Manual Testing:** Core user flows tested manually
- **Browser Testing:** Chrome, Safari, Firefox basic compatibility
- **Mobile Testing:** iOS Safari and Android Chrome
- **API Testing:** Basic 1inch endpoint verification

### No Automated Testing for MVP:
- Skip Jest/Testing Library setup
- Skip E2E testing tools
- Skip component testing
- Focus on functional manual testing

---

##  Deployment Architecture - Simple

### Development:
- **Local Development:** Next.js dev server
- **Environment Variables:** .env.local for API keys

### Production:
- **Hosting:** Vercel (one-click deployment)
- **Domain:** Default Vercel domain for MVP
- **SSL:** Automatic with Vercel
- **No CI/CD:** Direct deployment from GitHub

---

**Document Version:** 2.0 - MVP  
**Last Updated:** January 28, 2025  
**Complexity:** Minimal for 6-day timeline  
**Focus:** Essential functionality only
