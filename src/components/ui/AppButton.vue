<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";

type Variant = "primary" | "outline" | "ghost" | "subtle" | "accent";
type Size = "sm" | "md";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    block?: boolean;
    type?: "button" | "submit" | "reset";
    to?: string;
  }>(),
  { variant: "outline", size: "md", block: false, type: "button" },
);

const variants: Record<Variant, string> = {
  primary:
    "glow-emerald bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:bg-emerald-600",
  accent:
    "glow-emerald bg-emerald-500 text-zinc-950 hover:bg-emerald-400 active:bg-emerald-600",
  outline:
    "border border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07] hover:text-white hover:border-white/15 active:bg-white/[0.09]",
  ghost:
    "text-zinc-400 hover:bg-white/5 hover:text-zinc-100 active:bg-white/10",
  subtle:
    "bg-white/5 text-zinc-200 hover:bg-white/10 active:bg-white/[0.14]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-2.5 text-xs",
  md: "h-9 gap-1.5 px-3.5 text-sm",
};

const base =
  "focus-ring inline-flex cursor-pointer items-center justify-center rounded-lg font-medium tracking-tight transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const classes = computed(() => [
  base,
  variants[props.variant],
  sizes[props.size],
  props.block ? "w-full" : "",
]);
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes" @click="emit('click', $event)">
    <slot />
  </RouterLink>

  <button v-else :type="type" :class="classes" @click="emit('click', $event)">
    <slot />
  </button>
</template>
