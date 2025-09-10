console.log('RC: content script running');

let keywords: string[] = [];

// Load keywords from storage
chrome.storage.local.get({ keywords: [] }, (data) => {
  keywords = data.keywords;
});
console.log(keywords);
const processed = new WeakSet<HTMLElement>();

const scanPosts = (fromScratch: boolean = false) => {
  document.querySelectorAll('shreddit-post').forEach(post => {
    if(post instanceof HTMLElement) {
      if (!fromScratch && processed.has(post)) return; // skip already processed
      processed.add(post);

      const text = (post.shadowRoot instanceof HTMLElement) ? post.shadowRoot.innerText : post.innerText;
      if (keywords.some(key => text.includes(key))) {
        const permalink = post.getAttribute('permalink');
        console.log("RC: Deleted www.reddit.com" + permalink);
        post.remove();
      }
    }
  });
};

// Run initially
scanPosts();

// Re-run every 500ms
setInterval(scanPosts, 500);
// Listen for keyword updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_KEYWORDS") {
    keywords = message.keywords;
    console.log("Updated keywords:", keywords);
    sendResponse({ success: true });
    scanPosts(true);
  }
  if (message?.type === "PING_FROM_POPUP") {
    sendResponse({ pong: true, url: location.href });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'PING_FROM_POPUP') {
    sendResponse({ pong: true, url: location.href });
  }
});