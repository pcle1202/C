const { app, BrowserWindow, session, systemPreferences } = require('electron');
const path = require('path');

// Only camera + microphone are ever allowed; everything else is denied.
function setupPermissions() {
  const ses = session.defaultSession;
  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    callback(permission === 'media');
  });
  ses.setPermissionCheckHandler((webContents, permission) => {
    return permission === 'media';
  });
}

async function askMacMediaAccess() {
  if (process.platform !== 'darwin') return;
  try {
    await systemPreferences.askForMediaAccess('camera');
    await systemPreferences.askForMediaAccess('microphone');
  } catch (err) {
    // If access is denied the game falls back to the "blow it out" button.
    console.warn('media access request failed:', err);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 480,
    useContentSize: true,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    title: 'bdap',
  });
  // real-date mode: nov 12 = birthday, after = "not your birthday anymore", before = "come back on november 12".
  // For testing the birthday flow on any day, temporarily remove the query below (demo mode).
  win.loadFile(path.join(__dirname, 'bdap.html'), { query: { realdate: '1' } });
}

app.whenReady().then(async () => {
  setupPermissions();
  await askMacMediaAccess();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
