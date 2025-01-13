import React, { useState, useRef, useEffect } from 'react';
import { apiManager } from '../utils/api/index';
import { ChatMessage, ApiProvider } from '@src/types';
import { Selector, Option } from './common/Selector';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../store/AppContext';
import { handleError } from '../store/AppContext';
import { getSelectedProvider, setSelectedProvider, getApiSettings } from '../utils/storage';

interface ChatProps {
  pageContent: string;
  pageTitle: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function Chat({ pageContent, pageTitle, isLoading, onRefresh }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [provider, setProvider] = useState<ApiProvider>('deepseek');
  const [providers, setProviders] = useState<Option<ApiProvider>[]>([]);
  const { setError } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_MESSAGES = 10;

  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [savedMessages, savedProvider, apiSettings] = await Promise.all([
          localStorage.getItem('chatHistory'),
          getSelectedProvider(),
          getApiSettings(),
        ]);

        // 加载消息历史
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            setMessages(parsed);
          } catch (e) {
            console.error('Failed to parse saved messages:', e);
            localStorage.removeItem('chatHistory');
          }
        }

        // 加载API提供者选项
        const providerOptions = apiSettings.map(setting => ({
          label: setting.name || setting.provider,
          value: setting.provider,
        }));
        setProviders(providerOptions);

        // 设置当前选中的提供者
        if (savedProvider && apiSettings.some(s => s.provider === savedProvider)) {
          setProvider(savedProvider);
        } else if (apiSettings.length > 0) {
          setProvider(apiSettings[0].provider);
          await setSelectedProvider(apiSettings[0].provider);
        }
      } catch (error) {
        console.error('Failed to load initial state:', error);
      }
    };

    loadInitialState();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const handleProviderChange = async (newProvider: ApiProvider) => {
    setProvider(newProvider);
    await setSelectedProvider(newProvider);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    try {
      setIsSending(true);
      const userMessage: ChatMessage = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const limitedMessages = messages.slice(-MAX_MESSAGES);
      const response = await apiManager.sendMessage(
        provider,
        input,
        limitedMessages,
        {
          pageContent,
          pageTitle,
        }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }

      const assistantMessage: ChatMessage = { role: 'assistant', content: response.message.content };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setError(handleError(error));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert max-w-none"
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Provider Selector and Actions */}
        <div className="p-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          {providers.length > 0 && (
            <Selector
              options={providers}
              value={provider}
              onChange={handleProviderChange}
              label="Using:"
              className="min-w-[120px]"
            />
          )}
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Clear chat history"
              >
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh page content"
            >
              <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSending}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-primary hover:bg-primary-hover text-white rounded-md transition-colors disabled:opacity-50"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
