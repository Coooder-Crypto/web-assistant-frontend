import OpenAI from 'openai';
import type { ChatAPI, ChatMessage, ChatContext, ChatOptions, ChatResponse, ApiConfig } from '@src/types';
import defaultPrompts from './prompt/default.json';

export class DeepseekAPI implements ChatAPI {
  private client: OpenAI | null = null;
  private readonly model = 'deepseek-coder';
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async getClient(): Promise<OpenAI> {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: this.config.apiKey,
        baseURL: 'https://api.deepseek.com/v1',
        dangerouslyAllowBrowser: true
      });
    }
    return this.client;
  }

  async sendMessage(
    content: string,
    messages: ChatMessage[] = [],
    context: ChatContext = {},
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    try {
      const client = await this.getClient();

      const apiMessages: OpenAI.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: defaultPrompts.system.default,
        },
      ];

      if (context.pageTitle || context.pageContent) {
        const contextMessage = defaultPrompts.system.contextAware
          .replace('{{pageTitle}}', context.pageTitle || 'N/A')
          .replace('{{pageContent}}', context.pageContent || 'N/A');
        
        apiMessages.push({
          role: 'system',
          content: contextMessage,
        });
      }

      apiMessages.push(
        ...messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }))
      );

      apiMessages.push({
        role: 'user',
        content,
      });

      const completion = await client.chat.completions.create({
        model: this.model,
        messages: apiMessages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1000,
        stream: false,
      });
      const reply = completion.choices[0]?.message?.content;
      if (!reply) {
        throw new Error('No response from OpenAI');
      }

      return {
        message: {
          content: reply,
          role: 'assistant'
        }
      };
    } catch (error) {
      console.error('Deepseek API error:', error);
      throw error;
    }
  }
}
