export type ApiProvider = 'deepseek' | 'openai' | 'anthropic';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatContext {
  pageContent?: string;
  pageTitle?: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  message: ChatMessage;
  error?: string;
}

export interface ApiConfig {
  apiKey: string;
  apiEndpoint?: string;
  model?: string;
}

export interface ChatAPI {
  sendMessage(
    content: string,
    messages?: ChatMessage[],
    context?: ChatContext,
    options?: ChatOptions
  ): Promise<ChatResponse>;
}
