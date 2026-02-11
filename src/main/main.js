const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const { createTray } = require('./tray');
const { setupScheduler, showDailyVerse, fetchVerse } = require('./scheduler');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 640,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hiddenInset',
    resizable: false,
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
      body: 'Your daily verse will appear at 8:00 AM. Click the tray icon to open.',
    }).show();
  }
});

ipcMain.handle('get-verse', async (event, version = 'en-kjv') => {
  return await fetchVerse(version);
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
