<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

withDefaults(
  defineProps<{
    size?: number;
    showName?: boolean;
  }>(),
  { size: 28, showName: true },
);
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <span
      class="grid shrink-0 place-items-center rounded bg-zinc-900 text-white"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <AppIcon name="coins" :size="Math.round(size * 0.54)" />
    </span>
    <span v-if="showName" class="text-sm font-semibold tracking-tight text-zinc-900">
      Ledger
    </span>
  </span>
</template>
