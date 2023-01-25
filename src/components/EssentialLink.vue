<script setup lang="ts">
import { computed } from 'vue';
import { openExternalLink, isElectron } from '../api';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
}
const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});

const target = isElectron ? undefined : '_blank';
const href = computed(() => (isElectron ? '#' : props.link));
</script>

<template>
  <q-item
    clickable
    tag="a"
    :target="target"
    :href="href"
    @click="openExternalLink(props.link)"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
