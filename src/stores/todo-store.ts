import { defineStore } from 'pinia';
import { getTodoLists, addTodoList } from '../api';
import type { TodoList } from '../models';

// TODO: Set store asynchronously (probably needs to be done in App.vue)
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoLists: [] as TodoList[],
  }),
  actions: {
    /**
     * Refreshes the todo lists from the database.
     */
    async refreshTodoLists() {
      const todoLists = await getTodoLists();
      this.todoLists.splice(0, this.todoLists.length, ...todoLists);
    },
    async addTodoList(name: string) {
      const todoList = await addTodoList(name);
      this.todoLists.push(todoList);
    },
  },
});
