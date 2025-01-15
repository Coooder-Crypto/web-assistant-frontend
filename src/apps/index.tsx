import { Chat } from "@src/components/Chat";
import { Settings } from "@src/components/Settings";
import { Toast } from "@src/components/Toast";
import { Header } from "@src/components/Header";
import { useApp } from "@src/store/AppContext";
import { useEffect, useState } from "react";
import { reader } from "@src/utils/reader";
import { Box, Container, Alert, Snackbar } from "@mui/material";

export default function WebAssistant() {
  const [showSettings, setShowSettings] = useState(false);
  const [pageContent, setPageContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { error, setError, success, setSuccess } = useApp();

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0 || !tabs[0].id) {
        throw new Error('No active tab found');
      }
      
      const result = await reader(tabs[0]);
      if (result.success && result.content) {
        setPageTitle(result.content.title);
        setPageContent(result.content.content);
        setSuccess('Content updated successfully');
      } else {
        setError(result.error || 'Failed to get page content. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setError(error instanceof Error ? error.message : 'Failed to get page content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: 'background.default'
      }}
    >
      <Header 
        pageTitle={pageTitle}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={3000} 
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Box sx={{ 
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {showSettings ? (
          <Settings 
            onSaved={() => setShowSettings(false)}
            onClose={() => setShowSettings(false)}
          />
        ) : (
          <Chat
            pageContent={pageContent}
            pageTitle={pageTitle}
            isLoading={isLoading}
            onRefresh={fetchContent}
          />
        )}
      </Box>
    </Box>
  );
}
