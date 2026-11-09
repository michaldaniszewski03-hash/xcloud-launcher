const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('launcher', {
  win: (cmd) => ipcRenderer.send('win', cmd),
  onFullscreen: (fn) => ipcRenderer.on('fs', (_e, v) => fn(v)),
  platform: process.platform,
});
