<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useTodoStore } from '../stores/todo-store';

const $q = useQuasar();

const todoStore = useTodoStore();
const maxItemLength = 50;
const ellipses = (s: string) =>
  s.length < maxItemLength ? s : `${s.slice(0, maxItemLength - 3)}...`;

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
            v-for="list in todoStore.todoLists"
            :to="`/todo-list/${list.id}`"
            clickable
            v-ripple
            :key="list.id"
          >
            <q-item-section>
              <q-item-label class="text-h">{{ list.name }}</q-item-label>
              <q-item-label caption>{{
                ellipses('List first 3 items with ellipses here')
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>
