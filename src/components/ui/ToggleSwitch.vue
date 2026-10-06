<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    class="focus-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full ring-1 ring-inset transition-all"
    :class="
      model
        ? 'bg-emerald-500/90 ring-emerald-400/40 shadow-[0_0_12px_-2px_rgba(16,185,129,0.6)]'
        : 'bg-white/[0.06] ring-white/10'
    "
    @click="model = !model"
  >
    <span
      class="inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200"
      :class="model ? 'translate-x-[18px]' : 'translate-x-0.5'"
    />
  </button>
</template>
