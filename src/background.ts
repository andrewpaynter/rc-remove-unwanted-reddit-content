console.log('RC: background service worker loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.storage.local.set({ keywords: ["Trump"] }, () => {
    if (chrome.runtime.lastError) {
      console.error("Storage error:", chrome.runtime.lastError);
    }
  });
});