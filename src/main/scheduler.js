const { Notification } = require('electron');

// Full list of Bible books for random selection
const BOOKS = [
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
  'joshua', 'judges', 'ruth', '1-samuel', '2-samuel',
  '1-kings', '2-kings', '1-chronicles', '2-chronicles',
  'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
  'ecclesiastes', 'song-of-solomon', 'isaiah', 'jeremiah',
  'lamentations', 'ezekiel', 'daniel', 'hosea', 'joel', 'amos',
  'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah',
  'haggai', 'zechariah', 'malachi', 'matthew', 'mark', 'luke',
  'john', 'acts', 'romans', '1-corinthians', '2-corinthians',
  'galatians', 'ephesians', 'philippians', 'colossians',
  '1-thessalonians', '2-thessalonians', '1-timothy', '2-timothy',
  'titus', 'philemon', 'hebrews', 'james', '1-peter', '2-peter',
  '1-john', '2-john', '3-john', 'jude', 'revelation'
];

const CHAPTER_COUNTS = {
  'genesis': 50, 'exodus': 40, 'leviticus': 27, 'numbers': 36,
  'deuteronomy': 34, 'joshua': 24, 'judges': 21, 'ruth': 4,
  '1-samuel': 31, '2-samuel': 24, '1-kings': 22, '2-kings': 25,
  'psalms': 150, 'proverbs': 31, 'isaiah': 66, 'jeremiah': 52,
  'matthew': 28, 'mark': 16, 'luke': 24, 'john': 21,
  'acts': 28, 'romans': 16, '1-corinthians': 16, 'ephesians': 6,
  'philippians': 4, 'revelation': 22
};

function getDefaultChapterCount(book) {
  return CHAPTER_COUNTS[book] || 5;
}

async function fetchVerse(version = 'en-kjv') {
  const book = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  const maxChapter = getDefaultChapterCount(book);
  const chapter = Math.floor(Math.random() * maxChapter) + 1;

  const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${version}/books/${book}/chapters/${chapter}.json`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${book} ${chapter}`);

  const data = await res.json();
  const verses = data.data;
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];

  const bookDisplay = book.replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return {
    text: randomVerse.text,
    reference: `${bookDisplay} ${chapter}:${randomVerse.verse}`,
    book,
    chapter,
    verse: randomVerse.verse
  };
}

async function showDailyVerse() {
  try {
    const verse = await fetchVerse();

    if (Notification.isSupported()) {
      new Notification({
        title: '📖 RHEMA Daily',
        subtitle: verse.reference,
        body: verse.text,
      }).show();
    }

    return verse;
  } catch (err) {
    console.error('Failed to fetch verse:', err.message);
    return {
      text: 'For God so loved the world that he gave his one and only Son.',
      reference: 'John 3:16'
    };
  }
}

function setupScheduler() {
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 8 && now.getMinutes() === 0) {
      showDailyVerse();
    }
  }, 60 * 1000);
}

module.exports = { setupScheduler, showDailyVerse, fetchVerse };
