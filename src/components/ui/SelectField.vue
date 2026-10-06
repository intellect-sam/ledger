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
      class="focus-ring h-10 w-full cursor-pointer appearance-none rounded-lg border bg-white/[0.03] pr-9 pl-3.5 text-sm text-zinc-100 transition-colors hover:bg-white/[0.05] focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:bg-white/[0.02] disabled:text-zinc-500 [&>option]:bg-zinc-900 [&>option]:text-zinc-100"
      :class="invalid ? 'border-rose-500/40' : 'border-white/10 focus:border-emerald-500/40'"
    >
      <slot />
    </select>

    <AppIcon
      name="chevron-down"
      :size="13"
      class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500"
    />
  </div>
</template>
