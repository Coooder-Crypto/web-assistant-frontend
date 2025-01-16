chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error))

chrome.runtime.onMessage.addListener((sendResponse) => {
  sendResponse({ status: 'ok' })
})
