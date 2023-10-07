const list = document.querySelector("#pdfs") as HTMLUListElement;

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length >= 1) {
    const tabId = tabs[0].id;
    if (tabId !== undefined && tabId !== chrome.tabs.TAB_ID_NONE) {
      chrome.runtime.sendMessage({
        type: "get-urls",
        tabId: tabId,
      });

      chrome.runtime.onMessage.addListener((message) => {
        if (
          message.type === "update-urls" &&
          message.tabId === tabId &&
          message.urls.length > 0
        ) {
          list.innerHTML = "";
          message.urls.forEach((url: string) => {
            const filename = url.split("?")[0].split("/").pop() as string;
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.setAttribute("href", url);
            a.setAttribute("target", "_blank");
            a.innerText = decodeURI(filename);
            li.appendChild(a);
            list.appendChild(li);
          });
        }
      });
    }
  }
});
