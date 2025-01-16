import type { ExtractResult, Reader } from '@src/types'
import { defaultReader } from './default'
import { githubReader } from './github'

// 定义读取器映射
const readers: [string, Reader][] = [
  ['github.com', githubReader],
  // 在这里添加更多特定网站的读取器
]

// 主要的读取函数
export async function reader(tab: chrome.tabs.Tab): Promise<ExtractResult> {
  if (!tab?.url) {
    return {
      success: false,
      error: 'No tab URL provided',
    }
  }

  // 查找匹配的读取器
  const matchedReader = readers.find(([pattern]) => tab.url?.includes(pattern))
  const readPage = matchedReader ? matchedReader[1] : defaultReader

  return await readPage(tab)
}
