export type ApiProvider = 'deepseek' | 'openai' ;

export const API_PROVIDERS = [
  { label: 'Deepseek', value: 'deepseek' },
  { label: 'ChatGPT', value: 'openai' },
] as const;

export interface ApiSettings {
  name: string;
  provider: ApiProvider;
  apiKey: string;
  model?: string;
  organization?: string;
  project?: string;
}

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
  organization?: string;
  project?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  error?: string;
}

export interface ApiConfig {
  apiKey: string;
  apiEndpoint?: string;
  model?: string;
  organization?: string;
  project?: string;
}

export interface ChatAPI {
  sendMessage(
    content: string,
    messages?: ChatMessage[],
    context?: ChatContext,
    options?: ChatOptions
  ): Promise<ChatResponse>;
}
