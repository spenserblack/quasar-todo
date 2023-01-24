import { shell, ipcMain } from 'electron';
import { getDbPath, TodoList, TodoItem } from './db';
import * as keys from './electron-ipc-keys';
import type {
  IpcMainEvent as Event,
  IpcMainInvokeEvent as InvokeEvent,
} from 'electron';
import type { Model } from 'sequelize';

function openWithBrowser(_event: Event, url: string) {
  shell.openExternal(url);
}

function showDbFile(_event: Event) {
  shell.showItemInFolder(getDbPath());
}

async function getTodoLists(_event: InvokeEvent) {
  const todoLists = await TodoList.findAll();
  return todoLists.map((todoList: Model) => todoList.toJSON());
}

async function addTodoList(_event: InvokeEvent, name: string) {
  const todoList = await TodoList.create({ name });
  return todoList.toJSON();
}

async function deleteTodoList(_event: InvokeEvent, id: number) {
  const todoList = await TodoList.findByPk(id);
  if (todoList == null) {
    throw new Error(`TodoList with id ${id} not found`);
  }

  await todoList.destroy();
  return todoList.toJSON();
}

async function editTodoListTitle(
  _event: InvokeEvent,
  id: number,
  name: string
) {
  const todoList = await TodoList.findByPk(id);
  if (todoList == null) {
    throw new Error(`TodoList with id ${id} not found`);
  }

  todoList.name = name;
  await todoList.save();
  return todoList.toJSON();
}

async function getTodoItems(
  _event: InvokeEvent,
  todoListId: number,
  opts: { done?: boolean; limit?: number } = {}
) {
  const { limit, done } = opts;
  const queryOpts: {
    where: { listId: number; done?: boolean };
    limit?: number;
  } = { where: { listId: todoListId } };

  if (done != null) {
    queryOpts.where.done = done;
  }
  if (limit != null) {
    queryOpts.limit = limit;
  }

  const todoItems = await TodoItem.findAll(queryOpts);
  return todoItems.map((todoItem: Model) => todoItem.toJSON());
}

async function addTodoItem(
  _event: InvokeEvent,
  todoListId: number,
  content: string
) {
  const todoItem = await TodoItem.create({ listId: todoListId, content });
  return todoItem.toJSON();
}

async function completeTodoItem(_event: InvokeEvent, id: number, done = true) {
  const todoItem = await TodoItem.findByPk(id);
  if (todoItem == null) {
    throw new Error(`TodoItem with id ${id} not found`);
  }
  todoItem.done = done;
  await todoItem.save();
  return todoItem.toJSON();
}

export default function setup() {
  ipcMain.on(keys.openWithBrowser, openWithBrowser);
  ipcMain.on(keys.showDbFile, showDbFile);
  ipcMain.handle(keys.getTodoLists, getTodoLists);
  ipcMain.handle(keys.addTodoList, addTodoList);
  ipcMain.handle(keys.deleteTodoList, deleteTodoList);
  ipcMain.handle(keys.editTodoListTitle, editTodoListTitle);
  ipcMain.handle(keys.getTodoItems, getTodoItems);
  ipcMain.handle(keys.addTodoItem, addTodoItem);
  ipcMain.handle(keys.completeTodoItem, completeTodoItem);
}
