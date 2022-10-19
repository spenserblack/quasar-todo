import { defineStore } from 'pinia';
import { addTodoList, isElectron } from '../electron';
import type { TodoList } from '../models';

// TODO: Set store asynchronously (probably needs to be done in App.vue)
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todoLists: [] as TodoList[],
  }),
  actions: {
    async addTodoList(name: string) {
      let todoList: TodoList;
      if (isElectron) {
        todoList = await addTodoList!(name);
        this.todoLists.push(todoList);
      } else {
        const { id } = this.todoLists[this.todoLists.length - 1] ?? { id: 0 };
        this.todoLists.push({ name, id: id + 1 });
        localStorage.setItem('todoLists', JSON.stringify(this.todoLists));
      }
    },
  },
});
