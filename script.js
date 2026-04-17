async function loadGames() {
  const response = await fetch("games.json");
  const games = await response.json();

  const gamesContainer = document.getElementById("games");
  const featuredContainer = document.getElementById("featured");

  function createCard(game) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${game.image}" alt="${game.name}">
      <p>${game.name}</p>
    `;

    card.onclick = () => {
      window.location.href = game.file;
    };

    return card;
  }

  games.forEach(game => {
    const card = createCard(game);

    if (game.featured) {
      const featuredCard = createCard(game);
      featuredContainer.appendChild(featuredCard);
    }

    gamesContainer.appendChild(card);
  });
}

loadGames();