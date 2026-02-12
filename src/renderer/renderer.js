const { ipcRenderer, clipboard, shell } = require('electron');

// ---- Navigation ----
const navBtns = document.querySelectorAll('.nav-btn');
const pages = document.querySelectorAll('.page');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`page-${btn.dataset.page}`).classList.add('active');
    if (btn.dataset.page === 'history') renderHistory();
    if (btn.dataset.page === 'favourites') renderFavourites();
  });
});

// ---- State ----
let currentVerse = null;
let history = JSON.parse(localStorage.getItem('rhema-history') || '[]');
let favourites = JSON.parse(localStorage.getItem('rhema-favourites') || '[]');
let settings = JSON.parse(localStorage.getItem('rhema-settings') || '{}');

// ---- Apply saved settings on load ----
function applySettings() {
  if (settings.theme === 'light') {
    document.body.classList.add('light-theme');
  }
  if (settings.notifTime) {
    document.getElementById('notifTime').value = settings.notifTime;
  }
  if (settings.defaultVersion) {
    document.getElementById('versionSelect').value = settings.defaultVersion;
    document.getElementById('defaultVersion').value = settings.defaultVersion;
  }
  if (settings.autoLaunch) {
    document.getElementById('autoLaunch').checked = settings.autoLaunch;
  }
  if (settings.notifEnabled === false) {
    document.getElementById('notifEnabled').checked = false;
  }
  if (settings.theme) {
    document.getElementById('themeSelect').value = settings.theme;
  }
}

applySettings();

// ---- Home Page ----
const verseText = document.getElementById('verseText');
const verseRef = document.getElementById('verseRef');
const getVerseBtn = document.getElementById('getVerseBtn');
const copyBtn = document.getElementById('copyBtn');
const favouriteBtn = document.getElementById('favouriteBtn');
const shareBtn = document.getElementById('shareBtn');
const shareMenu = document.getElementById('shareMenu');

getVerseBtn.addEventListener('click', async () => {
  getVerseBtn.textContent = '✨ Loading...';
  getVerseBtn.disabled = true;
  verseText.style.opacity = '0.5';
  shareMenu.style.display = 'none';

  try {
    const version = document.getElementById('versionSelect').value;
    currentVerse = await ipcRenderer.invoke('get-verse', version);
    verseText.textContent = `"${currentVerse.text}"`;
    verseRef.textContent = `— ${currentVerse.reference}`;
    verseText.style.opacity = '1';
    copyBtn.style.display = 'inline-block';
    favouriteBtn.style.display = 'inline-block';
    shareBtn.style.display = 'inline-block';

    // Add to history
    addToHistory(currentVerse);
  } catch (err) {
    verseText.textContent = 'Could not load verse. Check your connection!';
    verseText.style.opacity = '1';
  }

  getVerseBtn.textContent = '📖 Get Verse';
  getVerseBtn.disabled = false;
});

copyBtn.addEventListener('click', () => {
  if (currentVerse) {
    clipboard.writeText(`"${currentVerse.text}" — ${currentVerse.reference}`);
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
  }
});

favouriteBtn.addEventListener('click', () => {
  if (currentVerse) {
    addToFavourites(currentVerse);
    favouriteBtn.textContent = '✅ Saved!';
    setTimeout(() => favouriteBtn.textContent = '🔖 Save', 2000);
  }
});

shareBtn.addEventListener('click', () => {
  shareMenu.style.display = shareMenu.style.display === 'none' ? 'flex' : 'none';
});

document.querySelectorAll('.share-option').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!currentVerse) return;
    const text = `"${currentVerse.text}" — ${currentVerse.reference}\n\nShared from RHEMA Daily`;
    const encoded = encodeURIComponent(text);

    if (btn.dataset.platform === 'twitter') {
      shell.openExternal(`https://twitter.com/intent/tweet?text=${encoded}`);
    } else if (btn.dataset.platform === 'whatsapp') {
      shell.openExternal(`https://wa.me/?text=${encoded}`);
    } else if (btn.dataset.platform === 'copy') {
      clipboard.writeText(text);
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = '📋 Copy Link', 2000);
    }

    shareMenu.style.display = 'none';
  });
});

// ---- Search Page ----
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchResult = document.getElementById('searchResult');
const searchText = document.getElementById('searchText');
const searchRef = document.getElementById('searchRef');
const chapterResults = document.getElementById('chapterResults');

let searchCurrentVerse = null;

searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  const version = document.getElementById('searchVersion').value;
  if (!query) return;

  searchBtn.textContent = '🔍 Searching...';
  searchBtn.disabled = true;
  searchResult.style.display = 'none';
  chapterResults.innerHTML = '';

  try {
    const result = await ipcRenderer.invoke('search-verse', query, version);

    if (result.type === 'verse') {
      searchCurrentVerse = result;
      searchText.textContent = `"${result.text}"`;
      searchRef.textContent = `— ${result.reference}`;
      searchResult.style.display = 'flex';
      chapterResults.innerHTML = '';
    } else if (result.type === 'chapter') {
      searchResult.style.display = 'none';
      chapterResults.innerHTML = result.verses.map(v =>
        `<div class="chapter-verse"><span>${v.verse}</span>${v.text}</div>`
      ).join('');
    }
  } catch (err) {
    searchText.textContent = 'Verse not found. Try "John 3:16" or "Genesis 1"';
    searchRef.textContent = '';
    searchResult.style.display = 'flex';
  }

  searchBtn.textContent = 'Search';
  searchBtn.disabled = false;
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchBtn.click();
});

document.getElementById('searchCopyBtn').addEventListener('click', () => {
  if (searchCurrentVerse) {
    clipboard.writeText(`"${searchCurrentVerse.text}" — ${searchCurrentVerse.reference}`);
    document.getElementById('searchCopyBtn').textContent = '✅ Copied!';
    setTimeout(() => document.getElementById('searchCopyBtn').textContent = '📋 Copy', 2000);
  }
});

document.getElementById('searchFavBtn').addEventListener('click', () => {
  if (searchCurrentVerse) {
    addToFavourites(searchCurrentVerse);
    document.getElementById('searchFavBtn').textContent = '✅ Saved!';
    setTimeout(() => document.getElementById('searchFavBtn').textContent = '🔖 Save', 2000);
  }
});

// ---- History ----
function addToHistory(verse) {
  const entry = { ...verse, date: new Date().toLocaleString() };
  history = [entry, ...history.filter(v => v.reference !== verse.reference)].slice(0, 50);
  localStorage.setItem('rhema-history', JSON.stringify(history));
}

function renderHistory() {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('historyEmpty');

  if (history.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  list.innerHTML = history.map((v, i) => `
    <div class="verse-item">
      <p class="verse-text">"${v.text}"</p>
      <p class="verse-ref">— ${v.reference}</p>
      <p class="verse-date">${v.date}</p>
      <div class="verse-item-actions">
        <button class="btn secondary small" onclick="copyVerse('${v.text.replace(/'/g, "\\'")}', '${v.reference}')">📋 Copy</button>
        <button class="btn secondary small" onclick="saveFromHistory(${i})">🔖 Save</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('clearHistory').addEventListener('click', () => {
  history = [];
  localStorage.setItem('rhema-history', '[]');
  renderHistory();
});

// ---- Favourites ----
function addToFavourites(verse) {
  if (!favourites.find(v => v.reference === verse.reference)) {
    favourites = [{ ...verse, date: new Date().toLocaleString() }, ...favourites];
    localStorage.setItem('rhema-favourites', JSON.stringify(favourites));
  }
}

function renderFavourites() {
  const list = document.getElementById('favouritesList');
  const empty = document.getElementById('favouritesEmpty');

  if (favourites.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  list.innerHTML = favourites.map((v, i) => `
    <div class="verse-item">
      <p class="verse-text">"${v.text}"</p>
      <p class="verse-ref">— ${v.reference}</p>
      <div class="verse-item-actions">
        <button class="btn secondary small" onclick="copyVerse('${v.text.replace(/'/g, "\\'")}', '${v.reference}')">📋 Copy</button>
        <button class="btn danger small" onclick="removeFavourite(${i})">🗑️ Remove</button>
      </div>
    </div>
  `).join('');
}

document.getElementById('clearFavourites').addEventListener('click', () => {
  favourites = [];
  localStorage.setItem('rhema-favourites', '[]');
  renderFavourites();
});

window.removeFavourite = (i) => {
  favourites.splice(i, 1);
  localStorage.setItem('rhema-favourites', JSON.stringify(favourites));
  renderFavourites();
};

window.saveFromHistory = (i) => {
  addToFavourites(history[i]);
};

window.copyVerse = (text, ref) => {
  clipboard.writeText(`"${text}" — ${ref}`);
};

// ---- Settings ----
document.getElementById('saveSettings').addEventListener('click', async () => {
  settings = {
    notifTime: document.getElementById('notifTime').value,
    notifEnabled: document.getElementById('notifEnabled').checked,
    theme: document.getElementById('themeSelect').value,
    autoLaunch: document.getElementById('autoLaunch').checked,
    defaultVersion: document.getElementById('defaultVersion').value
  };

  localStorage.setItem('rhema-settings', JSON.stringify(settings));

  // Apply theme immediately
  if (settings.theme === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }

  // Send settings to main process
  await ipcRenderer.invoke('save-settings', settings);

  const msg = document.getElementById('settingsSaved');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 3000);
});

document.getElementById('themeSelect').addEventListener('change', (e) => {
  if (e.target.value === 'light') {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
});
