import { defineStore } from 'pinia';

export const todoStore = defineStore('todo', {
  state: () => ({
    todos: [],
  }),
});
