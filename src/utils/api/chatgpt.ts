import OpenAI from 'openai';
import type { ChatAPI, ChatMessage, ChatContext, ChatOptions, ChatResponse } from '@src/types';

export class ChatGPTAPI implements ChatAPI {
  private readonly model = 'gpt-3.5-turbo';

  async sendMessage(
    content: string,
    messages: ChatMessage[] = [],
    context: ChatContext = {},
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    try {
      const client = new OpenAI();

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
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}
