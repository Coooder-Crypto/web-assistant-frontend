import type { Reader, ReaderOptions } from '@src/types'

export const defaultReader: Reader = async (tab: chrome.tabs.Tab, options?: ReaderOptions) => {
  if (!tab.id)
    return { success: false, error: 'No tab ID' }

  try {
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // 清理文本内容的函数
        const cleanText = (text: string): string => {
          return text
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim()
        }

        // 获取页面标题
        const title = document.title || ''

        // 获取主要内容
        let content = ''

        try {
          // First try to get content from article or main element
          const article = document.querySelector('article, main')
          if (article) {
            content = article.textContent || ''
          }

          // If no content found in article/main, try other common content elements
          if (!content.trim()) {
            const contentElements = document.querySelectorAll('.content, #content, .article, #article')
            for (const element of contentElements) {
              content = element.textContent || ''
              if (content.trim())
                break
            }

            // If still no content, use body text
            if (!content.trim() && document.body) {
              content = document.body.innerText || ''
            }
          }

          // 清理并限制内容长度
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
