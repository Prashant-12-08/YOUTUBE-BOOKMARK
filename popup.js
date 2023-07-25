import { getCurrentTab } from "./util.js";

///ADDING NEW BOOKMARK
const addNewBookMark = (currentVideoBookmark) => {
  const par = document.querySelector(".hello");
  const header = document.querySelector(".header-list");
  if (currentVideoBookmark.length === 0) {
    header.innerHTML = " No bookmark video 😥";
    return;
  }

  const el = document.querySelector(".list");
  currentVideoBookmark.forEach((el) => {
    par.insertAdjacentHTML(
      "beforeend",
      `<div class="list"  id="bookmark-${el.time}" data-time-number=${el.time}>
    <div class="heading-text">${el.desc}</div>
    <div class="svg-el">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon delete-btn"
        viewBox="0 0 512 512"
      >
        <path
          d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-miterlimit="10"
          stroke-width="32"
          d="M80 112h352"
        />
        <path
          d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="32"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="ionicon play-btn"
        viewBox="0 0 512 512"
      >
        <path
          d="M112 111v290c0 17.44 17 28.52 31 20.16l247.9-148.37c12.12-7.25 12.12-26.33 0-33.58L143 90.84c-14-8.36-31 2.72-31 20.16z"
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
        />
      </svg>
    </div>
  </div>`
    );
  });
};

//Play the bookMark video
const playBookmark = (tab) => {
  const playBtn = document.querySelectorAll(".play-btn");
  playBtn.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const bookmarkTime = e.target.closest(".list").dataset.timeNumber;
      const activeTab = await getCurrentTab();
      chrome.tabs.sendMessage(tab.id, {
        type: "PLAY",
        value: bookmarkTime,
      });
    });
  });
};

//delete the bookmark video
const deleteBookmark = (tab) => {
  const deleteBtn = document.querySelectorAll(".delete-btn");
  deleteBtn.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const bookmarkTime = e.target.closest(".list").dataset.timeNumber;
      const bookmark = document.getElementById("bookmark-" + bookmarkTime);
      console.log();
      const removeBookmark = e.target.closest(".hello").removeChild(bookmark);
      const activeTab = await getCurrentTab();
      chrome.tabs.sendMessage(tab.id, {
        type: "DELETE",
        value: bookmarkTime,
      });
    });
  });
};

// EVENT LISTNENER
document.addEventListener("DOMContentLoaded", async (e) => {
  const tab = await getCurrentTab();
  const query = tab.url.split("?")[1];
  const queryObject = new URLSearchParams(query);
  const currentVideo = queryObject.get("v");
  if (tab.url.includes("//www.youtube.com/watch") && currentVideo) {
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmark = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];
      addNewBookMark(currentVideoBookmark);
      playBookmark(tab);
      deleteBookmark(tab);
    });
  } else {
    const container = document.querySelector(".header-list");
    container.innerHTML = "This is not a youtube Player 😥";
  }
});
