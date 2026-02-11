const { app, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const { showDailyVerse } = require('./scheduler');

let tray = null;

function createTray(showWindow) {
  const iconPath = path.join(__dirname, '../../assets/icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

  tray = new Tray(icon);
  tray.setToolTip('RHEMA Daily Bible Verse');

  const contextMenu = Menu.buildFromTemplate([
    { label: '📖 Show Daily Verse', click: () => showDailyVerse() },
    { label: '🪟 Open App', click: () => showWindow() },
    { type: 'separator' },
    { label: '❌ Quit RHEMA', click: () => { app.isQuitting = true; app.quit(); } }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('click', () => showWindow());

  return tray;
}

module.exports = { createTray };
