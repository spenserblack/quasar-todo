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

async function getTodoItems(_event: InvokeEvent, todoListId: number, done?: boolean, limit?: number) {
  const todoItems = await TodoItem.findAll({
    where: { todoListId, done },
    limit,
  });
  return todoItems.map((todoItem: Model) => todoItem.toJSON());
}

export default function setup() {
  ipcMain.on(keys.openWithBrowser, openWithBrowser);
  ipcMain.on(keys.showDbFile, showDbFile);
  ipcMain.handle(keys.getTodoLists, getTodoLists);
  ipcMain.handle(keys.addTodoList, addTodoList);
  ipcMain.handle(keys.deleteTodoList, deleteTodoList);
  ipcMain.handle(keys.editTodoListTitle, editTodoListTitle);
  ipcMain.handle(keys.getTodoItems, getTodoItems);
}
