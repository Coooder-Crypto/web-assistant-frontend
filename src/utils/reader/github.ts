import type { Reader } from '@src/types'

export const githubReader: Reader = async (tab: chrome.tabs.Tab) => {
  if (!tab.id)
    return { success: false, error: 'No tab ID' }

  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const cleanText = (text: string): string => {
          return text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim()
        }

        const title = document.title || ''

        let content = ''

        try {
          const readme = document.querySelector('#readme')
          if (readme) {
            content = readme.textContent || ''
          }

          if (!content.trim()) {
            const fileContent = document.querySelector('.blob-wrapper, .Box-body')
            if (fileContent) {
              content = fileContent.textContent || ''
            }
          }

          if (!content.trim()) {
            const issueContent = document.querySelector('.js-comment-container')
            if (issueContent) {
              content = issueContent.textContent || ''
            }
          }

          if (!content.trim() && document.body) {
            content = document.body.textContent || ''
          }

          content = cleanText(content)
          const maxLength = 4000
          if (content.length > maxLength) {
            content = `${content.substring(0, maxLength)}...`
          }

          return {
            success: true,
            content: content.trim()
              ? {
                  title: cleanText(title),
                  content: content.trim(),
                  url: window.location.href,
                }
              : undefined,
          }
        }
        catch (e) {
          console.error('Error extracting content:', e)
          return {
            success: false,
            error: 'Error extracting content',
          }
        }
      },
    })

    const scriptResult = result[0].result
    if (!scriptResult.success) {
      return {
        success: false,
        error: scriptResult.error,
      }
    }
    return {
      success: true,
      content: scriptResult.content,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
