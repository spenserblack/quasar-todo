import type { TodoList } from './models';

export interface ElectronAPI {
  openWithBrowser(url: string): void;
  showDbFile(): void;
  addTodoList(name: string): Promise<TodoList>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
const electron = window?.electronAPI;

export const isElectron = electron != null;

export const openExternalLink = electron?.openWithBrowser;
export const showDbFile = electron?.showDbFile;
export const addTodoList = electron?.addTodoList;
