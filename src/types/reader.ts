export interface PageContent {
  title: string
  content: string
  url: string
}

export interface ReaderOptions {
  excludeSelectors?: string[]
  includeSelectors?: string[]
  maxLength?: number
}

export interface ExtractResult {
  success: boolean
  content?: PageContent
  error?: string
}

export type Reader = (tab: chrome.tabs.Tab, options?: ReaderOptions) => Promise<ExtractResult>
