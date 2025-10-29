import React, { useEffect } from 'react'
import { animations, colors, radius, shadows, spacing } from '../tokens'

export interface ModalProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  className?: string
  closeOnBackdropClick?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  size = 'md',
  title,
  className = '',
  closeOnBackdropClick = true,
}) => {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen)
    return null

  const backdropStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing[4],
    animation: animations.presets.fadeIn,
  }

  const sizes = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '500px' },
    lg: { maxWidth: '700px' },
    xl: { maxWidth: '900px' },
  }

  const modalStyles = {
    backgroundColor: colors.neutral[0],
    borderRadius: radius['2xl'],
    boxShadow: shadows['2xl'],
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative' as const,
    animation: `${animations.presets.slideUp}, ${animations.presets.fadeIn}`,
    ...sizes[size],
  }

  const headerStyles = {
    padding: `${spacing[6]} ${spacing[6]} ${spacing[4]}`,
    borderBottom: title ? `1px solid ${colors.neutral[200]}` : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const titleStyles = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.neutral[900],
    margin: 0,
  }

  const closeButtonStyles = {
    'width': spacing[8],
    'height': spacing[8],
    'borderRadius': radius.md,
    'border': 'none',
    'backgroundColor': 'transparent',
    'cursor': 'pointer',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'color': colors.neutral[400],
    'transition': `all ${animations.duration.fast} ${animations.easing.easeInOut}`,

    '&:hover': {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[600],
    },
  }

  const contentStyles = {
    padding: title ? `0 ${spacing[6]} ${spacing[6]}` : spacing[6],
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose()
    }
  }

  return (
    <div style={backdropStyles} onClick={handleBackdropClick}>
      <div className={className} style={modalStyles}>
        {title && (
          <div style={headerStyles}>
            <h2 style={titleStyles}>{title}</h2>
            <button
              style={closeButtonStyles}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 5-10 10m0-10 10 10" />
              </svg>
            </button>
          </div>
        )}

        <div style={contentStyles}>
          {children}
        </div>
      </div>
    </div>
  )
}
