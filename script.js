const USER = "YOUR_USERNAME";
const REPO = "YOUR_REPO";
const FOLDER = "games";

const featuredList = [
  // add filenames here if you want featured
  // "cool-racing.html"
];

const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let allGames = [];

async function loadGames() {
  const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${FOLDER}`;
  const res = await fetch(url);
  const files = await res.json();

  allGames = files
    .filter(file => file.name.endsWith(".html"))
    .map(file => {
      const name = file.name
        .replace(".html", "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

      return {
        name,
        file: `${FOLDER}/${file.name}`,
        image: `images/${file.name.replace(".html", ".png")}`,
        featured: featuredList.includes(file.name)
      };
    });

  renderFeatured();
  renderPage();
  renderPagination();
}

function createCard(game) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${game.image}" onerror="this.src='images/default.png'">
    <p>${game.name}</p>
  `;

  card.onclick = () => {
    window.location.href = game.file;
  };

  return card;
}

function renderFeatured() {
  const container = document.getElementById("featured");
  container.innerHTML = "";

  allGames
    .filter(g => g.featured)
    .forEach(game => {
      container.appendChild(createCard(game));
    });
}

function renderPage() {
  const container = document.getElementById("games");
  container.innerHTML = "";

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageGames = allGames.slice(start, start + ITEMS_PER_PAGE);

  pageGames.forEach(game => {
    container.appendChild(createCard(game));
  });
}

function renderPagination() {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  const totalPages = Math.ceil(allGames.length / ITEMS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      currentPage = i;
      renderPage();
      renderPagination();
    };

    container.appendChild(btn);
  }
}

loadGames();