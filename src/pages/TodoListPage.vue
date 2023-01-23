<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTodoStore } from '../stores/todo-store';
// TODO: MouseoverFab.vue to create new list items? Pop up modal to create new items?

const $q = useQuasar();

const route = useRoute();
const router = useRouter();
const todoStore = useTodoStore();

const todo = computed(() => todoStore.listsById[route.params.id]);

const onDelete = () => {
  $q.dialog({
    title: `Delete ${todo.value.name}?`,
    message: 'This will permanently delete the list and all of its items.',
    cancel: true,
    persistent: true,
    color: 'negative',
    focus: 'cancel',
  }).onOk(async () => {
    const { id } = todo.value;
    await router.replace('/');
    const todoList = await todoStore.deleteTodoList(id);
    $q.notify({
      message: `Deleted ${todoList.name}`,
      color: 'negative',
      icon: 'delete',
      progress: true,
      timeout: 1500,
    });
  });
};

const onEditTitle = () => {
  $q.dialog({
    title: 'Edit name',
    message: 'Enter a new name for the list',
    prompt: {
      model: todo.value.name,
      type: 'text',
      isValid: (name) => !!name,
      label: 'Todo List Name',
    },
    cancel: true,
    persistent: false,
    color: 'secondary',
  }).onOk(async (name) => {
    await todoStore.editTodoListName(todo.value.id, name);
  });
};

const onAdd = () => {
  $q.dialog({
    title: `Add an item to ${todo.value.name}`,
    message: 'Enter a new item for the list',
    prompt: {
      model: '',
      type: 'text',
      isValid: (content) => !!content,
      label: 'Todo Item Text',
    },
    cancel: true,
    persistent: false,
    color: 'secondary',
  }).onOk(async (content) => {
    await todoStore.addTodoListItem(todo.value.id, content);
  });
};
</script>

<template>
  <q-page>
    <div class="row items-center justify-evenly">
      <div class="col-2"></div>
      <div class="col-auto">
        <h1 class="text-h2">{{ todo.name }}</h1>
      </div>
      <div class="col-2">
        <q-btn-group>
          <q-btn
            icon="edit"
            color="secondary"
            aria-label="Edit title"
            @click="onEditTitle"
            glossy
          />
          <q-btn
            icon="delete_forever"
            color="negative"
            aria-label="Delete list"
            @click="onDelete"
            glossy
          />
        </q-btn-group>
      </div>
    </div>
    <div class="row items-center justify-evenly">
      <div class="col-xs-12 col-md-6">
        <q-list separator>
          <q-item>
            <q-item-section>
              <q-btn icon="add" color="secondary" glossy unelevated ripple aria-label="Add a todo item" @click="onAdd" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>
