import { useState, useEffect } from 'react';
import { reader } from '../utils/reader';

declare global {
    interface Window {
        chrome: typeof chrome;
    }
}


export function useContent() {
    const [pageTitle, setPageTitle] = useState<string>('');
    const [pageContent, setPageContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchContent = async () => {
        setIsLoading(true);
        try {
            const tabs = await window.chrome.tabs.query({ active: true, currentWindow: true });
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

        const handleTabChange = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
            if (changeInfo.status === 'complete') {
                fetchContent();
            }
        };

        const handleTabActivated = () => {
            fetchContent();
        };

        window.chrome.tabs.onActivated.addListener(handleTabActivated);
        window.chrome.tabs.onUpdated.addListener(handleTabChange);

        return () => {
            window.chrome.tabs.onActivated.removeListener(handleTabActivated);
            window.chrome.tabs.onUpdated.removeListener(handleTabChange);
        };
    }, []);

    return {
        pageTitle,
        pageContent,
        isLoading,
        error,
        success,
        fetchContent,
        setPageTitle,
        setPageContent,
        setError,
        setSuccess,
    };
}