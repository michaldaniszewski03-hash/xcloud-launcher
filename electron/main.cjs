const { app, BrowserWindow, session, ipcMain, shell } = require('electron');
const path = require('path');

// xbox.com/play only allows "supported" browsers, so we present as Edge.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0';
const PARTITION = 'persist:xcloud'; // keeps you logged in between launches

app.commandLine.appendSwitch('enable-features', 'PlatformHEVCDecoderSupport');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400, height: 860, minWidth: 960, minHeight: 600,
    backgroundColor: '#07090a',
    frame: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      webviewTag: true,
      contextIsolation: true,
    },
  });

  if (process.env.VITE_DEV) win.loadURL('http://localhost:5173');
  else win.loadFile(path.join(__dirname, '../dist/index.html'));

  ipcMain.on('win', (_e, cmd) => {
    if (cmd === 'min') win.minimize();
    if (cmd === 'max') win.isMaximized() ? win.unmaximize() : win.maximize();
    if (cmd === 'close') win.close();
    if (cmd === 'fullscreen') win.setFullScreen(!win.isFullScreen());
  });
  win.on('enter-full-screen', () => win.webContents.send('fs', true));
  win.on('leave-full-screen', () => win.webContents.send('fs', false));
}

app.whenReady().then(() => {
  const ses = session.fromPartition(PARTITION);
  ses.setUserAgent(UA);
  // Allow gamepad/fullscreen/pointer lock/mic (party chat)
  ses.setPermissionRequestHandler((_wc, _perm, cb) => cb(true));

  // Microsoft login opens popups; keep them inside the app, external links go to the system browser.
  app.on('web-contents-created', (_e, wc) => {
    wc.setWindowOpenHandler(({ url }) => {
      if (/login\.(live|microsoftonline)\.com|xbox\.com|microsoft\.com/.test(url)) {
        return { action: 'allow', overrideBrowserWindowOptions: { webPreferences: { partition: PARTITION } } };
      }
      shell.openExternal(url);
      return { action: 'deny' };
    });
  });

  createWindow();
});
app.on('window-all-closed', () => app.quit());
