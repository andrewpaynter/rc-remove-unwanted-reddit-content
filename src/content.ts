console.log('content script running');

let keywords: string[] = [];

// Load keywords from storage
chrome.storage.sync.get({ keywords: [] }, (data) => {
  keywords = data.keywords;
});

// Listen for keyword updates
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_KEYWORDS") {
    keywords = message.keywords;
    console.log("Updated keywords:", keywords);
    sendResponse({ success: true });
  }
  if (message?.type === "PING_FROM_POPUP") {
    sendResponse({ pong: true, url: location.href });
  }
});

const processed = new WeakSet<HTMLElement>();

const scanPosts = () => {
  document.querySelectorAll('shreddit-post').forEach(post => {
    if(post instanceof HTMLElement) {
      if (processed.has(post)) return; // skip already processed
      processed.add(post);

      const text = (post.shadowRoot instanceof HTMLElement) ? post.shadowRoot.innerText : post.innerText;
      if (text.includes("Trump")) {
        const permalink = post.getAttribute('permalink');
        console.log("Deleted www.reddit.com" + permalink);
        post.remove();
      }
    }
  });
};

// Run initially
scanPosts();

// Re-run every 500ms
setInterval(scanPosts, 500);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'PING_FROM_POPUP') {
    sendResponse({ pong: true, url: location.href });
  }
});