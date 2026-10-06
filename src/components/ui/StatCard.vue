<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";

const props = withDefaults(
  defineProps<{
    label: string;
    value: string;
    /** Percent change vs. last period. Omit to hide the trend. */
    change?: number;
    icon?: string;
    hint?: string;
    /** When true, a positive change is bad (e.g. expenses went up). */
    invertTrend?: boolean;
    /** Colors the headline value. Use for signed figures like net cash flow. */
    tone?: "neutral" | "positive" | "negative";
  }>(),
  { invertTrend: false, tone: "neutral" },
);

const valueTone: Record<"neutral" | "positive" | "negative", string> = {
  neutral: "text-zinc-50",
  positive: "text-emerald-400",
  negative: "text-rose-400",
};

const isGood = computed(() => {
  if (props.change === undefined || props.change === 0) return null;
  const rising = props.change > 0;
  return props.invertTrend ? !rising : rising;
});
</script>

<template>
  <div class="surface-card group relative overflow-hidden rounded-xl p-5 transition-colors hover:border-white/10">
    <!-- Decorative emerald bloom in the corner, visible on hover. -->
    <div
      class="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl transition-opacity duration-500 group-hover:bg-emerald-500/10"
      aria-hidden="true"
    />

    <div class="relative flex items-start justify-between gap-3">
      <p class="text-[11px] font-medium tracking-[0.08em] text-zinc-500 uppercase">
        {{ label }}
      </p>
      <AppIcon v-if="icon" :name="icon" :size="16" class="text-zinc-600" />
    </div>

    <p
      class="num-display relative mt-3 text-3xl font-semibold tracking-tight"
      :class="valueTone[tone]"
    >
      {{ value }}
    </p>

    <div v-if="change !== undefined || hint" class="relative mt-3 flex items-center gap-2">
      <span
        v-if="change !== undefined && isGood !== null"
        class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums ring-1 ring-inset"
        :class="
          isGood
            ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25'
            : 'bg-rose-500/10 text-rose-400 ring-rose-500/25'
        "
      >
        <AppIcon
          :name="change >= 0 ? 'trending-up' : 'trending-down'"
          :size="12"
          :stroke-width="2.25"
        />
        {{ change >= 0 ? "+" : "" }}{{ change.toFixed(1) }}%
      </span>
      <span v-if="hint" class="truncate text-xs text-zinc-500">{{ hint }}</span>
    </div>
  </div>
</template>
