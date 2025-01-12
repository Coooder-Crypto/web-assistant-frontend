import OpenAI from 'openai';
import { getStoredApiKey } from '../storage';
import type { ChatAPI, ChatMessage, ChatContext, ChatOptions, ChatResponse } from '@src/types';

export class DeepseekAPI implements ChatAPI {
  private client: OpenAI | null = null;
  private readonly model = 'deepseek-coder';

  private async getClient(): Promise<OpenAI> {
    if (!this.client) {
      const apiKey = await getStoredApiKey('deepseek');
      if (!apiKey) {
        throw new Error('No API key found for Deepseek');
      }

      this.client = new OpenAI({
        apiKey,
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
          content: 'You are a helpful assistant. You have access to the current page content and title to provide context-aware responses.',
        },
      ];

      if (context.pageTitle || context.pageContent) {
        apiMessages.push({
          role: 'system',
          content: `Current page title: ${context.pageTitle || 'N/A'}\nPage content: ${
            context.pageContent || 'N/A'
          }`,
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
