// Variables
let currentVideo;
let ytpControls, ytpPlayer;
let currentVideoBookmark = [];

/// ######   FUNCTION #//
//seconds TO minutes
const getTime = (seconds) => {
  let date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};
//new Template
const newTemplate = function () {
  //create template
  const template = document.createElement("div");
  template.classList.add("value");
  template.innerHTML =
    `<svg xmlns="http://www.w3.org/2000/svg" onclick="func()" width="35px" height="35px"  id ="bookmark-btn" class="ionicon" viewBox="0 0 512 512"><path d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>`.trim();

  return template;
};

// fetching all the bookmark vido
const fetchBookMark = () => {
  chrome.storage.sync.get(currentVideo, (data) => {
    currentVideoBookmark = data[currentVideo]
      ? JSON.parse(data[currentVideo])
      : [];
  });
};
// Handler Function
const addBookmark = () => {
  const currentTime = ytpPlayer.currentTime;
  const newBookMark = {
    time: currentTime,
    desc: "Bookmark at " + getTime(currentTime),
  };

  // setting into the chrome storage synchronasially
  chrome.storage.sync.set({
    [currentVideo]: JSON.stringify(
      [...currentVideoBookmark, newBookMark].sort((a, b) => a.time - b.time)
    ),
  });
  chrome.storage.sync.get(null, function (result) {
    console.log(result);
  });
  //adding into  a currentVideoBookmark
  fetchBookMark();
};

//newVideo loaded
const newVideoLoaded = function () {
  //Taking all the svg
  const bookMark = document.querySelectorAll(".ionicon")[0];
  fetchBookMark();

  if (!bookMark) {
    const el = newTemplate();
    // setting all the right controls
    ytpControls = document.querySelectorAll(".ytp-left-controls")[0];
    //youtube video player
    ytpPlayer = document.querySelectorAll(".video-stream")[0];
    //embedded the chilld elment
    ytpControls.append(el);
    //Click event
    const bookMarkEl = document.querySelector(".value");
    bookMarkEl.addEventListener("click", addBookmark);
  }
};

// newVideoLoaded();

// receiving the message
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "NEW") {
    currentVideo = request.videoId;
    newVideoLoaded();
  } else if (request.type === "PLAY") {
    console.log(request.type);
    ytpPlayer.currentTime = request.value;
  } else if (request.type === "DELETE") {
    currentVideoBookmark = currentVideoBookmark.filter(
      (b) => b.time != request.value
    );
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(currentVideoBookmark),
    });

    // sendResponse(currentVideoBookmark);
  }
});

newVideoLoaded();
