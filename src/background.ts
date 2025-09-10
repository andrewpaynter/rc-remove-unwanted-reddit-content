console.log('RC: background service worker loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  chrome.storage.local.set({ keywords: ["Trump"] }, () => {
    if (chrome.runtime.lastError) {
      console.error("Storage error:", chrome.runtime.lastError);
    }
  });
});

function updateIcon(tabId: number, url: string | undefined) {
  const isReddit = url?.startsWith("https://www.reddit.com") || url?.startsWith("http://www.reddit.com");
  chrome.action.setIcon({
    tabId: tabId,
    path: isReddit
      ? {
        48: "icons/icon-48.png",
        128: "icons/icon-48.png"
      }
      : {
        48: "icons/icon-inactive-48.png",
        128: "icons/icon-inactive-48.png"
      }
  });
}

// Update icon when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateIcon(tabId, tab.url);
  }
});

// Update icon when switching tabs
chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    updateIcon(tabId, tab.url);
  });
});