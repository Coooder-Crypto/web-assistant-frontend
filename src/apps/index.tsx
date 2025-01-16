import Chat from "@src/components/Chat";
import { Box } from "@mui/material";

export default function WebAssistant() {

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Chat />
    </Box>
  );
}
