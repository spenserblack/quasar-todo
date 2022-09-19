import { contextBridge, ipcRenderer } from 'electron';
import { openWithBrowserKey } from './electron-ipc-main';

contextBridge.exposeInMainWorld('electronAPI', {
  openWithBrowser: (url: string) => ipcRenderer.send(openWithBrowserKey, url),
});
