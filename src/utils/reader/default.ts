import type { Reader } from '@src/types'

export const defaultReader: Reader = async (tab: chrome.tabs.Tab) => {
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
          const article = document.querySelector('article, main')
          if (article) {
            content = article.textContent || ''
          }

          if (!content.trim()) {
            const contentElements = document.querySelectorAll('.content, #content, .article, #article')
            for (const element of contentElements) {
              content = element.textContent || ''
              if (content.trim())
                break
            }

            if (!content.trim() && document.body) {
              content = document.body.textContent || ''
            }
          }

          content = cleanText(content)
          const maxLength = 4000
          if (content.length > maxLength) {
            content = `${content.substring(0, maxLength)}...`
          }

          return {
            title: cleanText(title),
            content,
            url: window.location.href,
          }
        }
        catch (e) {
          console.error('Error extracting content:', e)
          return null
        }
      },
    })

    if (!result?.[0]?.result) {
      return {
        success: false,
        error: 'Failed to extract content from page',
      }
    }

    return {
      success: true,
      content: result[0].result,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
