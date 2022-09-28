import { shell, ipcMain } from 'electron';
import { getDbPath } from './db';
import { openWithBrowserKey, showDbFileKey } from './electron-ipc-keys';
import type { IpcMainEvent as Event, IpcMainInvokeEvent as InvokeEvent } from 'electron';

function openWithBrowser(_event: Event, url: string) {
  shell.openExternal(url);
}

function showDbFile(_event: Event) {
  shell.showItemInFolder(getDbPath());
}

export default function setup() {
  ipcMain.on(openWithBrowserKey, openWithBrowser);
  ipcMain.on(showDbFileKey, showDbFile);
}
