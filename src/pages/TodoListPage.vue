<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTodoStore } from '../stores/todo-store';

const route = useRoute();
const todoStore = useTodoStore();

const todo = computed(() => todoStore.listsById[route.params.id]);
</script>

<template>
  <q-page>
    <div class="row items-center justify-evenly">
      <div class="col-auto">
        <h1 class="text-h2">{{ todo.name }}</h1>
      </div>
    </div>
  </q-page>
</template>
