import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, CircularProgress, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { apiManager } from '../utils/api/index';
import { ChatMessage, ApiProvider, ChatResponse } from '@src/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useApp } from '../store/AppContext';
import { handleError } from '../store/AppContext';
import { getSelectedProvider, setSelectedProvider, getApiSettings } from '../utils/storage';
import { ChatInput } from './ChatInput';
import { ToolBar } from './ToolBar'; // Add this line

interface ChatProps {
  pageContent: string;
  pageTitle: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function Chat({ pageContent, pageTitle, isLoading, onRefresh }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [provider, setProvider] = useState<ApiProvider>('deepseek');
  const [providers, setProviders] = useState<{ label: string; value: ApiProvider }[]>([]);
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

        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            setMessages(parsed);
          } catch (e) {
            console.error('Failed to parse saved messages:', e);
            localStorage.removeItem('chatHistory');
          }
        }

        const providerOptions = apiSettings.map(setting => ({
          label: setting.name,
          value: setting.provider as ApiProvider,
        }));
        setProviders(providerOptions);

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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (input: string) => {
    if (!input.trim() || isSending) return;

    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, newMessage]);
    setIsSending(true);

    try {
      const response: ChatResponse = await apiManager.sendMessage(provider, input, messages, {
        pageContent,
        pageTitle,
      });

      setMessages(prev => [...prev, response.message]);

      if (messages.length >= MAX_MESSAGES) {
        setMessages(prev => prev.slice(-MAX_MESSAGES));
      }
    } catch (error) {
      setError(handleError(error));
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  const handleProviderChange = async (newProvider: ApiProvider) => {
    setProvider(newProvider);
    await setSelectedProvider(newProvider);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: message.role === 'user' ? 'grey.100' : 'background.paper',
              borderRadius: 2,
              maxWidth: '80%',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <Typography 
              component="div" 
              sx={{ 
                '& p': { m: 0 },
                '& pre': { 
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: 'grey.100',
                  overflowX: 'auto'
                },
                '& code': {
                  backgroundColor: 'grey.100',
                  p: 0.5,
                  borderRadius: 0.5
                }
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </Typography>
          </Paper>
        ))}
        {isSending && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box>
        <ToolBar
          providers={providers}
          selectedProvider={provider}
          onProviderChange={handleProviderChange}
          onClear={handleClearChat}
          onRefresh={onRefresh}
          disabled={messages.length === 0}
          loading={isSending || isLoading}
        />
        <ChatInput
          onSubmit={handleSend}
          loading={isSending}
        />
      </Box>
    </Box>
  );
}
