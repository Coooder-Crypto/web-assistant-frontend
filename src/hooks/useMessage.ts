import type { ApiProvider, ChatMessage } from '@src/types'
import { useState } from 'react'
import { handleError } from '../store/AppContext'
import { apiManager } from '../utils/api/index'

const MAX_MESSAGES = 10

export interface MessageState {
  messages: ChatMessage[]
  isSending: boolean
  error: string | null
}

interface SendMessageOptions {
  provider: ApiProvider
  pageTitle?: string
  pageContent?: string
}

export function useMessage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (content: string, options: SendMessageOptions) => {
    if (!content.trim() || isSending)
      return

    const newMessage: ChatMessage = { role: 'user', content }
    setMessages(prev => [...prev, newMessage])
    setIsSending(true)

    try {
      const response = await apiManager.sendMessage(
        options.provider,
        content,
        messages.slice(-MAX_MESSAGES),
        {
          pageTitle: options.pageTitle,
          pageContent: options.pageContent,
        },
      )

      setMessages(prev => [...prev, { role: 'assistant', content: response.message.content }])
      setError(null)
    }
    catch (error) {
      console.error('Failed to send message:', error)
      setError(handleError(error))
    }
    finally {
      setIsSending(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  return {
    messages,
    isSending,
    error,
    sendMessage,
    clearMessages,
  }
}
