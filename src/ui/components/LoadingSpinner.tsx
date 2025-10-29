import React from 'react'
import { animations, colors, spacing } from '../tokens'

export interface LoadingSpinnerProps {
  size?: keyof typeof spacing
  color?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = '6',
  color = colors.primary[500],
  className = '',
}) => {
  const spinnerStyles = {
    width: spacing[size],
    height: spacing[size],
    border: `2px solid ${color}20`,
    borderTopColor: color,
    borderRadius: '50%',
    animation: animations.presets.spin,
  }

  return <div className={className} style={spinnerStyles} />
}

// AI-specific thinking animation
export const ThinkingDots: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const containerStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing[1],
  }

  const dotStyles = {
    width: spacing[2],
    height: spacing[2],
    borderRadius: '50%',
    backgroundColor: colors.neutral[400],
    animation: animations.presets.pulse,
  }

  return (
    <div className={className} style={containerStyles}>
      {[...Array.from({ length: 3 })].map((_, i) => (
        <div
          key={i}
          style={{
            ...dotStyles,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}
