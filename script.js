const GAMES_PER_PAGE = 6; // 3 columns × 2 rows
let allGames = [];
let currentPage = 1;

function createCard(game, isFeatured = false) {
  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", game.name);

  if (isFeatured) {
    card.innerHTML += `<span class="featured-badge">★ featured</span>`;
  }

  const thumbHTML = game.image
    ? `<img class="card-thumb" src="${game.image}" alt="${game.name}" onerror="this.replaceWith(makePlaceholder())">`
    : `<div class="card-thumb-placeholder">🎮</div>`;

  card.innerHTML += `
    ${thumbHTML}
    <div class="card-body">
      <div class="card-title">${game.name}</div>
    </div>
  `;

  const navigate = () => { window.location.href = game.file; };
  card.addEventListener("click", navigate);
  card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") navigate(); });

  return card;
}

function makePlaceholder() {
  const el = document.createElement("div");
  el.className = "card-thumb-placeholder";
  el.textContent = "🎮";
  return el;
}

function renderPage(page) {
  currentPage = page;
  const gamesContainer = document.getElementById("games");
  gamesContainer.innerHTML = "";

  const start = (page - 1) * GAMES_PER_PAGE;
  const slice = allGames.slice(start, start + GAMES_PER_PAGE);

  if (slice.length === 0) {
    gamesContainer.innerHTML = `<p class="empty-state">No games found.</p>`;
  } else {
    slice.forEach(game => gamesContainer.appendChild(createCard(game)));
  }

  renderPagination();
}

function renderPagination() {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  const totalPages = Math.ceil(allGames.length / GAMES_PER_PAGE);
  if (totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.className = "page-btn";
  prev.textContent = "◀";
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", () => renderPage(currentPage - 1));
  container.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.addEventListener("click", () => renderPage(i));
    container.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "page-btn";
  next.textContent = "▶";
  next.disabled = currentPage === totalPages;
  next.addEventListener("click", () => renderPage(currentPage + 1));
  container.appendChild(next);
}

async function loadGames() {
  try {
    const response = await fetch("games.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const games = await response.json();

    allGames = games;

    // ── Featured ────────────────────────────────────────
    const featuredContainer = document.getElementById("featured");
    const featured = games.filter(g => g.featured);

    if (featured.length === 0) {
      document.getElementById("featured-section").style.display = "none";
    } else {
      featured.forEach(game => featuredContainer.appendChild(createCard(game, true)));
    }

    // ── All games (paginated) ────────────────────────────
    renderPage(1);

  } catch (err) {
    console.error("Failed to load games:", err);
    document.getElementById("games").innerHTML =
      `<p class="empty-state">⚠ Could not load games. Check that games.json exists and is valid.</p>`;
  }
}

loadGames();