import type { TodoList } from './models';

export interface ElectronAPI {
  openWithBrowser(url: string): void;
  showDbFile(): void;
  getTodoLists(): Promise<TodoList[]>;
  addTodoList(name: string): Promise<TodoList>;
  deleteTodoList(id: number): Promise<TodoList>;
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
export const deleteTodoList = electron?.deleteTodoList ?? deleteListFromLocalStorage;

const localStorageKey = 'todoLists';
let cachedLocalStorageLists: TodoList[];
cachedLocalStorageLists = listsFromLocalStorage();
function listsFromLocalStorage(): TodoList[] {
  cachedLocalStorageLists = JSON.parse(
    localStorage.getItem(localStorageKey) || '[]'
  );
  return cachedLocalStorageLists;
}

function addListToLocalStorage(name: string): TodoList {
  const { id } = cachedLocalStorageLists[
    cachedLocalStorageLists.length - 1
  ] ?? { id: 0 };
  const newList = { name, id: id + 1 };
  cachedLocalStorageLists.push(newList);
  saveCachedLocalStorageLists();
  return newList;
}

function deleteListFromLocalStorage(id: number): TodoList {
  const index = cachedLocalStorageLists.findIndex((l) => l.id === id);
  const deletedList = cachedLocalStorageLists.splice(index, 1)[0];

  saveCachedLocalStorageLists();
  return deletedList;
}

function saveCachedLocalStorageLists(): void {
  localStorage.setItem(
    localStorageKey,
    JSON.stringify(cachedLocalStorageLists)
  );
}

function noop() {
  // Do nothing
}
