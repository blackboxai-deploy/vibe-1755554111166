'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent'

interface GameTileProps {
  letter: string
  state: TileState
  position: number
  delay?: number
  isRevealing?: boolean
  isInvalid?: boolean
}

export function GameTile({ 
  letter, 
  state, 
  position, 
  delay = 0, 
  isRevealing = false,
  isInvalid = false 
}: GameTileProps) {
  const getTileStyles = () => {
    const baseStyles = "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-all duration-300"
    
    switch (state) {
      case 'empty':
        return cn(baseStyles, "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800")
      case 'filled':
        return cn(baseStyles, "border-gray-400 dark:border-gray-500 bg-white dark:bg-gray-800 text-black dark:text-white")
      case 'correct':
        return cn(baseStyles, "border-green-500 bg-green-500 text-white")
      case 'present':
        return cn(baseStyles, "border-yellow-500 bg-yellow-500 text-white")
      case 'absent':
        return cn(baseStyles, "border-gray-500 bg-gray-500 text-white")
      default:
        return cn(baseStyles, "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800")
    }
  }

  const tileVariants = {
    idle: { 
      scale: 1, 
      rotateX: 0,
      transition: { duration: 0.1 }
    },
    filled: { 
      scale: 1.05,
      transition: { duration: 0.1 }
    },
    revealing: {
      rotateX: [0, 90, 0],
      transition: { 
        duration: 0.6,
        delay: delay * 0.1,
        times: [0, 0.5, 1]
      }
    },
    invalid: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.4 }
    }
  }

  const getAnimationState = () => {
    if (isInvalid) return 'invalid'
    if (isRevealing) return 'revealing'
    if (letter && state === 'filled') return 'filled'
    return 'idle'
  }

  return (
    <motion.div
      className={getTileStyles()}
      variants={tileVariants}
      animate={getAnimationState()}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {letter}
    </motion.div>
  )
}