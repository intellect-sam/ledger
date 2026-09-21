<script setup lang="ts">
import ProgressBar from "@/components/ui/ProgressBar.vue";
import { formatCurrency, formatPercent } from "@/utils/format";
import type { Goal } from "@/data/mock";

const props = defineProps<{ goal: Goal }>();

const percent = () => (props.goal.target > 0 ? (props.goal.saved / props.goal.target) * 100 : 0);
</script>

<template>
  <div class="rounded-lg border border-zinc-200 p-4">
    <div class="flex items-baseline justify-between gap-3">
      <p class="flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-900">
        <span
          class="size-2 shrink-0 rounded-full"
          :style="{ backgroundColor: goal.color }"
          aria-hidden="true"
        />
        <span class="truncate">{{ goal.name }}</span>
      </p>
      <span class="shrink-0 text-xs font-medium text-zinc-500 tabular-nums">
        {{ formatPercent(percent(), 0) }}
      </span>
    </div>

    <div class="mt-3">
      <ProgressBar
        :value="goal.saved"
        :max="goal.target"
        :color="goal.color"
        :height="5"
        :warn-on-overflow="false"
      />
    </div>

    <p class="mt-2.5 text-xs text-zinc-500 tabular-nums">
      <span class="font-medium text-zinc-900">{{ formatCurrency(goal.saved, false) }}</span>
      of {{ formatCurrency(goal.target, false) }}
    </p>
  </div>
</template>
