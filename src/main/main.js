const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { createTray } = require('./tray');
const { setupScheduler, showDailyVerse, fetchVerse, searchVerse } = require('./scheduler');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 620,
    height: 700,
    minWidth: 500,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hiddenInset',
    resizable: true,
    show: false,
    icon: path.join(__dirname, '../../assets/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function showWindow() {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
}

app.whenReady().then(() => {
  createWindow();
  tray = createTray(showWindow);
  setupScheduler();

  if (Notification.isSupported()) {
    new Notification({
      title: '📖 Welcome to RHEMA Daily!',
      body: 'Your daily verse will appear at 8:00 AM.',
    }).show();
  }
});

ipcMain.handle('get-verse', async (event, version = 'en-kjv') => {
  return await fetchVerse(version);
});

ipcMain.handle('search-verse', async (event, query, version = 'en-kjv') => {
  return await searchVerse(query, version);
});

ipcMain.handle('save-settings', async (event, settings) => {
  // Handle auto-launch
  app.setLoginItemSettings({
    openAtLogin: settings.autoLaunch || false,
    name: 'RHEMA Daily'
  });

  // Update scheduler time if changed
  if (settings.notifTime) {
    const [hour, minute] = settings.notifTime.split(':').map(Number);
    setupScheduler(hour, minute, settings.notifEnabled);
  }

  return { success: true };
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
  else showWindow();
});

app.on('before-quit', () => {
  app.isQuitting = true;
});
