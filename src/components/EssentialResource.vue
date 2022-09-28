<script setup lang="ts">
export interface EssentialResourceProps {
  title: string;
  caption?: string;
  icon?: string;
}
withDefaults(defineProps<EssentialResourceProps>(), {
  icon: '',
});
const emit = defineEmits<{
  (e: 'click'): void,
}>();

const onClick = () => emit('click');
</script>

<template>
  <q-item
    clickable
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
      <q-item-label v-if="caption" caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
