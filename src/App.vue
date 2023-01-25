<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { useTodoStore } from './stores/todo-store';
import { loadTheme } from './util';

const loading = ref(true);

const todoStore = useTodoStore();

const $q = useQuasar();
$q.dark.set(loadTheme());

onMounted(async () => {
  await todoStore.refreshTodoLists();
  loading.value = false;
});
</script>

<template>
  <div v-if="loading" class="row justify-center items-center loading-row">
    <div class="col-12 col-md-auto">
      <q-spinner-gears color="primary" size="5rem" />
    </div>
  </div>
  <router-view v-else />
</template>

<style lang="scss" scoped>
.loading-row {
  height: 100vh;
}
</style>
