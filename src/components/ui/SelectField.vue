<script setup lang="ts">
import { computed, useId } from "vue";
import AppIcon from "./AppIcon.vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    invalid?: boolean;
    disabled?: boolean;
  }>(),
  { invalid: false, disabled: false },
);

const model = defineModel<string>({ default: "" });

const fallbackId = useId();
const selectId = computed(() => props.id ?? fallbackId);
</script>

<template>
  <div class="relative">
    <select
      :id="selectId"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      class="focus-ring h-9 w-full cursor-pointer appearance-none rounded-md border bg-white pr-8 pl-3 text-sm text-zinc-900 transition-colors disabled:cursor-not-allowed disabled:bg-zinc-50"
      :class="invalid ? 'border-rose-300' : 'border-zinc-300'"
    >
      <slot />
    </select>

    <AppIcon
      name="chevron-down"
      :size="13"
      class="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400"
    />
  </div>
</template>
