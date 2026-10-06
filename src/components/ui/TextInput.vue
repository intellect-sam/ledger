<script setup lang="ts">
import { computed, useId } from "vue";

const props = withDefaults(
  defineProps<{
    id?: string;
    type?: string;
    placeholder?: string;
    autocomplete?: string;
    invalid?: boolean;
  }>(),
  { type: "text", invalid: false },
);

const model = defineModel<string>({ default: "" });

const fallbackId = useId();
const inputId = computed(() => props.id ?? fallbackId);
</script>

<template>
  <div class="relative">
    <input
      :id="inputId"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="invalid || undefined"
      class="focus-ring h-10 w-full rounded-lg border bg-white/[0.03] text-sm text-zinc-100 transition-colors placeholder:text-zinc-500 hover:bg-white/[0.05] focus:bg-white/[0.06] disabled:cursor-not-allowed disabled:bg-white/[0.02] disabled:text-zinc-500"
      :class="[
        $slots.trailing ? 'pr-10' : 'pr-3.5',
        $slots.leading ? 'pl-9' : 'pl-3.5',
        invalid ? 'border-rose-500/40' : 'border-white/10 focus:border-emerald-500/40',
      ]"
    />

    <div v-if="$slots.leading" class="absolute inset-y-0 left-3 flex items-center">
      <slot name="leading" />
    </div>

    <div v-if="$slots.trailing" class="absolute inset-y-0 right-1 flex items-center">
      <slot name="trailing" />
    </div>
  </div>
</template>
