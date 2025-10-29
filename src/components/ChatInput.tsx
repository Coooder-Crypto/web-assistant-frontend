import { colors, radius, spacing } from '@src/ui'
import { useState } from 'react'
import { ModernInput } from './ModernInput'

interface ChatInputProps {
  onSend: (content: string) => Promise<void>
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const handleSubmit = async (e: React.FormEvent, content?: string) => {
    e.preventDefault()
    const message = content || input.trim()
    if (disabled || !message)
      return

    await onSend(message)
    if (!content) {
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const quickActions = [
    { text: '概括这个页面', icon: '📝', label: 'Summarize page' },
    { text: '解释这个页面的主要内容', icon: '💡', label: 'Explain content' },
    { text: '这个页面有什么有趣的地方？', icon: '🔍', label: 'Find insights' },
  ]

  const containerStyles = {
    padding: spacing[4],
    borderTop: `1px solid ${colors.neutral[700]}`, // Dark border
    backgroundColor: colors.neutral[800], // Dark input area bg
  }

  const quickActionsStyles = {
    display: 'flex',
    gap: spacing[2],
    marginBottom: spacing[3],
    overflowX: 'auto' as const,
    paddingBottom: spacing[1],
  }

  const quickActionStyles = {
    'display': 'flex',
    'alignItems': 'center',
    'gap': spacing[1],
    'padding': `${spacing[2]} ${spacing[3]}`,
    'backgroundColor': colors.neutral[700], // Dark button bg
    'border': `1px solid ${colors.neutral[600]}`, // Dark border
    'borderRadius': radius.lg,
    'fontSize': '0.875rem',
    'color': colors.neutral[200], // Light text
    'cursor': disabled ? 'not-allowed' : 'pointer',
    'whiteSpace': 'nowrap' as const,
    'transition': 'all 150ms ease',

    '&:hover': !disabled
      ? {
          backgroundColor: colors.purple[700], // Purple hover for dark theme
          borderColor: colors.purple[600],
          color: colors.neutral[100],
        }
      : {},
  }

  const inputContainerStyles = {
    display: 'flex',
    gap: spacing[3],
    alignItems: 'flex-end',
  }

  return (
    <div style={containerStyles}>
      {/* Quick Actions */}
      <div style={quickActionsStyles}>
        {quickActions.map(action => (
          <button
            key={action.text}
            type="button"
            style={quickActionStyles}
            onClick={e => handleSubmit(e, action.text)}
            disabled={disabled}
            title={action.label}
          >
            <span>{action.icon}</span>
            <span>{action.text}</span>
          </button>
        ))}
      </div>

      {/* Input Container */}
      <div style={inputContainerStyles}>
        <ModernInput
          value={input}
          onChange={setInput}
          placeholder="询问关于这个页面的任何问题..."
          multiline
          rows={1}
          maxRows={4}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onSubmit={value => handleSubmit(new Event('submit') as any, value)}
        />
      </div>
    </div>
  )
}
