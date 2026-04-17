var PER_PAGE = 6;
var allGames = [];
var page = 1;

function placeholder() {
  var d = document.createElement('div');
  d.className = 'thumb-placeholder';
  d.textContent = '🎮';
  return d;
}

function makeCard(game, featured) {
  var card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('tabindex', '0');

  if (featured) {
    var badge = document.createElement('span');
    badge.className = 'featured-badge';
    badge.textContent = '★ featured';
    card.appendChild(badge);
  }

  if (game.image) {
    var img = document.createElement('img');
    img.className = 'thumb';
    img.src = game.image;
    img.alt = game.name;
    img.onerror = function() { this.replaceWith(placeholder()); };
    card.appendChild(img);
  } else {
    card.appendChild(placeholder());
  }

  var body = document.createElement('div');
  body.className = 'card-body';
  var title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = game.name;
  body.appendChild(title);
  card.appendChild(body);

  var go = function() { window.location.href = game.file; };
  card.addEventListener('click', go);
  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') go();
  });
  return card;
}

function renderPage(p) {
  page = p;
  var container = document.getElementById('games');
  container.innerHTML = '';
  var slice = allGames.slice((p - 1) * PER_PAGE, p * PER_PAGE);
  if (!slice.length) {
    container.innerHTML = '<p class="empty">No games found.</p>';
  } else {
    slice.forEach(function(g) { container.appendChild(makeCard(g, false)); });
  }
  renderPager();
}

function renderPager() {
  var container = document.getElementById('pagination');
  container.innerHTML = '';
  var total = Math.ceil(allGames.length / PER_PAGE);
  if (total <= 1) return;

  function btn(label, disabled, active, onClick) {
    var b = document.createElement('button');
    b.className = 'page-btn' + (active ? ' active' : '');
    b.textContent = label;
    b.disabled = disabled;
    b.addEventListener('click', onClick);
    return b;
  }

  container.appendChild(btn('◀', page === 1, false, function() { renderPage(page - 1); }));
  for (var i = 1; i <= total; i++) {
    (function(n) {
      container.appendChild(btn(n, false, n === page, function() { renderPage(n); }));
    })(i);
  }
  container.appendChild(btn('▶', page === total, false, function() { renderPage(page + 1); }));
}

async function load() {
  try {
    var res = await fetch('games.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var games = await res.json();
    allGames = games;

    var fc = document.getElementById('featured');
    var featured = games.filter(function(g) { return g.featured; });
    if (!featured.length) {
      document.getElementById('featured-section').style.display = 'none';
    } else {
      featured.forEach(function(g) { fc.appendChild(makeCard(g, true)); });
    }
    renderPage(1);
  } catch (e) {
    console.error('Load failed:', e);
    document.getElementById('games').innerHTML =
      '<p class="empty">⚠ Could not load games. Check that games.json exists and is valid JSON.</p>';
    document.getElementById('featured-section').style.display = 'none';
  }
}

load();