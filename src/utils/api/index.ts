import type { ApiProvider, ChatAPI, ChatMessage, ChatContext, ChatOptions, ChatResponse, ApiConfig } from '@src/types/api';
import { DeepseekAPI } from './deepseek';
import { ChatGPTAPI } from './chatgpt';

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

  public getAPI(provider: ApiProvider): ChatAPI {
    let api = this.apis.get(provider);
    if (!api) {
      throw new Error('API not initialized. Please set API key first.');
    }
    return api;
  }

  public async initAPI(provider: ApiProvider, config: ApiConfig): Promise<void> {
    let api: ChatAPI;
    switch (provider) {
      case 'openai':
        api = new ChatGPTAPI(config);
        break;
      case 'deepseek':
        api = new DeepseekAPI(config);
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
    this.apis.set(provider, api);
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

export const apiManager = APIManager.getInstance();
