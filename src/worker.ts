chrome.webRequest.onCompleted.addListener(
  (details) => {
    chrome.runtime.sendMessage({ type: "incoming", url: details.url });
  },
  {
    urls: ["<all_urls>"],
  }
);
