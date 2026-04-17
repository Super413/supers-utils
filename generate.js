const fs = require("fs");

const gamesDir = "./games";

const files = fs.readdirSync(gamesDir);

const games = files
  .filter(file => file.endsWith(".html"))
  .map(file => {
    const cleanName = file
      .replace(".html", "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    return {
      name: cleanName,
      file: `games/${file}`,
      image: `images/${file.replace(".html", ".png")}`,
      featured: false
    };
  });

fs.writeFileSync("games.json", JSON.stringify(games, null, 2));

console.log("games.json generated!");