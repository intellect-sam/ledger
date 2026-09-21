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
      class="focus-ring h-9 w-full rounded-md border bg-white text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-50"
      :class="[
        $slots.trailing ? 'pr-10' : 'pr-3',
        $slots.leading ? 'pl-8' : 'pl-3',
        invalid ? 'border-rose-300' : 'border-zinc-300',
      ]"
    />

    <div v-if="$slots.leading" class="absolute inset-y-0 left-2.5 flex items-center">
      <slot name="leading" />
    </div>

    <div v-if="$slots.trailing" class="absolute inset-y-0 right-1 flex items-center">
      <slot name="trailing" />
    </div>
  </div>
</template>
