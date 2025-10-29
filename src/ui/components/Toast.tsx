import React, { useEffect, useState } from 'react'
import { animations, colors, radius, shadows, spacing, typography } from '../tokens'

export interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose: () => void
  className?: string
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 200) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const variants = {
    success: {
      backgroundColor: colors.semantic.success,
      color: colors.neutral[0],
      icon: '✓',
    },
    error: {
      backgroundColor: colors.semantic.error,
      color: colors.neutral[0],
      icon: '✕',
    },
    warning: {
      backgroundColor: colors.semantic.warning,
      color: colors.neutral[0],
      icon: '⚠',
    },
    info: {
      backgroundColor: colors.primary[500],
      color: colors.neutral[0],
      icon: 'ⓘ',
    },
  }

  const toastStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: radius.lg,
    boxShadow: shadows.lg,
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    maxWidth: '400px',
    position: 'fixed' as const,
    top: spacing[6],
    right: spacing[6],
    zIndex: 1000,
    transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
    opacity: isVisible ? 1 : 0,
    transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
    ...variants[type],
  }

  const iconStyles = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  }

  return (
    <div className={className} style={toastStyles}>
      <span style={iconStyles}>{variants[type].icon}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 200)
        }}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: typography.fontSize.lg,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  )
}
