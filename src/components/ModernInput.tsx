import { colors, radius, spacing } from '@src/ui'
import { useEffect, useRef, useState } from 'react'

interface ModernInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
  maxRows?: number
  disabled?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
  onCompositionStart?: () => void
  onCompositionEnd?: () => void
  onSubmit?: (value: string) => void
  isFocus?: boolean
  onFocus?: (isFocus: boolean) => void
}

export function ModernInput({
  value,
  onChange,
  placeholder = 'Ask anything...',
  multiline = true,
  rows = 1,
  maxRows = 4,
  disabled = false,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  onSubmit,
  isFocus: externalFocus,
  onFocus,
}: ThunderbitInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [internalFocus, setInternalFocus] = useState(false)

  const isFocused = externalFocus !== undefined ? externalFocus : internalFocus

  useEffect(() => {
    if (!textareaRef.current)
      return

    // Auto-resize functionality
    const textarea = textareaRef.current
    textarea.style.height = 'auto'
    const scrollHeight = textarea.scrollHeight
    const maxHeight = Number.parseInt(getComputedStyle(textarea).lineHeight) * maxRows + 20 // padding
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
  }, [value, maxRows])

  useEffect(() => {
    if (externalFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [externalFocus])

  const handleFocus = () => {
    setInternalFocus(true)
    onFocus?.(true)
  }

  const handleBlur = () => {
    setInternalFocus(false)
    onFocus?.(false)
  }

  const handleSubmit = () => {
    if (!value.trim() || disabled)
      return
    onSubmit?.(value.trim())
  }

  const containerStyles = {
    width: '100%',
    border: `1px solid ${isFocused ? colors.purple[400] : colors.neutral[700]}`,
    backgroundColor: colors.neutral[850],
    borderRadius: radius.md,
    padding: `${spacing[2]} ${spacing[3]}`,
    transition: 'border 0.2s ease-in-out',
    position: 'relative' as const,
  }

  const textareaStyles = {
    width: '100%',
    minHeight: multiline ? `${rows * 1.5}rem` : 'auto',
    maxHeight: multiline ? `${maxRows * 1.5}rem` : 'auto',
    outline: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.neutral[100],
    fontSize: '14px',
    lineHeight: '1.5',
    resize: 'none' as const,
    fontFamily: 'Helvetica, Helvetica Neue, Arial, sans-serif',
  }

  const placeholderStyles = {
    position: 'absolute' as const,
    top: spacing[2],
    left: spacing[3],
    color: colors.neutral[500],
    fontSize: '14px',
    pointerEvents: 'none' as const,
    opacity: value ? 0 : 1,
    transition: 'opacity 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: spacing[1],
  }

  const submitButtonStyles = {
    position: 'absolute' as const,
    right: spacing[2],
    bottom: spacing[2],
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: value.trim() ? colors.ai.gradient.start : colors.neutral[700],
    color: colors.neutral[100],
    cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
    opacity: value.trim() ? 1 : 0.5,
  }

  return (
    <div style={containerStyles}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        style={textareaStyles}
        rows={multiline ? rows : 1}
      />

      <div style={placeholderStyles}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M0.5 4.49889C0.13039 4.64019 0.13039 5.2398 0.5 5.3811L1.15699 5.63227C1.64121 5.81739 2.2985 6.25318 2.45991 6.80855L2.67891 7.56205C2.80211 7.98596 3.32491 7.98596 3.44811 7.56205L3.66711 6.80855C3.82852 6.25319 4.35889 5.81739 4.84312 5.63227L5.5001 5.3811C5.86971 5.2398 5.86972 4.64019 5.50011 4.49889L4.84312 4.24772C4.35889 4.0626 3.82852 3.6268 3.66711 3.07143L3.44811 2.31793C3.32491 1.89402 2.80211 1.89402 2.67891 2.31793L2.45991 3.07143C2.2985 3.6268 1.64121 4.0626 1.15699 4.24772L0.5 4.49889Z"
            fill={colors.neutral[500]}
          />
          <path
            d="M10.3432 3.66667C10.8106 3.66667 11.0164 4.19453 11.254 4.80416C11.4391 5.27897 11.6436 6.80339 12.006 7.16667C12.3684 7.52994 13.8916 7.73486 14.3653 7.92039C14.9735 8.15861 15.5001 8.36486 15.5001 8.83333C15.5001 9.3018 14.9735 9.50806 14.3653 9.74628C13.8916 9.93181 12.3684 10.1367 12.006 10.5C11.6436 10.8633 11.4391 12.3877 11.254 12.8625C11.0164 13.4721 10.8106 14 10.3432 14C9.87587 14 9.67009 13.4721 9.43244 12.8625C9.24734 12.3877 9.0429 10.8633 8.68048 10.5C8.31806 10.1367 6.79488 9.93181 6.32118 9.74628C5.71298 9.50806 5.18636 9.3018 5.18636 8.83333C5.18636 8.36486 5.71298 8.1586 6.32119 7.92039C6.79488 7.73486 8.31806 7.52994 8.68048 7.16667C9.0429 6.80339 9.24734 5.27897 9.43244 4.80416C9.67009 4.19453 9.87587 3.66667 10.3432 3.66667Z"
            fill={colors.neutral[500]}
          />
        </svg>
        <span>{placeholder}</span>
      </div>

      {onSubmit && (
        <button
          style={submitButtonStyles}
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m20 10-10 6V4l10 6Z" />
            <path d="M10 10H0" />
          </svg>
        </button>
      )}
    </div>
  )
}
