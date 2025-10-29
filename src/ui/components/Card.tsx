import React from 'react'
import { animations, colors, radius, shadows, spacing } from '../tokens'

export interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: keyof typeof spacing
  className?: string
  hoverable?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = '6',
  className = '',
  hoverable = false,
  onClick,
}) => {
  const baseStyles = {
    borderRadius: radius.xl,
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    cursor: onClick ? 'pointer' : 'default',
    overflow: 'hidden' as const,
  }

  const variants = {
    default: {
      backgroundColor: colors.neutral[0],
      border: `1px solid ${colors.neutral[100]}`,
      boxShadow: shadows.sm,
    },
    elevated: {
      backgroundColor: colors.neutral[0],
      boxShadow: shadows.lg,
      border: 'none',
    },
    outlined: {
      backgroundColor: colors.neutral[0],
      border: `2px solid ${colors.neutral[200]}`,
      boxShadow: 'none',
    },
    glass: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${colors.neutral[200]}40`,
      boxShadow: shadows.md,
    },
  }

  const hoverStyles = hoverable
    ? {
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: variant === 'elevated' ? shadows.xl : shadows.md,
          borderColor: variant === 'outlined' ? colors.primary[200] : undefined,
        },
      }
    : {}

  const cardStyles = {
    ...baseStyles,
    ...variants[variant],
    padding: spacing[padding],
    ...hoverStyles,
  }

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
