import { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import { ApiSettings } from "@src/types";
import {
  getSelectedSetting,
  getApiSettings,
} from "../utils/storage";
import { ChatInput } from "./ChatInput";
import { ToolBar } from "./ToolBar";
import ChatBoard from "./ChatBoard";
import { Header } from "./Header";
import { useContent } from "../hooks/useContent";
import { useMessage } from "../hooks/useMessage";
import Settings from "./Settings";
import { useApp } from "@src/store/AppContext";

export default function Chat() {
  const [apiSettings, setApiSettings] = useState<ApiSettings[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<ApiSettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { pageTitle, pageContent, error: contentError, fetchContent, isLoading } = useContent();
  const { messages, isSending, error: messageError, sendMessage, clearMessages } = useMessage();
  const { setError, setSuccess } = useApp();

  const setGlobalError = useCallback((error: any) => {
    setError(error);
  }, [setError]);

  const setGlobalSuccess = useCallback((message: string | null) => {
    setSuccess(message);
  }, [setSuccess]);

  useEffect(() => {
    if (contentError) {
      setGlobalError(contentError);
    }
  }, [contentError, setGlobalError]);

  useEffect(() => {
    if (messageError) {
      setGlobalError(messageError);
    }
  }, [messageError, setGlobalError]);

  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [currentSetting, settings] = await Promise.all([
          getSelectedSetting(),
          getApiSettings(),
        ]);

        if (settings.length === 0) {
          throw new Error(
            "No API providers configured. Please check your settings."
          );
        }

        setApiSettings(settings);
        
        if (currentSetting) {
          const settingStillExists = settings.some(
            s => s.name === currentSetting.name && s.provider === currentSetting.provider
          );
          if (settingStillExists) {
            setSelectedSetting(currentSetting);
          } else {
            const newSelected = settings[0];
            await setSelectedSetting(newSelected);
            setSelectedSetting(newSelected);
          }
        } else {
          const newSelected = settings[0];
          await setSelectedSetting(newSelected);
          setSelectedSetting(newSelected);
        }
      } catch (error) {
        console.error("Failed to load initial state:", error);
        setGlobalError(error);
      }
    };

    loadInitialState();
  }, [setGlobalError]);

  const handleSendMessage = async (content: string) => {
    if (!selectedSetting) return;

    await sendMessage(content, {
      provider: selectedSetting.provider,
      pageTitle,
      pageContent,
      maxMessages: 10,
    });
  };

  const handleProviderChange = async (settingName: string) => {
    try {
      const newSetting = apiSettings.find((s) => s.name === settingName);
      if (!newSetting) {
        throw new Error("Selected setting not found");
      }

      await setSelectedSetting(newSetting);
      setSelectedSetting(newSetting);
      setGlobalSuccess(`Successfully switched to ${newSetting.name}`);
      clearMessages();
    } catch (error) {
      setGlobalError(error);
    }
  };

  const handleSettingsSaved = async () => {
    try {
      const [currentSetting, settings] = await Promise.all([
        getSelectedSetting(),
        getApiSettings(),
      ]);

      setApiSettings(settings);
      setGlobalSuccess("Settings saved successfully");

      if (currentSetting) {
        const settingStillExists = settings.some(
          s => s.name === currentSetting.name && s.provider === currentSetting.provider
        );
        if (settingStillExists) {
          setSelectedSetting(currentSetting);
        } else {
          const newSelected = settings[0];
          await setSelectedSetting(newSelected);
          setSelectedSetting(newSelected);
        }
      }
    } catch (error) {
      setGlobalError(error);
    }
  };

  const onSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Header
        pageTitle={pageTitle || "Web Assistant"}
        onSettingsClick={onSettingsClick}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ChatBoard messages={messages} isSending={isSending} />
        <ToolBar
          providers={apiSettings}
          selectedProvider={selectedSetting?.name || ""}
          onProviderChange={handleProviderChange}
          onClear={clearMessages}
          onRefresh={fetchContent}
          disabled={messages.length === 0}
          loading={isLoading || isSending}
        />
        <ChatInput onSend={handleSendMessage} disabled={isSending} />
      </Box>

      {isSettingsOpen && (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={() => setIsSettingsOpen(false)}
          />

          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "500px",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 3,
              zIndex: 1000,
            }}
          >
            <Settings
              onSaved={handleSettingsSaved}
              onClose={() => setIsSettingsOpen(false)}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
