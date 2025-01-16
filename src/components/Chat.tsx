import { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import { ApiSettings } from "@src/types";
import {
  getSelectedSetting,
  getApiSettings,
  setSelectedSetting,
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
  const [settings, setSettings] = useState<ApiSettings[]>([]);
  const [setting, setSetting] = useState<ApiSettings | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    pageTitle,
    pageContent,
    error: contentError,
    fetchContent,
    isLoading,
  } = useContent();
  const {
    messages,
    isSending,
    error: messageError,
    sendMessage,
    clearMessages,
  } = useMessage();
  const { setError, setSuccess } = useApp();

  const setGlobalError = useCallback(
    (error: any) => {
      setError(error);
    },
    [setError]
  );

  const setGlobalSuccess = useCallback(
    (message: string | null) => {
      setSuccess(message);
    },
    [setSuccess]
  );

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

        setSettings(settings);
        setSetting(currentSetting || settings[0]);
      } catch (error) {
        console.error("Failed to load initial state:", error);
        setGlobalError(error);
      }
    };

    loadInitialState();
  }, [setGlobalError]);

  const handleSendMessage = async (content: string) => {
    if (!setting) return;

    await sendMessage(content, {
      provider: setting.provider,
      pageTitle,
      pageContent,
    });
  };

  const handleProviderChange = async (settingName: string) => {
    try {
      const newSetting = settings.find((s) => s.name === settingName);
      if (!newSetting) {
        throw new Error("Selected setting not found");
      }

      setSetting(newSetting);
      await setSelectedSetting(newSetting);

      setGlobalSuccess(`Successfully switched to ${newSetting.name}`);
    } catch (error) {
      setGlobalError(error);
    }
  };

  const onSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleRefresh = () => {
    fetchContent()
      .then(() => {
        setGlobalSuccess("Page content refreshed");
      })
      .catch((error) => {
        setGlobalError(error);
      });
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
          providers={settings}
          selectedProvider={setting?.name || ""}
          onProviderChange={handleProviderChange}
          onClear={clearMessages}
          onRefresh={handleRefresh}
          disabled={messages.length === 0}
          loading={isLoading || isSending}
        />
        <ChatInput onSend={handleSendMessage} disabled={isSending} />
      </Box>

      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
    </Box>
  );
}
