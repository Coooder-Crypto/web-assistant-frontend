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
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper'
      }}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={loading}
        style={{
          flex: 1,
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          resize: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: '1.5',
          outline: 'none',
          minHeight: '40px',
          maxHeight: '120px',
        }}
      />
      <Stack spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <IconButton 
          onClick={(e) => handleSubmit(e, true)}
          disabled={loading}
          color="primary"
          size="small"
          title="Summarize page"
        >
          <AutoFixHighIcon />
        </IconButton>
        <IconButton 
          type="submit" 
          disabled={!input.trim() || loading}
          color="primary"
          size="small"
        >
          <SendIcon />
        </IconButton>
      </Stack>
    </Box>
  );
};
