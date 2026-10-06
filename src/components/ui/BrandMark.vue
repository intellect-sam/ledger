<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

withDefaults(
  defineProps<{
    size?: number;
    showName?: boolean;
  }>(),
  { size: 30, showName: true },
);
</script>

<template>
  <span class="inline-flex items-center gap-2.5">
    <span
      class="relative grid shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 text-zinc-950 shadow-[0_6px_18px_-6px_rgba(16,185,129,0.6)] ring-1 ring-emerald-300/40"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <AppIcon name="coins" :size="Math.round(size * 0.55)" :stroke-width="2" />
      <span
        class="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent"
        aria-hidden="true"
      />
    </span>
    <span v-if="showName" class="text-sm font-semibold tracking-tight text-zinc-50">
      Ledger
    </span>
  </span>
</template>
