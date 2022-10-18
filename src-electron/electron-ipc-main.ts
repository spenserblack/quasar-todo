import { shell, ipcMain } from 'electron';
import { getDbPath, TodoList } from './db';
import * as keys from './electron-ipc-keys';
import type { IpcMainEvent as Event, IpcMainInvokeEvent as InvokeEvent } from 'electron';

function openWithBrowser(_event: Event, url: string) {
  shell.openExternal(url);
}

function showDbFile(_event: Event) {
  shell.showItemInFolder(getDbPath());
}

async function addTodoList(_event: InvokeEvent, name: string) {
  const todoList = await TodoList.create({ name });
  return todoList;
}

export default function setup() {
  ipcMain.on(keys.openWithBrowser, openWithBrowser);
  ipcMain.on(keys.showDbFile, showDbFile);
  ipcMain.handle(keys.addTodoList, addTodoList);
}
