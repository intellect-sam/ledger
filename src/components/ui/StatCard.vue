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
  neutral: "text-zinc-900",
  positive: "text-emerald-700",
  negative: "text-rose-700",
};

const isGood = computed(() => {
  if (props.change === undefined || props.change === 0) return null;
  const rising = props.change > 0;
  return props.invertTrend ? !rising : rising;
});
</script>

<template>
  <div class="rounded-lg border border-zinc-200 bg-white p-5 shadow-card">
    <div class="flex items-start justify-between gap-3">
      <p class="text-xs font-medium text-zinc-500">{{ label }}</p>
      <AppIcon v-if="icon" :name="icon" :size="16" class="text-zinc-400" />
    </div>

    <p
      class="mt-3 text-3xl font-semibold tracking-tight tabular-nums"
      :class="valueTone[tone]"
    >
      {{ value }}
    </p>

    <div v-if="change !== undefined || hint" class="mt-3 flex items-center gap-2">
      <span
        v-if="change !== undefined && isGood !== null"
        class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums ring-1 ring-inset"
        :class="
          isGood
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
            : 'bg-rose-50 text-rose-700 ring-rose-600/20'
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
