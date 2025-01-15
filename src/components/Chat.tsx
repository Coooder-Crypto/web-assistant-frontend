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
import { ToolBar } from './ToolBar';

interface ChatProps {
  pageContent: string;
  pageTitle: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function Chat({ pageContent, pageTitle, isLoading, onRefresh }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [currentApiName, setCurrentApiName] = useState<string>('');
  const [providers, setProviders] = useState<{ name: string; provider: ApiProvider; model?: string }[]>([]);
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
          name: setting.name,
          provider: setting.provider,
          model: setting.model
        }));
        setProviders(providerOptions);

        if (savedProvider) {
          const savedSetting = apiSettings.find(s => s.provider === savedProvider);
          if (savedSetting) {
            setCurrentApiName(savedSetting.name);
          }
        }
      } catch (error) {
        console.error('Error loading initial state:', error);
        setError(handleError(error));
      }
    };

    loadInitialState();
  }, [setError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  const handleProviderChange = async (name: string) => {
    try {
      const setting = providers.find(p => p.name === name);
      if (setting) {
        setCurrentApiName(name);
        await setSelectedProvider(setting.provider);
      }
    } catch (error) {
      console.error('Error changing provider:', error);
      setError(handleError(error));
    }
  };

  const getCurrentProvider = () => {
    const setting = providers.find(p => p.name === currentApiName);
    return setting?.provider || 'deepseek';
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isSending) return;

    const newMessage: ChatMessage = { role: 'user', content };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setIsSending(true);

    try {
      const response = await apiManager.sendMessage(
        getCurrentProvider(),
        content,
        updatedMessages.slice(-MAX_MESSAGES),
        { pageContent, pageTitle }
      );

      if (response.error) {
        setError(response.error);
        return;
      }

      setMessages([...updatedMessages, response.message]);
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
              p: 1.5,
              backgroundColor: message.role === 'user' ? 'grey.100' : 'background.paper',
              borderRadius: 2,
              maxWidth: '80%',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <Typography 
              component="div" 
              sx={{ 
                fontSize: '0.75rem',
                '& p': { m: 0 },
                '& pre': { 
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: 'grey.100',
                  overflowX: 'auto',
                  fontSize: '0.75rem'
                },
                '& code': {
                  backgroundColor: 'grey.100',
                  p: 0.5,
                  borderRadius: 0.5,
                  fontSize: '0.75rem'
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
          selectedProvider={currentApiName}
          onProviderChange={handleProviderChange}
          onClear={handleClearChat}
          onRefresh={onRefresh}
          disabled={messages.length === 0}
          loading={isLoading || isSending}
        />
        <ChatInput
          onSubmit={handleSend}
          loading={isSending}
        />
      </Box>
    </Box>
  );
}
