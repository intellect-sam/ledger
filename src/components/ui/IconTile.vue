<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";

const props = withDefaults(
  defineProps<{
    icon: string;
    size?: number;
    /**
     * When set, tints the tile and matches the icon to it. Pass a palette hue
     * from `src/data/mock` (see `categoryColor`). Omitted, the tile stays
     * neutral grey.
     */
    color?: string;
  }>(),
  { size: 36 },
);

/** 8-digit hex alpha — "1a" is 10%. Avoids needing color-mix support. */
const tileStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  ...(props.color ? { backgroundColor: `${props.color}1a`, color: props.color } : {}),
}));
</script>

<template>
  <span
    class="grid shrink-0 place-items-center rounded-md"
    :class="color ? '' : 'bg-zinc-100 text-zinc-600'"
    :style="tileStyle"
  >
    <AppIcon :name="icon" :size="Math.round(size * 0.45)" />
  </span>
</template>
