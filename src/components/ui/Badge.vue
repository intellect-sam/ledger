<script setup lang="ts">
import { computed } from "vue";

type Variant = "mint" | "coral" | "sun" | "neutral";

const props = withDefaults(defineProps<{ variant?: Variant; dot?: boolean }>(), {
  variant: "neutral",
  dot: false,
});

const variants: Record<Variant, string> = {
  mint: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/25",
  coral: "bg-rose-500/10 text-rose-400 ring-rose-500/25",
  sun: "bg-amber-500/10 text-amber-300 ring-amber-500/25",
  neutral: "bg-white/5 text-zinc-400 ring-white/10",
};

const dotColors: Record<Variant, string> = {
  mint: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]",
  coral: "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.6)]",
  sun: "bg-amber-300 shadow-[0_0_6px_rgba(252,211,77,0.5)]",
  neutral: "bg-zinc-500",
};

const classes = computed(() => variants[props.variant]);
const dotClass = computed(() => dotColors[props.variant]);
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap"
    :class="classes"
  >
    <span v-if="dot" class="size-1.5 rounded-full" :class="dotClass" />
    <slot />
  </span>
</template>
