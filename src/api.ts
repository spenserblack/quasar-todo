import type { TodoList, TodoItem } from './models';

export interface ElectronAPI {
  openWithBrowser(url: string): void;
  showDbFile(): void;
  getTodoLists(): Promise<TodoList[]>;
  addTodoList(name: string): Promise<TodoList>;
  deleteTodoList(id: number): Promise<TodoList>;
  editTodoListTitle(id: number, title: string): Promise<TodoList>;
  getTodoItems(listId: number, limit?: number): Promise<TodoItem[]>;
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
export const deleteTodoList =
  electron?.deleteTodoList ?? deleteListFromLocalStorage;
export const editTodoListTitle =
  electron?.editTodoListTitle ?? editListTitleFromLocalStorage;
export const getTodoItems = electron?.getTodoItems ?? itemsFromLocalStorage;

const localStorageListKey = 'todoLists';
let cachedLocalStorageLists: TodoList[];
cachedLocalStorageLists = listsFromLocalStorage();
function listsFromLocalStorage(): TodoList[] {
  cachedLocalStorageLists = JSON.parse(
    localStorage.getItem(localStorageListKey) || '[]'
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

function editListTitleFromLocalStorage(id: number, title: string): TodoList {
  const list = cachedLocalStorageLists.find((l) => l.id === id);
  if (list == null) {
    throw new Error(`List with id ${id} not found`);
  }

  list.name = title;
  saveCachedLocalStorageLists();
  return list;
}

function saveCachedLocalStorageLists(): void {
  localStorage.setItem(
    localStorageListKey,
    JSON.stringify(cachedLocalStorageLists)
  );
}

const localStorageItemKey = 'todoItems';
// NOTE: Maps listId to TodoItem[]
let cachedLocalStorageItems: Record<string, TodoItem[]>;
cachedLocalStorageItems = itemsFromLocalStorage();
function itemsFromLocalStorage(): Record<string, TodoItem[]> {
  cachedLocalStorageItems = JSON.parse(
    localStorage.getItem(localStorageItemKey) || '{}'
  );
  return cachedLocalStorageItems;
}

function addItemToLocalStorage(listId: number, content: string): TodoItem {
  const items = cachedLocalStorageItems[listId] ?? [];
  const { id } = items[items.length - 1] ?? { id: 0 };
  const newItem = { id: id + 1, listId, content, done: false };
  items.push(newItem);
  cachedLocalStorageItems[listId] = items;
  saveCachedLocalStorageItems();
  return newItem;
}

function saveCachedLocalStorageItems(): void {
  localStorage.setItem(
    localStorageItemKey,
    JSON.stringify(cachedLocalStorageItems)
  );
}

function noop() {
  // Do nothing
}
