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
  <article class="surface-card relative overflow-hidden rounded-xl p-5 transition-colors hover:border-white/10">
    <div class="flex items-center gap-3">
      <IconTile :icon="budget.icon" :size="38" :color="budget.color" />

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-zinc-100">{{ budget.category }}</p>
        <p class="text-xs text-zinc-500 tabular-nums">
          {{ formatCurrency(budget.spent, false) }} of
          {{ formatCurrency(budget.limit, false) }}
        </p>
      </div>

      <span
        class="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums ring-1 ring-inset"
        :class="
          isOver()
            ? 'bg-rose-500/10 text-rose-400 ring-rose-500/25'
            : 'bg-white/[0.04] text-zinc-300 ring-white/10'
        "
      >
        {{ percent().toFixed(0) }}%
      </span>
    </div>

    <div class="mt-5">
      <ProgressBar :value="budget.spent" :max="budget.limit" :color="budget.color" />
    </div>

    <p class="mt-3 text-xs" :class="isOver() ? 'text-rose-400' : 'text-zinc-500'">
      {{ isOver() ? "Over by" : "Left" }}
      <span class="font-medium" :class="isOver() ? 'text-rose-300' : 'text-zinc-300'">
        {{ formatCurrency(isOver() ? budget.spent - budget.limit : remaining(), false) }}
      </span>
    </p>
  </article>
</template>
