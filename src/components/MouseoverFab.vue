<script setup lang="ts">
import { ref } from 'vue';

const isHovering = ref(false);

const onMouseEnter = () => {
  isHovering.value = true;
};
const onMouseLeave = () => {
  isHovering.value = false;
};
</script>

<template>
  <q-fab
    v-bind="$attrs"
    hide-label="!isHovering"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  />
</template>
