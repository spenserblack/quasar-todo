import { defineStore } from 'pinia';
import * as api from '../api';
import type { TodoList } from '../models';

// TODO: Set store asynchronously (probably needs to be done in App.vue)
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoLists: [] as TodoList[],
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
    }
  },
});
