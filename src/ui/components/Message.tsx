import React from 'react'
import { animations, colors, radius, spacing, typography } from '../tokens'

export interface MessageProps {
  content: string
  role: 'user' | 'assistant' | 'system'
  timestamp?: Date
  isLoading?: boolean
  className?: string
}

export const Message: React.FC<MessageProps> = ({
  content,
  role,
  timestamp,
  isLoading = false,
  className = '',
}) => {
  const isUser = role === 'user'
  const isAssistant = role === 'assistant'
  const isSystem = role === 'system'

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: isUser ? 'flex-end' : 'flex-start',
    marginBottom: spacing[4],
    maxWidth: '100%',
    animation: animations.presets.fadeIn,
    opacity: 0,
    animationFillMode: 'forwards' as const,
  }

  const messageStyles = {
    maxWidth: '85%',
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: radius.xl,
    fontFamily: typography.fontFamily.sans.join(', '),
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.relaxed,
    wordWrap: 'break-word' as const,
    position: 'relative' as const,

    ...(isUser && {
      backgroundColor: colors.primary[500],
      color: colors.neutral[0],
      borderBottomRightRadius: radius.md,
    }),

    ...(isAssistant && {
      backgroundColor: colors.ai.message.assistant,
      color: colors.neutral[800],
      border: `1px solid ${colors.neutral[200]}`,
      borderBottomLeftRadius: radius.md,
    }),

    ...(isSystem && {
      backgroundColor: colors.ai.message.system,
      color: colors.neutral[700],
      border: `1px solid ${colors.semantic.warning}40`,
      fontSize: typography.fontSize.sm,
      fontStyle: 'italic',
    }),
  }

  const timestampStyles = {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[400],
    marginTop: spacing[1],
    marginLeft: isUser ? 'auto' : spacing[2],
    marginRight: isUser ? spacing[2] : 'auto',
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  }

  return (
    <div className={className} style={containerStyles}>
      {/* AI Avatar for assistant messages */}
      {isAssistant && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: spacing[1],
          }}
        >
          <div
            style={{
              width: spacing[6],
              height: spacing[6],
              borderRadius: radius.full,
              background: `linear-gradient(135deg, ${colors.ai.gradient.start}, ${colors.ai.gradient.end})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: spacing[2],
            }}
          >
            <span
              style={{
                color: colors.neutral[0],
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
              }}
            >
              AI
            </span>
          </div>
          <span
            style={{
              fontSize: typography.fontSize.sm,
              color: colors.neutral[500],
              fontWeight: typography.fontWeight.medium,
            }}
          >
            Assistant
          </span>
        </div>
      )}

      <div style={messageStyles}>
        {isLoading && isAssistant
          ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                {[...Array.from({ length: 3 })].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: spacing[2],
                      height: spacing[2],
                      borderRadius: radius.full,
                      backgroundColor: colors.neutral[400],
                      animation: `${animations.presets.pulse}`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            )
          : (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
      </div>

      {timestamp && !isLoading && (
        <div style={timestampStyles}>
          {formatTimestamp(timestamp)}
        </div>
      )}
    </div>
  )
}
