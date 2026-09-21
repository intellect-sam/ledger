<script setup lang="ts">
import { useId } from "vue";

/**
 * Label + control + message. Generates the id for you and passes it to the
 * default slot so the control and the `<label for>` always agree:
 *
 *   <FormField v-slot="{ id }" label="Email">
 *     <TextInput :id="id" v-model="email" />
 *   </FormField>
 */
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
      <label :for="fieldId" class="text-sm font-medium text-zinc-700">{{ label }}</label>
      <span v-if="optional" class="text-xs text-zinc-400">Optional</span>
    </div>

    <slot :id="fieldId" />

    <p v-if="error" class="mt-1.5 text-xs text-rose-700">{{ error }}</p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-zinc-500">{{ hint }}</p>
  </div>
</template>
