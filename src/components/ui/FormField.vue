<script setup lang="ts">
import { useId } from "vue";

defineProps<{
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}>();

const fieldId = useId();
</script>

<template>
  <div>
    <div class="mb-1.5 flex items-baseline justify-between gap-2">
      <label :for="fieldId" class="text-xs font-medium tracking-wide text-zinc-300 uppercase">
        {{ label }}
      </label>
      <span v-if="optional" class="text-xs text-zinc-500">Optional</span>
    </div>

    <slot :id="fieldId" />

    <p v-if="error" class="mt-1.5 text-xs text-rose-400">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-zinc-500">{{ hint }}</p>
  </div>
</template>
