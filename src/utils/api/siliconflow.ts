import type { ApiConfig, ChatAPI, ChatContext, ChatMessage, ChatOptions, ChatResponse } from '@src/types/api'
import defaultPrompts from './prompt/default.json'

const DEFAULT_MODEL = 'deepseek-ai/DeepSeek-R1'
const ENDPOINT = 'https://api.siliconflow.cn/v1/chat/completions'

type SiliconFlowRole = 'system' | 'user' | 'assistant'

interface SiliconFlowMessage {
  role: SiliconFlowRole
  content: string
}

interface SiliconFlowChoice {
  message?: {
    content?: string
  }
}

interface SiliconFlowResponse {
  choices?: SiliconFlowChoice[]
}

export class SiliconFlowAPI implements ChatAPI {
  private config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private resolveModel(): string {
    const trimmed = this.config.model?.trim()
    return trimmed && trimmed.length > 0 ? trimmed : DEFAULT_MODEL
  }

  async sendMessage(
    content: string,
    messages: ChatMessage[] = [],
    context: ChatContext = {},
    options: ChatOptions = {},
  ): Promise<ChatResponse> {
    const apiMessages: SiliconFlowMessage[] = [
      {
        role: 'system',
        content: defaultPrompts.system.default,
      },
    ]

    if (context.pageTitle || context.pageContent) {
      const contextMessage = defaultPrompts.system.contextAware
        .replace('{{pageTitle}}', context.pageTitle || 'N/A')
        .replace('{{pageContent}}', context.pageContent || 'N/A')

      apiMessages.push({
        role: 'system',
        content: contextMessage,
      })
    }

    apiMessages.push(
      ...messages.map(msg => ({
        role: msg.role as SiliconFlowRole,
        content: msg.content,
      })),
    )

    apiMessages.push({
      role: 'user',
      content,
    })

    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.resolveModel(),
        messages: apiMessages,
        max_tokens: options.maxTokens ?? 1000,
        temperature: options.temperature ?? 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`SiliconFlow API error: ${response.status} ${errorText}`)
    }

    const data = (await response.json()) as SiliconFlowResponse
    const reply = data.choices?.[0]?.message?.content

    if (!reply) {
      throw new Error('SiliconFlow responded without content')
    }

    return {
      message: {
        content: reply.trim(),
        role: 'assistant',
      },
    }
  }
}
