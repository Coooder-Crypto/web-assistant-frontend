import React from 'react'
import { animations, colors, radius, spacing, typography } from '../tokens'

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const baseStyles = {
    'display': 'inline-flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'fontFamily': typography.fontFamily.sans.join(', '),
    'fontWeight': typography.fontWeight.medium,
    'letterSpacing': typography.letterSpacing.normal,
    'borderRadius': radius.lg,
    'border': 'none',
    'cursor': disabled || loading ? 'not-allowed' : 'pointer',
    'transition': `all ${animations.duration.fast} ${animations.easing.easeInOut}`,
    'position': 'relative' as const,
    'overflow': 'hidden',
    'outline': 'none',
    'userSelect': 'none' as const,

    // Focus styles
    '&:focus-visible': {
      outline: `2px solid ${colors.primary[500]}`,
      outlineOffset: '2px',
    },
  }

  const variants = {
    primary: {
      'backgroundColor': colors.primary[500],
      'color': colors.neutral[0],
      '&:hover:not(:disabled)': {
        backgroundColor: colors.primary[600],
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px 0 rgb(99 102 241 / 0.2)',
      },
      '&:active:not(:disabled)': {
        transform: 'translateY(0)',
        backgroundColor: colors.primary[700],
      },
    },
    secondary: {
      'backgroundColor': colors.neutral[100],
      'color': colors.neutral[700],
      'border': `1px solid ${colors.neutral[200]}`,
      '&:hover:not(:disabled)': {
        backgroundColor: colors.neutral[50],
        borderColor: colors.primary[300],
        transform: 'translateY(-1px)',
      },
    },
    ghost: {
      'backgroundColor': 'transparent',
      'color': colors.neutral[600],
      '&:hover:not(:disabled)': {
        backgroundColor: colors.neutral[100],
        color: colors.neutral[700],
      },
    },
    danger: {
      'backgroundColor': colors.semantic.error,
      'color': colors.neutral[0],
      '&:hover:not(:disabled)': {
        backgroundColor: '#dc2626',
        transform: 'translateY(-1px)',
      },
    },
  }

  const sizes = {
    sm: {
      height: spacing[8],
      paddingLeft: spacing[3],
      paddingRight: spacing[3],
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: spacing[10],
      paddingLeft: spacing[4],
      paddingRight: spacing[4],
      fontSize: typography.fontSize.base,
    },
    lg: {
      height: spacing[12],
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      fontSize: typography.fontSize.lg,
    },
  }

  const disabledStyles = {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none !important',
  }

  const buttonStyles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    ...(disabled || loading ? disabledStyles : {}),
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={buttonStyles}
    >
      {loading && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: spacing[2],
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: animations.presets.spin,
            }}
          />
        </div>
      )}
      {children}
    </button>
  )
}
