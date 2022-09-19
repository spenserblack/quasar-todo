import { shell, ipcMain } from 'electron';
import type { IpcMainEvent as Event, IpcMainInvokeEvent as InvokeEvent } from 'electron';


export const openWithBrowserKey = 'ext:open-with-browser';
function openWithBrowser(_event: Event, url: string) {
  shell.openExternal(url);
}

export default function setup() {
  ipcMain.on(openWithBrowserKey, openWithBrowser);
}
