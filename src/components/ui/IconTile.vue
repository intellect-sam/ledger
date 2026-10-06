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
     * neutral.
     */
    color?: string;
  }>(),
  { size: 36 },
);

/** Tinted background + ring + icon all sharing the same hue. */
const tileStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  ...(props.color
    ? {
        backgroundColor: `${props.color}1f`,
        color: props.color,
        boxShadow: `inset 0 0 0 1px ${props.color}2e`,
      }
    : {}),
}));
</script>

<template>
  <span
    class="grid shrink-0 place-items-center rounded-lg"
    :class="color ? '' : 'bg-white/5 text-zinc-400 ring-1 ring-inset ring-white/10'"
    :style="tileStyle"
  >
    <AppIcon :name="icon" :size="Math.round(size * 0.45)" :stroke-width="2" />
  </span>
</template>
