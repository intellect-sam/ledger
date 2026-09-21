<script setup lang="ts">
import { computed } from "vue";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import IconTile from "@/components/ui/IconTile.vue";
import AreaChart from "@/components/charts/AreaChart.vue";
import BarChart from "@/components/charts/BarChart.vue";
import { categoryColor, categoryIcon } from "@/utils/category";
import { formatCurrency, formatPercent } from "@/utils/format";
import {
  categoryBreakdown,
  monthlySeries,
  netWorthSeries,
  palette,
  transactions,
  weekdaySpending,
} from "@/data/mock";

const monthLabels = monthlySeries.map((point) => point.label);
const months = monthlySeries.length || 1;

const avgIncome = computed(
  () => monthlySeries.reduce((sum, month) => sum + month.income, 0) / months,
);
const avgExpense = computed(
  () => monthlySeries.reduce((sum, month) => sum + month.expense, 0) / months,
);
const avgSavings = computed(() => avgIncome.value - avgExpense.value);

const bestSavingMonth = computed(() =>
  monthlySeries.reduce((best, month) =>
    month.income - month.expense > best.income - best.expense ? month : best,
  ),
);

const topCategory = computed(() =>
  categoryBreakdown.reduce((top, slice) => (slice.value > top.value ? slice : top)),
);
const maxCategoryValue = computed(() =>
  categoryBreakdown.reduce((max, slice) => Math.max(max, slice.value), 0),
);

const busiestDay = computed(() =>
  weekdaySpending.reduce((top, day) => (day.value > top.value ? day : top)),
);
const maxWeekday = computed(() =>
  weekdaySpending.reduce((max, day) => Math.max(max, day.value), 0),
);

