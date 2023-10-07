const contentElement = document.querySelector(
  "#content"
) as HTMLParagraphElement;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length >= 1) {
    const tabId = tabs[0].id;
    if (tabId !== undefined && tabId !== chrome.tabs.TAB_ID_NONE) {
      chrome.runtime.sendMessage({
        type: "get-urls",
        tabId: tabId,
      });
    }
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "update-urls") {
    if (message.urls.length === 0) {
      contentElement.textContent = "No PDFs found";
    } else {
      contentElement.innerHTML = message.urls.join("<br/>");
    }
  }
});
