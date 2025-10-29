import React from 'react'
import { colors, radius, spacing, typography } from '../tokens'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ai'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: typography.fontFamily.sans.join(', '),
    fontWeight: typography.fontWeight.medium,
    borderRadius: radius.full,
    border: 'none',
    whiteSpace: 'nowrap' as const,
  }

  const variants = {
    primary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[700],
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[700],
    },
    success: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    },
    ai: {
      background: `linear-gradient(135deg, ${colors.ai.gradient.start}, ${colors.ai.gradient.end})`,
      color: colors.neutral[0],
    },
  }

  const sizes = {
    sm: {
      height: spacing[5],
      paddingLeft: dot ? spacing[1] : spacing[2],
      paddingRight: dot ? spacing[1] : spacing[2],
      fontSize: typography.fontSize.xs,
      minWidth: dot ? spacing[5] : 'auto',
    },
    md: {
      height: spacing[6],
      paddingLeft: dot ? spacing[1] : spacing[3],
      paddingRight: dot ? spacing[1] : spacing[3],
      fontSize: typography.fontSize.sm,
      minWidth: dot ? spacing[6] : 'auto',
    },
    lg: {
      height: spacing[8],
      paddingLeft: dot ? spacing[2] : spacing[4],
      paddingRight: dot ? spacing[2] : spacing[4],
      fontSize: typography.fontSize.base,
      minWidth: dot ? spacing[8] : 'auto',
    },
  }

  const badgeStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  }

  return (
    <span className={className} style={badgeStyles}>
      {dot
        ? (
            <div
              style={{
                width: spacing[2],
                height: spacing[2],
                borderRadius: radius.full,
                backgroundColor: 'currentColor',
              }}
            />
          )
        : (
            children
          )}
    </span>
  )
}
