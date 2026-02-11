const { ipcRenderer, clipboard } = require('electron');

const verseText = document.getElementById('verseText');
const verseRef = document.getElementById('verseRef');
const getVerseBtn = document.getElementById('getVerseBtn');
const copyBtn = document.getElementById('copyBtn');
const versionSelect = document.getElementById('versionSelect');

let currentVerse = null;

getVerseBtn.addEventListener('click', async () => {
  getVerseBtn.textContent = '✨ Loading...';
  getVerseBtn.disabled = true;
  verseText.style.opacity = '0.5';

  try {
    const version = versionSelect.value;
    currentVerse = await ipcRenderer.invoke('get-verse', version);
    verseText.textContent = `"${currentVerse.text}"`;
    verseRef.textContent = `— ${currentVerse.reference}`;
    verseText.style.opacity = '1';
    copyBtn.style.display = 'inline-block';
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
