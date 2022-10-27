<script setup lang="ts">
import { useTodoStore } from '../stores/todo-store';

const todoStore = useTodoStore();
const maxItemLength = 50;
const ellipses = (s: string) => (
  s.length < maxItemLength ? s : `${s.slice(0, maxItemLength - 3)}...`
);
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
          <q-item v-for="list in todoStore.todoLists" clickable v-ripple :key="list.id">
            <q-item-section>
              <q-item-label class="text-h">{{ list.name }}</q-item-label>
              <q-item-label caption>{{ ellipses('List first 3 items with ellipses here') }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>
