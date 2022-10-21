import { contextBridge, ipcRenderer } from 'electron';
import * as keys from './electron-ipc-keys';

contextBridge.exposeInMainWorld('electronAPI', {
  openWithBrowser: (url: string) => ipcRenderer.send(keys.openWithBrowser, url),
  showDbFile: () => ipcRenderer.send(keys.showDbFile),
  getTodoLists: () => ipcRenderer.invoke(keys.getTodoLists),
  addTodoList: (title: string) => ipcRenderer.invoke(keys.addTodoList, title),
});
