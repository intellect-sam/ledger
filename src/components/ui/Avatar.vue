<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    name: string;
    src?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  { size: "md" },
);

const sizes = {
  sm: "size-8 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-14 text-base",
};

/** "Sam Rivera" → "SR" */
const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(""),
);
</script>

<template>
  <span
    class="inline-grid shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-800 font-medium text-white ring-1 ring-zinc-900/5"
    :class="sizes[size]"
  >
    <img v-if="src" :src="src" :alt="name" class="size-full object-cover" />
    <template v-else>{{ initials }}</template>
  </span>
</template>
