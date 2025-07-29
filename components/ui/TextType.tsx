'use client'

import React, { useState, useEffect } from 'react'

interface TextTypeProps {
  text: string[]
  typingSpeed?: number
  pauseDuration?: number
  showCursor?: boolean
  cursorCharacter?: string
  className?: string
}

const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "|",
  className = ""
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [showCursorBlink, setShowCursorBlink] = useState(true)

  useEffect(() => {
    const currentFullText = text[currentTextIndex]
    
    if (isTyping) {
      if (currentText.length < currentFullText.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length + 1))
        }, typingSpeed)
        
        return () => clearTimeout(timeout)
      } else {
        // Finished typing current text
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, pauseDuration)
        
        return () => clearTimeout(timeout)
      }
    } else {
      // Start erasing
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, typingSpeed / 2)
        
        return () => clearTimeout(timeout)
      } else {
        // Move to next text
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % text.length)
        setIsTyping(true)
      }
    }
  }, [currentText, currentTextIndex, isTyping, text, typingSpeed, pauseDuration])

  useEffect(() => {
    if (!showCursor) return
    
    const interval = setInterval(() => {
      setShowCursorBlink(prev => !prev)
    }, 500)
    
    return () => clearInterval(interval)
  }, [showCursor])

  return (
    <span className={className}>
      {currentText}
      {showCursor && (
        <span 
          className={`${showCursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}

export default TextType
