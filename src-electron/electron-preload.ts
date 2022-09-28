import { contextBridge, ipcRenderer } from 'electron';
import { openWithBrowserKey, showDbFileKey } from './electron-ipc-keys';

contextBridge.exposeInMainWorld('electronAPI', {
  openWithBrowser: (url: string) => ipcRenderer.send(openWithBrowserKey, url),
  showDbFile: () => ipcRenderer.send(showDbFileKey),
});
