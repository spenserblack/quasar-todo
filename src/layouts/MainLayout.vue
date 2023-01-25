<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import EssentialResource from 'components/EssentialResource.vue';
import { useTodoStore } from '../stores/todo-store';
import { showDbFile, exportAsJson } from '../api';
import { saveTheme } from '../util';

const $q = useQuasar();

const todoStore = useTodoStore();

const isDark = computed({
  get() {
    return $q.dark.isActive;
  },
  set(value) {
    $q.dark.set(value);
    saveTheme(value);
  },
});
const toggleDark = () => {
  isDark.value = !isDark.value;
};
const toggleDarkIcon = computed(
  () => `${isDark.value ? 'light' : 'dark'}_mode`
);

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'GitHub',
    caption: 'github.com/spenserblack/quasar-todo',
    icon: 'code',
    link: 'https://github.com/spenserblack/quasar-todo',
  },
];

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="view_list"
          aria-label="Todo List Links"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar Todo </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          :icon="toggleDarkIcon"
          aria-label="Toggle Dark Mode"
          @click="toggleDark"
        />
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Your Todo Lists </q-item-label>

        <q-item clickable to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item
          clickable
          :to="`/todo-list/${list.id}`"
          v-for="list in todoStore.todoLists"
          :key="list.id"
        >
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="list" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ list.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-drawer side="right" v-model="rightDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links &amp; Resources </q-item-label>

        <EssentialResource
          class="electron-only"
          title="Database File"
          caption="Show database file"
          icon="folder_open"
          @click="showDbFile"
        />
        <EssentialResource
          class="electron-only"
          title="Export as JSON (minified)"
          caption="Export database as JSON"
          icon="save_alt"
          @click="exportAsJson(true)"
        />
        <EssentialResource
          class="electron-only"
          title="Export as JSON (pretty)"
          caption="Export database as JSON in a readable format"
          icon="save_alt"
          @click="exportAsJson(false)"
        />

        <q-separator class="electron-only" inset />

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
