chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error: any) => console.error(error))

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  sendResponse({ status: 'ok' })
})
