import { contextBridge, ipcRenderer } from 'electron';
import * as keys from './electron-ipc-keys';

contextBridge.exposeInMainWorld('electronAPI', {
  openWithBrowser: (url: string) => ipcRenderer.send(keys.openWithBrowser, url),
  showDbFile: () => ipcRenderer.send(keys.showDbFile),
  exportAsJson: (minify: boolean) =>
    ipcRenderer.send(keys.exportAsJson, minify),
  importFromJson: () => ipcRenderer.send(keys.importFromJson),
  getTodoLists: () => ipcRenderer.invoke(keys.getTodoLists),
  addTodoList: (title: string) => ipcRenderer.invoke(keys.addTodoList, title),
  deleteTodoList: (id: number) => ipcRenderer.invoke(keys.deleteTodoList, id),
  editTodoListTitle: (id: number, title: string) =>
    ipcRenderer.invoke(keys.editTodoListTitle, id, title),
  getTodoItems: (
    todoListId: number,
    opts: { done?: boolean; limit?: number } = {}
  ) => ipcRenderer.invoke(keys.getTodoItems, todoListId, opts),
  addTodoItem: (todoListId: number, content: string) =>
    ipcRenderer.invoke(keys.addTodoItem, todoListId, content),
  completeTodoItem: (id: number, done = true) =>
    ipcRenderer.invoke(keys.completeTodoItem, id, done),
  editTodoItem: (id: number, content: string) =>
    ipcRenderer.invoke(keys.editTodoItem, id, content),
  deleteTodoItem: (id: number) => ipcRenderer.invoke(keys.deleteTodoItem, id),
});
