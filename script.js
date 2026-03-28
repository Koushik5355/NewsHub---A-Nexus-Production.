// 🔗 Backend API
const API_URL = "http://127.0.0.1:5000/api/news";

let allNews = [];

// 🚀 Load default category
window.onload = () => {
  loadCategory("general");
};

// 🔥 Fetch default news (not used now, but kept if needed)
function fetchNews() {
  showStatus("Loading news...");

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allNews = data;
      displayNews(data);
      updateTicker(data);
      hideStatus();
    })
    .catch(err => {
      showStatus("Error loading news ❌");
      console.error(err);
    });
}

// 📰 Display news cards
function displayNews(newsList) {
    const container = document.getElementById("news-container");
    container.innerHTML = "";
  
    newsList.forEach(item => {
      const card = document.createElement("div");
      card.className = "news-card";
  
      card.innerHTML = `
        ${item.image ? `<img src="${item.image}" class="news-img">` : ""}
        
        <a href="${item.url}" target="_blank" class="headline">
          ${item.headline}
        </a>
        
        <p class="source">${item.source}</p>
      `;
  
      container.appendChild(card);
    });
  }

// 📂 Load category (MAIN FIXED FUNCTION)
function loadCategory(category) {
  showStatus("Loading...");

  fetch(`http://127.0.0.1:5000/api/news?category=${category}`)
    .then(res => res.json())
    .then(data => {
      allNews = data;
      displayNews(data);
      updateTicker(data);
      hideStatus();

      // 🔥 Highlight active tab
      document.querySelectorAll(".nav-item").forEach(el =>
        el.classList.remove("active")
      );

      document
        .querySelector(`[data-category="${category}"]`)
        .classList.add("active");
    })
    .catch(err => {
      showStatus("Error loading news ❌");
      console.error(err);
    });
}

// 📡 Ticker update
function updateTicker(newsList) {
  const ticker = document.getElementById("tickerTrack");

  let text = newsList
    .slice(0, 5)
    .map(n => n.headline)
    .join(" • ");

  ticker.innerHTML = `<span>${text}</span>`;
}

// ⚠️ Status messages
function showStatus(msg) {
  const status = document.getElementById("statusMessage");
  status.classList.remove("hidden");
  status.innerText = msg;
}

function hideStatus() {
  const status = document.getElementById("statusMessage");
  status.classList.add("hidden");
}

// 🍔 Mobile menu
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

// ⬇️ Load more (basic placeholder)
function loadMore() {
  displayNews(allNews);
}