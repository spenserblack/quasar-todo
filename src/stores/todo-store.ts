import { defineStore } from 'pinia';
import * as api from '../api';
import type { TodoList, TodoItem } from '../models';

type StoreTodoList = TodoList & { items?: TodoItem[] | null };

// TODO: Set store asynchronously (probably needs to be done in App.vue)
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
  },
});