const topMerchants = computed(() => {
  const totals = new Map<string, { total: number; category: string }>();
  for (const txn of transactions) {
    if (txn.type !== "expense") continue;
    const existing = totals.get(txn.merchant);
    totals.set(txn.merchant, {
      total: (existing?.total ?? 0) + txn.amount,
      category: txn.category,
    });
  }
  return [...totals.entries()]
    .map(([merchant, entry]) => ({ merchant, ...entry }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);
});

const netWorthGrowth = computed(() => {
  const first = netWorthSeries[0];
  const last = netWorthSeries[netWorthSeries.length - 1];
  if (first === undefined || last === undefined || first === 0) return 0;
  return ((last - first) / first) * 100;
});

const asCurrency = (value: number) => formatCurrency(value, false);
</script>

<template>
  <DashboardLayout title="Analytics" subtitle="Oct 2025 – Sep 2026 · rolling 12 months">
    <template #actions>
      <AppButton variant="outline">
        <AppIcon name="calendar" :size="15" />
        Last 12 months
      </AppButton>
      <AppButton variant="primary">
        <AppIcon name="download" :size="15" />
        Export report
      </AppButton>
    </template>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Avg. monthly income"
        :value="formatCurrency(avgIncome, false)"
        :change="7.6"
        icon="trending-up"
      />
      <StatCard
        label="Avg. monthly spend"
        :value="formatCurrency(avgExpense, false)"
        :change="-8.4"
        icon="trending-down"
        invert-trend
      />
      <StatCard
        label="Avg. monthly savings"
        :value="formatCurrency(avgSavings, false)"
        :change="11.2"
        icon="coins"
      />
      <StatCard
        label="Largest category"
        :value="topCategory.label"
        icon="receipt"
        :hint="`${formatCurrency(topCategory.value, false)} this month`"
      />
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel class="xl:col-span-2" title="Income vs. expenses" subtitle="By month">
        <template #actions>
          <span class="inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <span class="size-2 rounded-sm" :style="{ backgroundColor: palette.green }" />
            Income
          </span>
          <span class="inline-flex items-center gap-1.5 text-xs text-zinc-500">
            <span class="size-2 rounded-sm" :style="{ backgroundColor: palette.brick }" />
            Expenses
          </span>
        </template>

        <BarChart :data="monthlySeries" :height="240" />
      </CardPanel>

      <CardPanel title="Highlights" subtitle="Twelve-month view">
        <ul class="space-y-4">
          <li class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
              <AppIcon name="trending-up" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900">
                Best month: {{ bestSavingMonth.label }}
              </p>
              <p class="mt-0.5 text-xs text-zinc-500">
                Kept
                {{ formatCurrency(bestSavingMonth.income - bestSavingMonth.expense, false) }},
                your strongest savings month.
              </p>
            </div>
          </li>

          <li class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
              <AppIcon name="calendar" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900">{{ busiestDay.label }} is your peak</p>
              <p class="mt-0.5 text-xs text-zinc-500">
                Averaging {{ formatCurrency(busiestDay.value, false) }} per day.
              </p>
            </div>
          </li>

          <li class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
              <AppIcon name="coins" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900">
                Net worth up {{ formatPercent(netWorthGrowth) }}
              </p>
              <p class="mt-0.5 text-xs text-zinc-500">Across the last twelve months.</p>
            </div>
          </li>
        </ul>
      </CardPanel>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel title="Top merchants" subtitle="By total spend, September">
        <ul>
          <li
            v-for="(merchant, index) in topMerchants"
            :key="merchant.merchant"
            class="-mx-2 flex items-center gap-3 rounded-md px-2 py-3 transition-colors hover:bg-zinc-50"
          >
            <span class="w-3 shrink-0 text-xs text-zinc-400 tabular-nums">{{ index + 1 }}</span>
            <IconTile
              :icon="categoryIcon(merchant.category)"
              :color="categoryColor(merchant.category)"
              :size="36"
            />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-zinc-900">{{ merchant.merchant }}</p>
              <p class="truncate text-xs text-zinc-500">{{ merchant.category }}</p>
            </div>
            <span class="shrink-0 text-sm font-medium text-zinc-900 tabular-nums">
              {{ formatCurrency(merchant.total) }}
            </span>
          </li>
        </ul>
      </CardPanel>

      <CardPanel
        class="xl:col-span-2"
        title="Spending by weekday"
        subtitle="Averaged across September"
      >
        <ul class="space-y-3.5">
          <li v-for="day in weekdaySpending" :key="day.label">
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <span class="text-sm text-zinc-600">{{ day.label }}</span>
              <span class="text-sm text-zinc-900 tabular-nums">
                {{ formatCurrency(day.value, false) }}
              </span>
            </div>
            <ProgressBar
              :value="day.value"
              :max="maxWeekday || 1"
              :color="day.color"
              :height="6"
              :warn-on-overflow="false"
            />
          </li>
        </ul>
      </CardPanel>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel class="xl:col-span-2" title="Net worth trend" subtitle="Twelve-month trajectory">
        <template #actions>
          <span
            class="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700 tabular-nums ring-1 ring-emerald-600/20 ring-inset"
          >
            +{{ formatPercent(netWorthGrowth) }}
          </span>
        </template>

        <AreaChart
          :data="netWorthSeries"
          :labels="monthLabels"
          :color="palette.green"
          :height="220"
          :format-value="asCurrency"
        />
      </CardPanel>

      <CardPanel title="Category totals" subtitle="September 2026">
        <ul class="space-y-3.5">
          <li v-for="slice in categoryBreakdown" :key="slice.label">
            <div class="mb-1.5 flex items-center justify-between gap-3">
              <span class="truncate text-sm text-zinc-600">{{ slice.label }}</span>
              <span class="shrink-0 text-sm text-zinc-900 tabular-nums">
                {{ formatCurrency(slice.value, false) }}
              </span>
            </div>
            <ProgressBar
              :value="slice.value"
              :max="maxCategoryValue || 1"
              :color="slice.color"
              :height="6"
              :warn-on-overflow="false"
            />
          </li>
        </ul>
      </CardPanel>
    </div>
  </DashboardLayout>
</template>
