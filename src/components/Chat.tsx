import { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import { ApiProvider } from "@src/types";
import {
  getSelectedProvider,
  setSelectedProvider,
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
  const [currentApiName, setCurrentApiName] = useState<string>("");
  const [providers, setProviders] = useState<
    { name: string; provider: ApiProvider; model?: string }[]
  >([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { setError, setSuccess } = useApp();

  const setGlobalError = useCallback((error: string | null ) => {
    setError(error);
  }, [setError]);

  const setGlobalSuccess = useCallback((message: string | null) => {
    setSuccess(message);
  }, [setSuccess]);

  const {
    pageTitle,
    pageContent,
    isLoading: isLoadingContent,
    error: contentError,
    success: contentSuccess,
    fetchContent,
  } = useContent();

  const {
    messages,
    isSending,
    error: messageError,
    sendMessage,
    clearMessages,
    loadMessages,
  } = useMessage();


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
    if (contentSuccess) {
      setGlobalSuccess(contentSuccess);
    }
  }, [contentSuccess, setGlobalSuccess]);

  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [savedProvider, apiSettings] = await Promise.all([
          getSelectedProvider(),
          getApiSettings(),
        ]);

        const providerOptions = apiSettings.map((setting) => ({
          name: setting.name,
          provider: setting.provider,
          model: setting.model,
        }));

        if (providerOptions.length === 0) {
          throw new Error(
            "No API providers configured. Please check your settings."
          );
        }

        setProviders(providerOptions);

        if (savedProvider) {
          const savedSetting = apiSettings.find(
            (s) => s.provider === savedProvider
          );
          if (savedSetting) {
            setCurrentApiName(savedSetting.name);
          } else {
            setCurrentApiName(providerOptions[0].name);
            await setSelectedProvider(providerOptions[0].provider);
          }
        } else {
          setCurrentApiName(providerOptions[0].name);
          await setSelectedProvider(providerOptions[0].provider);
        }
      } catch (error) {
        console.error("Failed to load initial state:", error);
       // setGlobalError(error);
      }
    };

    loadInitialState();
  }, [setGlobalError]);

  // useEffect(() => {
  //   if (currentApiName) {
  //     loadMessages().catch(error => {
  //       console.error('Failed to load messages:', error);
  //       setGlobalError(handleError(error));
  //     });
  //   }
  // }, [currentApiName, loadMessages, setGlobalError]);

  const handleSendMessage = async (content: string) => {
    const currentProvider = providers.find(
      (p) => p.name === currentApiName
    )?.provider;
    if (!currentProvider) return;

    await sendMessage(content, {
      provider: currentProvider,
      pageContent,
      maxMessages: 10,
    });
  };

  const handleProviderChange = async (providerName: string) => {
    try {
      const selectedProvider = providers.find((p) => p.name === providerName);
      if (!selectedProvider) {
        throw new Error("Selected provider not found");
      }

      await setSelectedProvider(selectedProvider.provider);
      setCurrentApiName(providerName);
      setGlobalSuccess(`Successfully switched to ${providerName}`);

      await clearMessages();
    } catch (error) {
    //  setGlobalError(error);
    }
  };

  // Handle settings saved
  const handleSettingsSaved = async () => {
    try {
      const [savedProvider, apiSettings] = await Promise.all([
        getSelectedProvider(),
        getApiSettings(),
      ]);

      const providerOptions = apiSettings.map((setting) => ({
        name: setting.name,
        provider: setting.provider,
        model: setting.model,
      }));

      setProviders(providerOptions);
      setIsSettingsOpen(false);
      setGlobalSuccess("Settings saved successfully");

      // Update current provider if needed
      if (savedProvider) {
        const savedSetting = apiSettings.find(
          (s) => s.provider === savedProvider
        );
        if (savedSetting) {
          setCurrentApiName(savedSetting.name);
        }
      }
    } catch (error) {
     // setGlobalError(error);
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
          providers={providers}
          selectedProvider={currentApiName}
          onProviderChange={handleProviderChange}
          onClear={() => clearMessages()}
          onRefresh={fetchContent}
          disabled={messages.length === 0}
          loading={isLoadingContent || isSending}
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
