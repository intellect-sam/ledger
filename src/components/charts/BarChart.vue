<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    data: { label: string; income: number; expense: number }[];
    height?: number;
    incomeColor?: string;
    expenseColor?: string;
    incomeLabel?: string;
    expenseLabel?: string;
    formatTick?: (value: number) => string;
  }>(),
  {
    height: 240,
    incomeColor: "#3f8f6f",
    expenseColor: "#b4544a",
    incomeLabel: "Income",
    expenseLabel: "Expenses",
  },
);

const W = 720;
const PAD_LEFT = 46;
const PAD_RIGHT = 8;
const PLOT_W = W - PAD_LEFT - PAD_RIGHT;

const max = computed(() => {
  const values = props.data.flatMap((d) => [d.income, d.expense]);
  return values.length > 0 ? Math.max(...values) : 0;
});

const ceiling = computed(() => (max.value === 0 ? 1 : max.value * 1.12));

const groups = computed(() => {
  const count = props.data.length;
  if (count === 0) return [];
  const groupWidth = PLOT_W / count;
  const barWidth = Math.min(groupWidth * 0.26, 14);
  const gap = 3;

  return props.data.map((point, index) => {
    const center = PAD_LEFT + groupWidth * index + groupWidth / 2;
    const incomeH = (point.income / ceiling.value) * props.height;
    const expenseH = (point.expense / ceiling.value) * props.height;

    return {
      label: point.label,
      income: {
        x: center - gap / 2 - barWidth,
        y: props.height - incomeH,
        w: barWidth,
        h: incomeH,
      },
      expense: {
        x: center + gap / 2,
        y: props.height - expenseH,
        w: barWidth,
        h: expenseH,
      },
    };
  });
});

function barPath(x: number, y: number, w: number, h: number): string {
  if (h <= 0.5) return "";
  return `M${x},${y + h} L${x},${y} L${x + w},${y} L${x + w},${y + h} Z`;
}

const STEPS = [3, 2, 1, 0];

const tickFormat = computed(() => {
  if (props.formatTick) return props.formatTick;
  const compact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return (value: number) => `$${compact.format(value)}`;
});

const ticks = computed(() =>
  STEPS.map((step) => ({
    y: (props.height / 3) * step,
    label: tickFormat.value((ceiling.value * step) / 3),
  })),
);
</script>

<template>
  <div>
    <svg
      :viewBox="`0 0 ${W} ${height}`"
      class="h-auto w-full"
      role="img"
      :aria-label="`${incomeLabel} versus ${expenseLabel} by month`"
    >
      <line
        v-for="tick in ticks"
        :key="`grid-${tick.y}`"
        :x1="PAD_LEFT"
        :x2="W - PAD_RIGHT"
        :y1="tick.y"
        :y2="tick.y"
        stroke="#eeeef1"
        stroke-width="1"
      />

      <text
        v-for="tick in ticks"
        :key="`tick-${tick.y}`"
        :x="PAD_LEFT - 8"
        :y="tick.y + 3"
        text-anchor="end"
        class="fill-zinc-400 text-[10px] tabular-nums"
      >
        {{ tick.label }}
      </text>

      <line
        :x1="PAD_LEFT"
        :x2="W - PAD_RIGHT"
        :y1="height - 0.5"
        :y2="height - 0.5"
        stroke="#e4e4e7"
        stroke-width="1"
      />

      <g v-for="(group, i) in groups" :key="i">
        <path
          :d="barPath(group.income.x, group.income.y, group.income.w, group.income.h)"
          :fill="incomeColor"
        />
        <path
          :d="barPath(group.expense.x, group.expense.y, group.expense.w, group.expense.h)"
          :fill="expenseColor"
        />
      </g>
    </svg>

    <div class="mt-3 flex pl-[6.4%] text-[11px] text-zinc-500">
      <span
        v-for="(group, i) in groups"
        :key="`${group.label}-${i}`"
        class="text-center"
        :style="{ width: `${(PLOT_W / groups.length / W) * 100}%` }"
      >
        {{ group.label }}
      </span>
    </div>
  </div>
</template>
