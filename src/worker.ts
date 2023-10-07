// we are using MV3 in Chrome but MV2 in Firefox
chrome.action ??= chrome.browserAction as any;

function addUrl(tabId: number, url: string): void {
  chrome.storage.session.get(tabId.toString(), (result) => {
    const urls: Array<string> = result[tabId] ?? [];
    if (!urls.includes(url)) {
      urls.push(url);

      // update storage
      chrome.storage.session.set({ [tabId]: urls });

      // update popup
      chrome.runtime.sendMessage({
        type: "update-urls",
        tabId,
        urls: urls,
      });

      // update badge
      chrome.action.setBadgeText({
        text: urls.length.toString(),
        tabId: tabId,
      });
    }
  });
}

function clear(tabId: number): void {
  // update storage
  chrome.storage.session.remove(tabId.toString());

  // update popup
  chrome.runtime.sendMessage({
    type: "update-urls",
    tabId,
    urls: [],
  });

  // update badge
  chrome.action.setBadgeText({
    text: "",
    tabId: tabId,
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
      addUrl(tabId, details.url);
    }
  },
  {
    urls: ["*://*/*.pdf", "*://*/*.PDF", "*://*/*.pdf?*", "*://*/*.PDF?*"],
    types: ["xmlhttprequest"],
  }
);
