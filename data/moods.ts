import { Mood } from '@/types'

export const MOODS: Mood[] = [
  {
    id: 'excited',
    name: 'Excited',
    description: 'I\'m looking for high rewards!',
    emoji: '🚀',
    color: '#10B981', // Green
    riskLevel: 'high',
    categories: ['meme', 'gaming', 'ai', 'new-listings']
  },
  {
    id: 'cautious',
    name: 'Cautious',
    description: 'I want safe investments',
    emoji: '🛡️',
    color: '#3B82F6', // Blue
    riskLevel: 'low',
    categories: ['stablecoin', 'blue-chip', 'defi-blue-chip']
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: 'Medium risk, medium reward',
    emoji: '⚖️',
    color: '#8B5CF6', // Purple
    riskLevel: 'medium',
    categories: ['defi', 'layer-1', 'layer-2']
  },
  {
    id: 'fomo',
    name: 'FOMO',
    description: 'I want to catch the trend!',
    emoji: '📈',
    color: '#F59E0B', // Yellow
    riskLevel: 'high',
    categories: ['trending', 'social-sentiment', 'high-volume']
  },
  {
    id: 'dip-buyer',
    name: 'Dip Buyer',
    description: 'Looking for discounted tokens',
    emoji: '💎',
    color: '#EF4444', // Red
    riskLevel: 'medium',
    categories: ['oversold', 'down-24h', 'value']
  }
]

// Helper function to get mood by ID
export const getMoodById = (id: string): Mood | undefined => {
  return MOODS.find(mood => mood.id === id)
}

// Helper function to get mood categories
export const getMoodCategories = (mood: Mood): string[] => {
  return mood.categories
}
