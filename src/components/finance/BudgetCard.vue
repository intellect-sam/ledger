<script setup lang="ts">
import IconTile from "@/components/ui/IconTile.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import { formatCurrency } from "@/utils/format";
import type { Budget } from "@/data/mock";

const props = defineProps<{ budget: Budget }>();

const percent = () => (props.budget.limit > 0 ? (props.budget.spent / props.budget.limit) * 100 : 0);
const remaining = () => Math.max(props.budget.limit - props.budget.spent, 0);
const isOver = () => percent() > 100;
</script>

<template>
  <article class="rounded-lg border border-zinc-200 bg-white p-5 shadow-card">
    <div class="flex items-center gap-3">
      <IconTile :icon="budget.icon" :size="36" :color="budget.color" />

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-zinc-900">{{ budget.category }}</p>
        <p class="text-xs text-zinc-500 tabular-nums">
          {{ formatCurrency(budget.spent, false) }} of
          {{ formatCurrency(budget.limit, false) }}
        </p>
      </div>

      <span
        class="shrink-0 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums ring-1 ring-inset"
        :class="
          isOver()
            ? 'bg-rose-50 text-rose-700 ring-rose-600/20'
            : 'bg-zinc-50 text-zinc-600 ring-zinc-900/10'
        "
      >
        {{ percent().toFixed(0) }}%
      </span>
    </div>

    <div class="mt-4">
      <ProgressBar :value="budget.spent" :max="budget.limit" :color="budget.color" />
    </div>

    <p class="mt-2.5 text-xs" :class="isOver() ? 'text-rose-700' : 'text-zinc-500'">
      {{ isOver() ? "Over by" : "Left" }}
      {{ formatCurrency(isOver() ? budget.spent - budget.limit : remaining(), false) }}
    </p>
  </article>
</template>
