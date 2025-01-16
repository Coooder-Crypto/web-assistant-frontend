import React, { useState } from "react";
import { Box, IconButton, TextField, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent, content?: string) => {
    e.preventDefault();
    const message = content || input.trim();
    if (disabled || !message) return;

    await onSend(message);
    if (!content) {
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <TextField
        fullWidth
        multiline
        rows={3}
        maxRows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={disabled}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
      <Stack
        direction="column"
        spacing={0}
        justifyContent="space-between" 
        sx={{
          height: "100%", 
        }}
      >
        <IconButton
          onClick={(e) => handleSubmit(e, "概括这个页面")}
          disabled={disabled}
          color="primary"
          size="small"
          title="Summarize page"
          sx={{
            height: "50%", 
          }}
        >
          <AutoFixHighIcon fontSize="small" />
        </IconButton>
        <IconButton
          type="submit"
          disabled={!input.trim() || disabled}
          color="primary"
          size="small"
          sx={{
            height: "50%", 
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
};
