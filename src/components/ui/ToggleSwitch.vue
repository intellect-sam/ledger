<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    class="focus-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors"
    :class="model ? 'bg-accent' : 'bg-zinc-200'"
    @click="model = !model"
  >
    <span
      class="inline-block size-4 rounded-full bg-white shadow-sm transition-transform"
      :class="model ? 'translate-x-[18px]' : 'translate-x-0.5'"
    />
  </button>
</template>
