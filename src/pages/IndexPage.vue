<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useTodoStore } from '../stores/todo-store';
import type { TodoItem } from '../models';

const $q = useQuasar();

const todoStore = useTodoStore();

const maxItemLength = 50;
const ellipses = (s: string) =>
  s.length < maxItemLength ? s : `${s.slice(0, maxItemLength - 3)}...`;

const todoItems = ref<('loading' | TodoItem[])[]>(
  todoStore.todoLists.map(() => 'loading')
);

const todoItemContents = computed(() =>
  todoItems.value.map((items) => {
    if (items === 'loading') {
      return 'Loading...';
    }
    if (items.length === 0) {
      return 'No pending items';
    }
    return items.map((item) => item.content).join(', ');
  })
);

const onAdd = () => {
  $q.dialog({
    title: 'Add a todo list',
    message: 'What is the name of the todo list?',
    prompt: {
      model: '',
      type: 'text',
      isValid: (name) => !!name,
      label: 'Todo List Name',
    },
    cancel: true,
    persistent: false,
    color: 'secondary',
  }).onOk(async (name) => {
    await todoStore.addTodoList(name);
  });
};

onMounted(async () => {
  const promises = todoStore.todoLists.map(async (todoList, todoListIndex) => {
    const items = await todoStore.getTodoListItems(
      todoList.id,
      { done: true, limit: 3 },
      true
    );
    todoItems.value[todoListIndex] = items;
  });
  await Promise.all(promises);
});
</script>

<template>
  <q-page>
    <div class="row items-center justify-evenly">
      <div class="col-auto">
        <h1 class="text-h2">Main Page</h1>
      </div>
    </div>
    <div class="row items-center justify-evenly">
      <div class="col-xs-12 col-md-6">
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-btn
                icon="add"
                color="primary"
                glossy
                unelevated
                ripple
                aria-label="Add a todo list"
                @click="onAdd"
              />
            </q-item-section>
          </q-item>
          <q-item
            v-for="(list, index) in todoStore.todoLists"
            :to="`/todo-list/${list.id}`"
            clickable
            v-ripple
            :key="list.id"
          >
            <q-item-section>
              <q-item-label class="text-h">{{ list.name }}</q-item-label>
              <q-item-label caption>
                <q-spinner v-if="todoItems[index] === 'loading'" />
                {{ ellipses(todoItemContents[index]) }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>
