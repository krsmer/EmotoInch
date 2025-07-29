'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { MOODS } from '@/data/moods'
import { Mood } from '@/types'

interface MoodSelectorProps {
  onMoodSelect: (mood: Mood) => void
  selectedMood?: Mood | null
}

export function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          How are you feeling about trading today?
        </h2>
        <p className="text-gray-600 text-lg">
          Choose your mood to get personalized token recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOODS.map((mood: Mood) => {
          const isSelected = selectedMood?.id === mood.id
          const isHovered = hoveredMood === mood.id
          
          return (
            <Card
              key={mood.id}
              className={`
                relative overflow-hidden cursor-pointer transition-all duration-300 transform
                ${isSelected 
                  ? 'ring-4 ring-offset-2 scale-105 shadow-2xl' 
                  : 'hover:scale-102 hover:shadow-lg'
                }
                ${isHovered ? 'translate-y-[-2px]' : ''}
              `}
              style={{
                borderColor: isSelected || isHovered ? mood.color : undefined,
                boxShadow: isSelected ? `0 0 0 4px ${mood.color}40` : undefined,
              }}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              onClick={() => onMoodSelect(mood)}
            >
              {/* Background gradient effect */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{ 
                  background: `linear-gradient(135deg, ${mood.color}20, transparent)` 
                }}
              />
              
              <div className="relative p-6 text-center">
                {/* Emoji */}
                <div className="text-4xl mb-3 transform transition-transform duration-200">
                  {mood.emoji}
                </div>
                
                {/* Mood name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {mood.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {mood.description}
                </p>
                
                {/* Risk level indicator */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Risk Level:
                  </span>
                  <span 
                    className={`
                      px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${mood.riskLevel === 'low' 
                        ? 'bg-green-100 text-green-800' 
                        : mood.riskLevel === 'medium' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }
                    `}
                  >
                    {mood.riskLevel}
                  </span>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: mood.color }}
                    >
                      ✓
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Action button */}
      {selectedMood && (
        <div className="text-center mt-8">
          <Button
            className="px-8 py-3 text-lg font-semibold"
            style={{ 
              backgroundColor: selectedMood.color,
              borderColor: selectedMood.color 
            }}
            onClick={() => onMoodSelect(selectedMood)}
          >
            Get {selectedMood.name} Recommendations {selectedMood.emoji}
          </Button>
        </div>
      )}
    </div>
  )
}
