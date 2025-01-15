import type { ApiProvider, ChatAPI, ChatMessage, ChatContext, ChatOptions, ChatResponse } from '@src/types/api';
import { DeepseekAPI } from './deepseek';
import { ChatGPTAPI } from './chatgpt';

export type { ApiProvider, ChatMessage, ChatContext, ChatOptions, ChatResponse };

export const API_PROVIDERS = [
  { label: 'Deepseek', value: 'deepseek' },
  { label: 'ChatGPT', value: 'openai' },

] as const;

class APIManager {
  private static instance: APIManager;
  private apis: Map<ApiProvider, ChatAPI>;

  private constructor() {
    this.apis = new Map();
  }

  public static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager();
    }
    return APIManager.instance;
  }

  private getAPI(provider: ApiProvider): ChatAPI {
    let api = this.apis.get(provider);
    
    if (!api) {
      switch (provider) {
        case 'deepseek':
          api = new DeepseekAPI();
          break;
        case 'openai':
          api = new ChatGPTAPI();
          break;
        case 'anthropic':
          throw new Error('Anthropic API not implemented yet');
        default:
          throw new Error(`Unsupported API provider: ${provider}`);
      }
      this.apis.set(provider, api);
    }
    
    return api;
  }

  public async sendMessage(
    provider: ApiProvider,
    content: string,
    messages?: ChatMessage[],
    context?: ChatContext,
    options?: ChatOptions
  ): Promise<ChatResponse> {
    const api = this.getAPI(provider);
    return api.sendMessage(content, messages, context, options);
  }
}

// Export a singleton instance
export const apiManager = APIManager.getInstance();

// Export a convenient function for sending messages
export const sendMessage = async (
  provider: ApiProvider,
  content: string,
  messages?: ChatMessage[],
  context?: ChatContext,
  options?: ChatOptions
): Promise<ChatResponse> => {
  return apiManager.sendMessage(provider, content, messages, context, options);
};
