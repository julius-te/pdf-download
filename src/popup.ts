const contentElement = document.querySelector(
  "#content"
) as HTMLParagraphElement;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "incoming") {
    contentElement.innerHTML += message.url + "<br>";
  }
});
