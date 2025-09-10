console.log('background service worker loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('action clicked', tab?.id);
});