<script setup lang="ts">
import { computed, useId } from "vue";

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
    incomeColor: "#34d399",
    expenseColor: "#fb7185",
    incomeLabel: "Income",
    expenseLabel: "Expenses",
  },
);

const W = 720;
const PAD_LEFT = 50;
const PAD_RIGHT = 10;
const PLOT_W = W - PAD_LEFT - PAD_RIGHT;

const uid = useId().replace(/[^a-zA-Z0-9-_]/g, "");
const incomeGradId = `bar-income-${uid}`;
const expenseGradId = `bar-expense-${uid}`;

const max = computed(() => {
  const values = props.data.flatMap((d) => [d.income, d.expense]);
  return values.length > 0 ? Math.max(...values) : 0;
});

const ceiling = computed(() => (max.value === 0 ? 1 : max.value * 1.12));

const groups = computed(() => {
  const count = props.data.length;
  if (count === 0) return [];
  const groupWidth = PLOT_W / count;
  const barWidth = Math.min(groupWidth * 0.3, 16);
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

function roundedBarPath(x: number, y: number, w: number, h: number, r = 3): string {
  if (h <= 0.5) return "";
  const radius = Math.min(r, w / 2, h);
  return `M${x},${y + h} L${x},${y + radius} Q${x},${y} ${x + radius},${y} L${x + w - radius},${y} Q${x + w},${y} ${x + w},${y + radius} L${x + w},${y + h} Z`;
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
      <defs>
        <linearGradient :id="incomeGradId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="incomeColor" stop-opacity="1" />
          <stop offset="100%" :stop-color="incomeColor" stop-opacity="0.5" />
        </linearGradient>
        <linearGradient :id="expenseGradId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="expenseColor" stop-opacity="1" />
          <stop offset="100%" :stop-color="expenseColor" stop-opacity="0.5" />
        </linearGradient>
      </defs>

      <line
        v-for="tick in ticks"
        :key="`grid-${tick.y}`"
        :x1="PAD_LEFT"
        :x2="W - PAD_RIGHT"
        :y1="tick.y"
        :y2="tick.y"
        stroke="rgba(255,255,255,0.05)"
        stroke-width="1"
        stroke-dasharray="2 4"
      />

      <text
        v-for="tick in ticks"
        :key="`tick-${tick.y}`"
        :x="PAD_LEFT - 8"
        :y="tick.y + 3"
        text-anchor="end"
        class="fill-zinc-600 text-[10px] tabular-nums"
      >
        {{ tick.label }}
      </text>

      <line
        :x1="PAD_LEFT"
        :x2="W - PAD_RIGHT"
        :y1="height - 0.5"
        :y2="height - 0.5"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="1"
      />

      <g v-for="(group, i) in groups" :key="i">
        <path
          :d="roundedBarPath(group.income.x, group.income.y, group.income.w, group.income.h)"
          :fill="`url(#${incomeGradId})`"
        />
        <path
          :d="roundedBarPath(group.expense.x, group.expense.y, group.expense.w, group.expense.h)"
          :fill="`url(#${expenseGradId})`"
        />
      </g>
    </svg>

    <div class="mt-3 flex pl-[6.9%] text-[11px] text-zinc-500">
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
