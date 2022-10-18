import { contextBridge, ipcRenderer } from 'electron';
import * as keys from './electron-ipc-keys';

contextBridge.exposeInMainWorld('electronAPI', {
  openWithBrowser: (url: string) => ipcRenderer.send(keys.openWithBrowser, url),
  showDbFile: () => ipcRenderer.send(keys.showDbFile),
  addTodoList: (title: string) => ipcRenderer.send(keys.addTodoList, title),
});
