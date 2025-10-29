import React, { forwardRef } from 'react'
import { animations, colors, radius, spacing, typography } from '../tokens'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  type?: 'text' | 'email' | 'password' | 'search'
  size?: 'sm' | 'md' | 'lg'
  multiline?: boolean
  rows?: number
  maxRows?: number
  className?: string
  onKeyDown?: (e: React.KeyboardEvent) => void
  onCompositionStart?: () => void
  onCompositionEnd?: () => void
  autoFocus?: boolean
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({
    value,
    onChange,
    placeholder,
    disabled = false,
    error = false,
    type = 'text',
    size = 'md',
    multiline = false,
    rows = 1,
    maxRows,
    className = '',
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
    autoFocus = false,
  }, ref) => {
    const baseStyles = {
      'width': '100%',
      'fontFamily': typography.fontFamily.sans.join(', '),
      'fontSize': typography.fontSize.base,
      'lineHeight': typography.lineHeight.normal,
      'color': colors.neutral[900],
      'backgroundColor': colors.neutral[0],
      'border': `1px solid ${error ? colors.semantic.error : colors.neutral[200]}`,
      'borderRadius': radius.lg,
      'outline': 'none',
      'transition': `all ${animations.duration.fast} ${animations.easing.easeInOut}`,
      'resize': multiline ? 'vertical' as const : 'none' as const,

      '&:focus': {
        borderColor: error ? colors.semantic.error : colors.primary[500],
        boxShadow: error
          ? `0 0 0 3px ${colors.semantic.error}15`
          : `0 0 0 3px ${colors.ai.accent.glow}`,
      },

      '&:hover:not(:disabled)': {
        borderColor: error ? colors.semantic.error : colors.neutral[300],
      },

      '&::placeholder': {
        color: colors.neutral[400],
      },

      '&:disabled': {
        backgroundColor: colors.neutral[50],
        color: colors.neutral[400],
        cursor: 'not-allowed',
        borderColor: colors.neutral[200],
      },
    }

    const sizes = {
      sm: {
        padding: `${spacing[2]} ${spacing[3]}`,
        fontSize: typography.fontSize.sm,
      },
      md: {
        padding: `${spacing[3]} ${spacing[4]}`,
        fontSize: typography.fontSize.base,
      },
      lg: {
        padding: `${spacing[4]} ${spacing[5]}`,
        fontSize: typography.fontSize.lg,
      },
    }

    const inputStyles = {
      ...baseStyles,
      ...sizes[size],
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e.target.value)
    }

    const commonProps = {
      value,
      onChange: handleChange,
      placeholder,
      disabled,
      onKeyDown,
      onCompositionStart,
      onCompositionEnd,
      autoFocus,
      className,
      style: inputStyles,
    }

    if (multiline) {
      return (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows}
          {...(maxRows && { style: { ...inputStyles, maxHeight: `${maxRows * 1.5}em` } })}
          {...commonProps}
        />
      )
    }

    return (
      <input
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        {...commonProps}
      />
    )
  },
)
