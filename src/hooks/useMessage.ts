import { useState, useEffect } from 'react';
import { ChatMessage, ApiProvider } from '@src/types';
import { apiManager } from '../utils/api/index';
import { handleError } from '../store/AppContext';

export interface MessageState {
    messages: ChatMessage[];
    isSending: boolean;
    error: string | null;
}

interface SendMessageOptions {
    provider: ApiProvider;
    pageTitle?: string;
    pageContent?: string;
    maxMessages?: number;
}

export function useMessage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (content: string, options: SendMessageOptions) => {
        if (!content.trim() || isSending) return;

        if (!options.provider) {
            setError('Please select an API provider');
            return;
        }

        const newMessage: ChatMessage = { role: 'user', content };
        setMessages(prev => [...prev, newMessage]);
        setIsSending(true);

        try {
            const response = await apiManager.sendMessage(
                options.provider,
                content,
                messages.slice(-(options.maxMessages || 10)),
                { 
                    pageTitle: options.pageTitle,
                    pageContent: options.pageContent 
                }
            );

            setMessages(prev => [...prev, { role: 'assistant', content: response.message.content }]);
            setError(null);
        } catch (error) {
            console.error('Failed to send message:', error);
            setError(handleError(error));
        } finally {
            setIsSending(false);
        }
    };

    const clearMessages = () => {
        setMessages([]);
        localStorage.removeItem('chatHistory');
    };

    const loadMessages = () => {
        try {
            const savedMessages = localStorage.getItem('chatHistory');
            if (savedMessages) {
                const parsed = JSON.parse(savedMessages);
                setMessages(parsed);
            }
        } catch (e) {
            console.error('Failed to parse saved messages:', e);
            localStorage.removeItem('chatHistory');
        }
    };

    // Save messages to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }, [messages]);

    return {
        messages,
        isSending,
        error,
        sendMessage,
        clearMessages,
        loadMessages,
    };
}