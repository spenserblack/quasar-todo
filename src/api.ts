import type { TodoList } from './models';

export interface ElectronAPI {
  openWithBrowser(url: string): void;
  showDbFile(): void;
  getTodoLists(): Promise<TodoList[]>;
  addTodoList(name: string): Promise<TodoList>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
const electron = window?.electronAPI;

export const isElectron = electron != null;

export const openExternalLink = electron?.openWithBrowser ?? noop;
export const showDbFile = electron?.showDbFile ?? noop;
export const getTodoLists = electron?.getTodoLists ?? listsFromLocalStorage;
export const addTodoList = electron?.addTodoList ?? addListToLocalStorage;

const localStorageKey = 'todoLists';
let cachedLocalStorageLists: TodoList[];
cachedLocalStorageLists = listsFromLocalStorage();
function listsFromLocalStorage(): TodoList[] {
  cachedLocalStorageLists = JSON.parse(localStorage.getItem(localStorageKey) || '[]');
  return cachedLocalStorageLists;
}

function addListToLocalStorage(name: string): TodoList {
  const { id } = cachedLocalStorageLists[cachedLocalStorageLists.length - 1] ?? { id: 0 };
  const newList = { name, id: id + 1 };
  cachedLocalStorageLists.push(newList);
  localStorage.setItem(localStorageKey, JSON.stringify(cachedLocalStorageLists));
  return newList;
}

function noop() {
  // Do nothing
}
