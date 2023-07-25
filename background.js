chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const query = tab.url.split("?")[1];
    const queryObject = new URLSearchParams(query);

    chrome.tabs.sendMessage(
      tabId,
      {
        type: "NEW",
        videoId: queryObject.get("v"),
        tittle: tab.tittle,
      },
      (responce) => {
        console.log(responce);
      }
    );
  }
});
