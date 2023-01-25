import { defineStore } from 'pinia';
import * as api from '../api';
import type { TodoList, TodoItem } from '../models';

type StoreTodoList = TodoList & { items?: TodoItem[] | null };

// TODO: Reduce repeated code
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoLists: [] as null | StoreTodoList[],
  }),
  getters: {
    listsById: (state) =>
      state.todoLists.reduce<Record<string, TodoList>>(
        (rec, list) => ({
          [list.id.toString(10)]: list,
          ...rec,
        }),
        {}
      ),
  },
  actions: {
    /**
     * Refreshes the todo lists from the database.
     *
     * This is the initial setup that should be done before any other actions.
     */
    async refreshTodoLists() {
      const todoLists = await api.getTodoLists();
      this.todoLists.splice(0, this.todoLists.length, ...todoLists);
    },
    async addTodoList(name: string) {
      const todoList = await api.addTodoList(name);
      this.todoLists.push(todoList);
    },
    /**
     * Deletes a todo list.
     *
     * @param id The ID of the todo list to delete.
     */
    async deleteTodoList(id: number) {
      const todoList = await api.deleteTodoList(id);

      const index = this.todoLists.findIndex((list) => list.id === todoList.id);
      this.todoLists.splice(index, 1);

      return todoList;
    },
    /**
     * Edits a todo list's name/title.
     *
     * @param id the ID of the todo list to edit.
     * @param title the new title of the todo list.
     */
    async editTodoListName(id: number, title: string) {
      const todoList = await api.editTodoListTitle(id, title);
      const index = this.todoLists.findIndex((list) => list.id === todoList.id);
      this.todoLists.splice(index, 1, todoList);
    },
    /**
     * Gets a todo list's items, caching the results.
     *
     * @param id the ID of the todo list to get items for.
     * @param opts options for the request.
     * @param queryOnly only query the API, don't cache the results. opts are passed to the query. Useful to avoid expensive queries.
     */
    async getTodoListItems(
      id: number,
      opts?: { done?: boolean; limit?: number },
      queryOnly?: boolean
    ) {
      if (queryOnly) {
        return await api.getTodoItems(id, opts);
      }
      const todoList = this.todoLists.find((list) => list.id === id);
      if (!todoList) {
        throw new Error('No todo list');
      }

      if (todoList.items == null) {
        todoList.items = await api.getTodoItems(id, opts);
      }
      let items = todoList.items;
      if (opts?.done != null) {
        items = items.filter((item) => item.done === opts.done);
      }
      if (opts?.limit != null) {
        items = items.slice(0, opts.limit);
      }

      return items;
    },

    /**
     * Adds a todo list item.
     *
     * @param id the ID of the todo list to add an item to.
     * @param content the content of the todo list item.
     */
    async addTodoListItem(id: number, content: string) {
      const todoItem = await api.addTodoItem(id, content);
      const todoList = this.todoLists.find((list) => list.id === id);
      if (!todoList) {
        throw new Error('No todo list');
      }
      if (todoList.items == null) {
        todoList.items = [];
      }
      todoList.items.push(todoItem);
    },

    /**
     * Marks a todo item as complete.
     *
     * @param listId the ID of the todo list the item is in.
     * @param itemId the ID of the todo item to mark as complete.
     * @param done whether the item is done or not.
     */
    async markTodoItem(listId: number, itemId: number, done = true) {
      const todoList = this.todoLists.find((list) => list.id === listId);
      if (!todoList?.items == null) {
        throw new Error('No todo list items');
      }
      const todoItem = todoList.items.find((item) => item.id === itemId);
      if (!todoItem) {
        throw new Error('No todo item');
      }
      todoItem.done = done;
      await api.completeTodoItem(itemId, done);
    },

    /**
     * Edits the content of a todo item.
     *
     * @param listId the ID of the todo list the item is in.
     * @param itemId the ID of the todo item to edit.
     * @param content the new content of the todo item.
     */
    async editTodoItemContent(listId: number, itemId: number, content: string) {
      const todoList = this.todoLists.find((list) => list.id === listId);
      if (!todoList?.items == null) {
        throw new Error('No todo list items');
      }
      const todoItem = todoList.items.find((item) => item.id === itemId);
      if (!todoItem) {
        throw new Error('No todo item');
      }
      todoItem.content = content;
      await api.editTodoItem(itemId, content);
    },

    /**
     * Deletes a todo item.
     *
     * @param listId the ID of the todo list the item is in.
     * @param itemId the ID of the todo item to delete.
     */
    async deleteTodoItem(listId: number, itemId: number) {
      const todoList = this.todoLists.find((list) => list.id === listId);
      if (!todoList?.items == null) {
        throw new Error('No todo list items');
      }
      const todoItem = todoList.items.find((item) => item.id === itemId);
      if (!todoItem) {
        throw new Error('No todo item');
      }
      const index = todoList.items.indexOf(todoItem);
      todoList.items.splice(index, 1);
      await api.deleteTodoItem(itemId);
    },
  },
});
