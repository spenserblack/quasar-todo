<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import EssentialResource from 'components/EssentialResource.vue';
import { showDbFile, isElectron } from '../electron';
import { saveTheme } from '../util';

const $q = useQuasar();

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
const toggleDarkIcon = computed(() => `${isDark.value ? 'light' : 'dark'}_mode`);

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'GitHub',
    caption: 'github.com/spenserblack/quasar-todo',
    icon: 'code',
    link: 'https://github.com/spenserblack/quasar-todo',
  },
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
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
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar Todo
        </q-toolbar-title>

        <q-btn
            flat
            dense
            round
            :icon="toggleDarkIcon"
            aria-label="Toggle Dark Mode"
            @click="toggleDark"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links &amp; Resources
        </q-item-label>

        <EssentialResource
          v-if="isElectron"
          title="Database File"
          caption="Show database file"
          icon="folder_open"
          @click="showDbFile"
        />

        <q-separator v-if="isElectron" inset />

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
