<script setup lang="ts">
import { computed } from "vue";

type Variant = "mint" | "coral" | "sun" | "neutral";

const props = withDefaults(defineProps<{ variant?: Variant; dot?: boolean }>(), {
  variant: "neutral",
  dot: false,
});

const variants: Record<Variant, string> = {
  mint: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  coral: "bg-rose-50 text-rose-700 ring-rose-600/20",
  sun: "bg-amber-50 text-amber-700 ring-amber-600/20",
  neutral: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

const dotColors: Record<Variant, string> = {
  mint: "bg-emerald-500",
  coral: "bg-rose-500",
  sun: "bg-amber-500",
  neutral: "bg-zinc-400",
};

const classes = computed(() => variants[props.variant]);
const dotClass = computed(() => dotColors[props.variant]);
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap"
    :class="classes"
  >
    <span v-if="dot" class="size-1.5 rounded-full" :class="dotClass" />
    <slot />
  </span>
</template>
