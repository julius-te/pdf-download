function addUrl(tabId: number, url: string): void {
  chrome.storage.session.get(tabId.toString(), (result) => {
    const urls: Array<string> = result[tabId] ?? [];
    if (!urls.includes(url)) {
      urls.push(url);
      chrome.storage.session.set({ [tabId]: urls });
      chrome.runtime.sendMessage({
        type: "update-urls",
        tabId,
        urls: urls,
      });
    }
  });
}

function clear(tabId: number): void {
  chrome.storage.session.remove(tabId.toString());
  chrome.runtime.sendMessage({
    type: "update-urls",
    tabId,
    urls: [],
  });
}

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId !== undefined && tabId !== chrome.tabs.TAB_ID_NONE) {
    clear(tabId);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "loading" &&
    changeInfo.url === undefined &&
    tabId !== undefined &&
    tabId !== chrome.tabs.TAB_ID_NONE
  ) {
    clear(tabId);
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "get-urls") {
    chrome.storage.session.get(message.tabId.toString(), (result) => {
      const urls: Array<string> = result[message.tabId] ?? [];
      chrome.runtime.sendMessage({
        type: "update-urls",
        tabId: message.tabId,
        urls: urls,
      });
    });
  }
});

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    const tabId = details.tabId;
    if (tabId !== undefined && tabId !== chrome.tabs.TAB_ID_NONE) {
      const resource = details.url.split("?")[0];
      if (resource.endsWith(".pdf") || resource.endsWith(".PDF")) {
        addUrl(tabId, details.url);
      }
    }
  },
  {
    urls: ["<all_urls>"],
    types: ["xmlhttprequest"],
  }
);
