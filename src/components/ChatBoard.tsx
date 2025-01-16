import { useRef, useEffect } from 'react';
import { Box, Paper, CircularProgress } from '@mui/material';
import { ChatMessage } from '@src/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatBoardProps {
  messages: ChatMessage[];
  isSending: boolean;
}

export default function ChatBoard({ messages, isSending }: ChatBoardProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {messages.map((message, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            p: 2,
            maxWidth: '80%',
            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
            color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </Paper>
      ))}
      {isSending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
}
