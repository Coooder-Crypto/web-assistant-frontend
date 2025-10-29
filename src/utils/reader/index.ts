import type { ExtractResult } from '@src/types'
import { defaultReader } from './default'

// TODO：not full support github

// const readers: [string, Reader][] = [
//   ['github.com', githubReader],
// ]

export async function reader(tab: chrome.tabs.Tab): Promise<ExtractResult> {
  if (!tab?.url) {
    return {
      success: false,
      error: 'No tab URL provided',
    }
  }

  // const matchedReader = readers.find(([pattern]) => tab.url?.includes(pattern))
  const readPage = defaultReader

  return await readPage(tab)
}
