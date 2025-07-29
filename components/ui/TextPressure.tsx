'use client'

import React, { useState, useEffect, useRef } from 'react'

interface TextPressureProps {
  text: string
  flex?: boolean
  alpha?: boolean
  stroke?: boolean
  width?: boolean
  weight?: boolean
  italic?: boolean
  textColor?: string
  strokeColor?: string
  minFontSize?: number
  className?: string
}

const TextPressure: React.FC<TextPressureProps> = ({
  text,
  flex = true,
  alpha = false,
  stroke = false,
  width = true,
  weight = true,
  italic = true,
  textColor = "#000000",
  strokeColor = "#ff0000",
  minFontSize = 36,
  className = ""
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({ x, y })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const calculateDistance = (charIndex: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return 100

    const charWidth = containerRect.width / text.length
    const charX = (charIndex * charWidth) + (charWidth / 2)
    const charY = containerRect.height / 2

    const mouseX = (mousePosition.x / 100) * containerRect.width
    const mouseY = (mousePosition.y / 100) * containerRect.height

    const distance = Math.sqrt(
      Math.pow(mouseX - charX, 2) + Math.pow(mouseY - charY, 2)
    )

    const maxDistance = Math.sqrt(
      Math.pow(containerRect.width, 2) + Math.pow(containerRect.height, 2)
    )

    return Math.min(distance / maxDistance, 1)
  }

  const getCharStyle = (charIndex: number) => {
    const distance = calculateDistance(charIndex)
    const intensity = 1 - distance

    const style: React.CSSProperties = {
      color: textColor,
      display: 'inline-block',
      transition: 'all 0.15s ease-out',
    }

    if (flex) {
      const fontSize = minFontSize + (intensity * (minFontSize * 0.8))
      style.fontSize = `${fontSize}px`
    }

    if (alpha) {
      style.opacity = 0.3 + (intensity * 0.7)
    }

    if (stroke) {
      style.WebkitTextStroke = `${intensity * 2}px ${strokeColor}`
    }

    if (width) {
      style.fontStretch = `${50 + (intensity * 100)}%`
    }

    if (weight) {
      style.fontWeight = Math.round(300 + (intensity * 600))
    }

    if (italic) {
      style.fontStyle = intensity > 0.3 ? 'italic' : 'normal'
    }

    return style
  }

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block cursor-default select-none ${className}`}
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        lineHeight: 1.2
      }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={getCharStyle(index)}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}

export default TextPressure
