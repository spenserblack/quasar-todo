import { defineStore } from 'pinia';

// TODO: If is electron, save to DB, otherwise save to localstorage
export const todoStore = defineStore('todo', {
  state: () => ({
    todos: [],
  }),
});
