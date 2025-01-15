import React, { useState } from 'react';
import { Box, IconButton, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  loading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  loading
}) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent, isSummary: boolean = false) => {
    e.preventDefault();
    if (loading) return;
    
    const message = isSummary ? "概括这个页面" : input.trim();
    if (message) {
      onSubmit(message);
      if (!isSummary) {
        setInput('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => handleSubmit(e)}
      sx={{
        display: 'flex',
        gap: 1,
        p: 1,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type your message..."
        disabled={loading}
        style={{
          flex: 1,
          padding: '6px 10px',
          borderRadius: '6px',
          border: `1px solid ${isFocused ? '#1976d2' : '#ddd'}`,
          resize: 'none',
          fontFamily: 'inherit',
          fontSize: '0.75rem',
          lineHeight: '1.5',
          outline: 'none',
          minHeight: '32px',
          maxHeight: '120px',
          transition: 'all 0.2s ease',
          WebkitAppearance: 'none',
          boxShadow: isFocused ? '0 0 0 1px #1976d2' : 'none',
        }}
      />
      <Stack spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
        <IconButton 
          onClick={(e) => handleSubmit(e, true)}
          disabled={loading}
          color="primary"
          size="small"
          title="Summarize page"
          sx={{ padding: '4px' }}
        >
          <AutoFixHighIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
        <IconButton 
          type="submit" 
          disabled={!input.trim() || loading}
          color="primary"
          size="small"
          sx={{ padding: '4px' }}
        >
          <SendIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Stack>
    </Box>
  );
};
