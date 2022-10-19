<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id" @click="todoStore.addTodoList(todo.content)">
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <pre>{{ todoStore.todoLists }}</pre>
  </div>
</template>

<script setup lang="ts">
import { Todo, Meta } from './models';
import { useTodoStore } from '../stores/todo-store';

interface Props {
  title: string;
  todos?: Todo[];
  meta: Meta;
  active: boolean;
}
withDefaults(defineProps<Props>(), {
  todos: () => [],
});

const todoStore = useTodoStore();

async function addTodoList(name: string) {
  await todoStore.addTodoList(name);
}
</script>
