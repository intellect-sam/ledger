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
    /** Native button type. Ignored when `to` is set. */
    type?: "button" | "submit" | "reset";
    /** When set, renders a RouterLink styled as a button instead of a `<button>`. */
    to?: string;
  }>(),
  { variant: "outline", size: "md", block: false, type: "button" },
);

const variants: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white shadow-card hover:bg-zinc-800 active:bg-zinc-950",
  accent: "bg-accent text-white shadow-card hover:bg-accent-hover active:bg-accent-hover",
  outline:
    "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 active:bg-zinc-100",
  ghost: "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200",
  subtle: "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:bg-zinc-300",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-2.5 text-xs",
  md: "h-9 gap-1.5 px-3 text-sm",
};

const base =
  "focus-ring inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

// Two root nodes, so listeners don't fall through — both roots forward explicitly.
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
