<script setup lang="ts">
import { computed } from 'vue'
import { isElectron, openExternalLink } from '../electron';

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

const tag = isElectron ? 'button' : 'a';
const target = isElectron ? undefined : '_blank';
const href = computed(() => isElectron ? '#' : props.link);
const onClick = isElectron ? () => openExternalLink(props.link) : undefined;
</script>

<template>
  <q-item
    clickable
    :tag="tag"
    :target="target"
    :href="href"
    @click="onClick"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
