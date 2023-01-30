<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { useTodoStore } from '../stores/todo-store';
// TODO: Use QCheckbox with indeterminate state for "done" filter

const $q = useQuasar();

const route = useRoute();
const router = useRouter();
const todoStore = useTodoStore();

const todo = computed(() => todoStore.listsById[route.params.id]);
const loadingItems = computed(() => todo.value?.items == null);

const unwatchId = watch(
  () => route.params.id,
  async () => await todoStore.getTodoListItems(todo.value.id),
  { immediate: true }
);

const searchText = ref('');
const searchedItems = computed(() => {
  if (searchText.value === '') return todo.value?.items;
  return todo.value?.items?.filter((item) =>
    item.content.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const doneFilter = ref<boolean | 'all'>('all');
const doneFilterLabel = computed(() => {
  if (doneFilter.value === false) return 'Not done';
  if (doneFilter.value === true) return 'Done';
  return 'All';
});
const filteredItems = computed(() => {
  if (doneFilter.value === 'all') return searchedItems.value;
  return searchedItems.value?.filter((item) => item.done === doneFilter.value);
});

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

const markTodoItem = async (id: number, done: boolean) => {
  await todoStore.markTodoItem(todo.value.id, id, done);
};

const onEditTodoItem = async (id: number) => {
  $q.dialog({
    title: 'Edit item',
    message: 'Enter new text for the item',
    prompt: {
      model: todo.value.items[id].content,
      type: 'text',
      isValid: (content) => !!content,
      label: 'Todo Item Text',
    },
    cancel: true,
    persistent: false,
    color: 'secondary',
  }).onOk(async (content) => {
    await todoStore.editTodoItemContent(todo.value.id, id, content);
  });
};

const deleteTodoItem = async (id: number) => {
  await todoStore.deleteTodoItem(todo.value.id, id);
};

onBeforeRouteLeave(() => {
  unwatchId();
});
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
    <div class="row items-center justify-center">
      <div class="col-xs-10 col-md-3 offset-md-1">
        <q-input dense filled v-model="searchText" input-class="text-right">
          <template #append>
            <q-icon v-if="searchText === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="searchText = ''"
            />
          </template>
        </q-input>
      </div>
      <div class="col-xs-2 col-md-1 offset-md-1">
        <q-checkbox
          v-model="doneFilter"
          dense
          color="secondary"
          indeterminate-value="all"
          toggle-indeterminate
          :label="doneFilterLabel"
        />
      </div>
    </div>

    <div class="row items-center justify-evenly">
      <div class="col-xs-12 col-md-6">
        <q-list v-if="loadingItems">
          <q-item v-for="i in 3" :key="i">
            <q-item-section>
              <q-item-label>
                <q-skeleton />
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-list v-else separator>
          <q-item>
            <q-item-section>
              <q-btn
                icon="add"
                color="secondary"
                glossy
                unelevated
                ripple
                aria-label="Add a todo item"
                @click="onAdd"
              />
            </q-item-section>
          </q-item>
          <q-item
            v-for="item in filteredItems"
            :key="item.id"
            :class="item.done ? 'bg-positive' : ''"
          >
            <q-item-section>
              <q-item-label>{{ item.content }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn-group>
                <q-btn
                  :color="item.done ? 'warning' : 'positive'"
                  :icon="item.done ? 'remove_done' : 'done'"
                  :aria-label="`Mark as ${item.done ? 'not done' : 'done'}`"
                  @click="markTodoItem(item.id, !item.done)"
                />
                <q-btn
                  icon="edit"
                  color="secondary"
                  aria-label="Edit item"
                  @click="onEditTodoItem(item.id)"
                />
                <q-btn
                  icon="delete_forever"
                  color="negative"
                  aria-label="Delete item"
                  @click="deleteTodoItem(item.id)"
                />
              </q-btn-group>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>
