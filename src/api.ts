import type { TodoList, TodoItem } from './models';

export interface ElectronAPI {
  openWithBrowser(url: string): void;
  showDbFile(): void;
  exportAsJson(minify: boolean): void;
  getTodoLists(): Promise<TodoList[]>;
  addTodoList(name: string): Promise<TodoList>;
  deleteTodoList(id: number): Promise<TodoList>;
  editTodoListTitle(id: number, title: string): Promise<TodoList>;
  getTodoItems(
    listId: number,
    opts?: { done?: boolean; limit?: number }
  ): Promise<TodoItem[]>;
  addTodoItem(listId: number, content: string): Promise<TodoItem>;
  completeTodoItem(id: number, done?: boolean): Promise<TodoItem>;
  editTodoItem(id: number, content: string): Promise<TodoItem>;
  deleteTodoItem(id: number): Promise<TodoItem>;
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
export const exportAsJson = electron?.exportAsJson ?? noop;
export const getTodoLists = electron?.getTodoLists ?? listsFromLocalStorage;
export const addTodoList = electron?.addTodoList ?? addListToLocalStorage;
export const deleteTodoList =
  electron?.deleteTodoList ?? deleteListFromLocalStorage;
export const editTodoListTitle =
  electron?.editTodoListTitle ?? editListTitleFromLocalStorage;
export const getTodoItems =
  electron?.getTodoItems ?? getTodoItemsFromLocalStorage;
export const addTodoItem = electron?.addTodoItem ?? addItemToLocalStorage;
export const completeTodoItem =
  electron?.completeTodoItem ?? completeTodoItemInLocalStorage;
export const editTodoItem =
  electron?.editTodoItem ?? editTodoItemInLocalStorage;
export const deleteTodoItem =
  electron?.deleteTodoItem ?? deleteTodoItemInLocalStorage;

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

function getTodoItemsFromLocalStorage(
  listId: number,
  opts: { done?: boolean; limit?: number } = {}
): TodoItem[] {
  const { done, limit } = opts;
  const items = cachedLocalStorageItems[listId] ?? [];
  const filteredItems =
    done != null ? items.filter((i) => i.done === done) : items;
  return limit ? filteredItems.slice(0, limit) : filteredItems;
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

// TODO: Reduce repetition

function completeTodoItemInLocalStorage(id: number, done = true): TodoItem {
  const items = Object.values(cachedLocalStorageItems).flat();
  const item = items.find((i) => i.id === id);
  if (item == null) {
    throw new Error(`Item with id ${id} not found`);
  }

  item.done = done;
  saveCachedLocalStorageItems();
  return item;
}

function editTodoItemInLocalStorage(id: number, content: string): TodoItem {
  const items = Object.values(cachedLocalStorageItems).flat();
  const item = items.find((i) => i.id === id);
  if (item == null) {
    throw new Error(`Item with id ${id} not found`);
  }

  item.content = content;
  saveCachedLocalStorageItems();
  return item;
}

function deleteTodoItemInLocalStorage(id: number): TodoItem {
  const items = Object.values(cachedLocalStorageItems).flat();
  const index = items.findIndex((i) => i.id === id);
  const deletedItem = items.splice(index, 1)[0];
  saveCachedLocalStorageItems();
  return deletedItem;
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
