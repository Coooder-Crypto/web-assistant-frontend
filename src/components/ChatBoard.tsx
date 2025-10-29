import type { ChatMessage } from '@src/types'
import { colors, Message, spacing } from '@src/ui'
import { useEffect, useRef } from 'react'

interface ChatBoardProps {
  messages: ChatMessage[]
  isSending: boolean
}

export default function ChatBoard({ messages, isSending }: ChatBoardProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isSending])

  const containerStyles = {
    flex: 1,
    overflowY: 'auto' as const,
    padding: `${spacing[6]} ${spacing[4]}`,
    backgroundColor: colors.neutral[850], // Dark background
    display: 'flex',
    flexDirection: 'column' as const,
  }

  const messagesStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[4],
    maxWidth: '100%',
  }

  const emptyStateStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center' as const,
    padding: spacing[8],
    color: colors.neutral[300], // Light text for dark theme
  }

  const emptyIconStyles = {
    fontSize: '4rem',
    marginBottom: spacing[4],
  }

  const emptyTitleStyles = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: colors.neutral[100], // Light title for dark theme
    marginBottom: spacing[2],
  }

  const emptyDescriptionStyles = {
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '400px',
  }

  const suggestionStyles = {
    marginTop: spacing[6],
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[2],
    alignItems: 'center',
  }

  const suggestionTitleStyles = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: colors.neutral[600],
    marginBottom: spacing[2],
  }

  const suggestionListStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[1],
    alignItems: 'center',
  }

  const suggestionItemStyles = {
    fontSize: '0.875rem',
    color: colors.neutral[500],
    backgroundColor: colors.neutral[100],
    padding: `${spacing[2]} ${spacing[3]}`,
    borderRadius: '1rem',
    border: 'none',
    cursor: 'default',
  }

  const suggestions = [
    '📄 "概括这个页面"',
    '💡 "解释主要概念"',
    '🔍 "找出关键信息"',
  ]

  return (
    <div ref={scrollRef} style={containerStyles}>
      {messages.length === 0
        ? (
            <div style={emptyStateStyles}>
              <div style={emptyIconStyles}>🤖</div>
              <h2 style={emptyTitleStyles}>欢迎使用 Web Assistant</h2>
              <p style={emptyDescriptionStyles}>
                我可以帮助您理解和分析当前网页的内容。问我任何关于这个页面的问题！
              </p>

              <div style={suggestionStyles}>
                <p style={suggestionTitleStyles}>试试这些问题:</p>
                <div style={suggestionListStyles}>
                  {suggestions.map(suggestion => (
                    <span key={suggestion} style={suggestionItemStyles}>
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        : (
            <div style={messagesStyles}>
              {messages.map((message, index) => (
                <Message
                  key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
                  content={message.content}
                  role={message.role}
                  timestamp={new Date()}
                />
              ))}

              {isSending && (
                <Message
                  key="loading-message"
                  content=""
                  role="assistant"
                  isLoading
                />
              )}
            </div>
          )}
    </div>
  )
}
