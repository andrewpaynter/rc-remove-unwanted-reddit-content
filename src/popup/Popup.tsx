// popup.tsx (React + Tailwind)
import { useEffect, useState } from "react";

export default function Popup() {

  const [isCorrectUrl, setIsCorrectUrl] = useState(false);

  useEffect(() => {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url?.startsWith("https://www.reddit.com")) {
        setIsCorrectUrl(true);
      } else {
        setIsCorrectUrl(false);
      }
    });
  }, []);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    chrome.storage.local.get({ keywords: [] }, (data) => {
      setKeywords(data.keywords);
    });
  }, []);

  const saveKeywords = (updated: string[]) => {
    setKeywords(updated);
    chrome.storage.local.set({ keywords: updated }, () => {
      if (chrome.runtime.lastError) {
        console.error("Storage error:", chrome.runtime.lastError);
      }
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "UPDATE_KEYWORDS",
          keywords: updated,
        });
      }
    });
  };
  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    saveKeywords([...keywords, newKeyword.trim()]);
    setNewKeyword("");
  };

  const removeKeyword = (kw: string) => {
    saveKeywords(keywords.filter((k) => k !== kw));
  };

  return (
    <div className={`p-4 ${isCorrectUrl ? "" : "opacity-50 pointer-events-none"}`}>
      <h1 className="text-lg font-bold mb-2">
        Reddit Chemo
      </h1>

      {isCorrectUrl ? (
        <div className="p-4 w-128 text-sm">
          <h1 className="text-lg font-bold mb-2">RC: Remove Unwanted Reddit Content</h1>
          <div className="mb-2 flex">
            <input
              className="flex-1 border p-1 rounded"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword"
            />
            <button
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
              onClick={addKeyword}
            >
              Add
            </button>
          </div>
          <ul>
            {keywords.map((kw) => (
              <li
                key={kw}
                className="flex justify-between items-center bg-gray-100 rounded p-1 mb-1"
              >
                <span>{kw}</span>
                <button
                  className="text-red-500 text-xs"
                  onClick={() => removeKeyword(kw)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <p className="text-red-500 mb-2">This extension only works on Reddit.</p>
        </div>
      )}
    </div>
  );

}
