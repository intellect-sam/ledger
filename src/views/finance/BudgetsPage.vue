<script setup lang="ts">
import { computed } from "vue";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import AreaChart from "@/components/charts/AreaChart.vue";
import BudgetCard from "@/components/finance/BudgetCard.vue";
import { formatCurrency, formatPercent } from "@/utils/format";
import { budgets, paceActual, paceBudget, palette } from "@/data/mock";

const totalLimit = computed(() => budgets.reduce((sum, b) => sum + b.limit, 0));
const totalSpent = computed(() => budgets.reduce((sum, b) => sum + b.spent, 0));
const remaining = computed(() => Math.max(totalLimit.value - totalSpent.value, 0));
const usedPercent = computed(() =>
  totalLimit.value > 0 ? (totalSpent.value / totalLimit.value) * 100 : 0,
);

const daysLeft = 14;
const dailyAllowance = computed(() => remaining.value / daysLeft);

const overBudget = computed(() => budgets.filter((budget) => budget.spent > budget.limit));
const nearestLimit = computed(() =>
  [...budgets]
    .filter((budget) => budget.spent <= budget.limit)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)[0],
);

/** Only label every fifth day so the axis stays legible. */
const paceLabels = paceActual.map((_, index) =>
  index % 5 === 4 || index === paceActual.length - 1 ? `${index + 1}` : "",
);

const paceGap = computed(() => {
  const budget = paceBudget[paceBudget.length - 1] ?? 0;
  const actual = paceActual[paceActual.length - 1] ?? 0;
  return actual - budget;
});

const asCurrency = (value: number) => formatCurrency(value, false);
</script>

<template>
  <DashboardLayout title="Budgets" subtitle="September 2026 · 14 days remaining">
    <template #actions>
      <AppButton variant="outline">
        <AppIcon name="calendar" :size="15" />
        September 2026
      </AppButton>
      <AppButton variant="primary">
        <AppIcon name="plus" :size="15" />
        New budget
      </AppButton>
    </template>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total budget"
        :value="formatCurrency(totalLimit, false)"
        icon="target"
        hint="6 categories"
      />
      <StatCard
        label="Spent so far"
        :value="formatCurrency(totalSpent, false)"
        :change="4.1"
        icon="receipt"
        invert-trend
        hint="this month"
      />
      <StatCard
        label="Remaining"
        :value="formatCurrency(remaining, false)"
        icon="coins"
        :hint="`${formatPercent(usedPercent, 0)} used`"
      />
      <StatCard
        label="Daily allowance"
        :value="formatCurrency(dailyAllowance, false)"
        icon="percent"
        hint="next 14 days"
      />
    </div>

    <CardPanel class="mt-4" title="Monthly envelope" subtitle="Across all categories">
      <template #actions>
        <span class="text-sm text-zinc-900 tabular-nums">
          {{ formatCurrency(totalSpent, false) }}
          <span class="text-zinc-400">/ {{ formatCurrency(totalLimit, false) }}</span>
        </span>
      </template>

      <ProgressBar :value="totalSpent" :max="totalLimit" :color="palette.steel" :height="8" />

      <dl class="mt-4 grid gap-3 sm:grid-cols-3">
        <div class="rounded-md bg-zinc-50 p-3.5">
          <dt class="text-xs text-zinc-500">Used</dt>
          <dd class="mt-1 text-base font-semibold text-zinc-900 tabular-nums">
            {{ formatPercent(usedPercent, 0) }}
          </dd>
        </div>
        <div class="rounded-md bg-zinc-50 p-3.5">
          <dt class="text-xs text-zinc-500">Left to spend</dt>
          <dd class="mt-1 text-base font-semibold text-zinc-900 tabular-nums">
            {{ formatCurrency(remaining, false) }}
          </dd>
        </div>
        <div class="rounded-md bg-zinc-50 p-3.5">
          <dt class="text-xs text-zinc-500">Over limit</dt>
          <dd
            class="mt-1 text-base font-semibold tabular-nums"
            :class="overBudget.length > 0 ? 'text-rose-700' : 'text-zinc-900'"
          >
            {{ overBudget.length }}
            {{ overBudget.length === 1 ? "category" : "categories" }}
          </dd>
        </div>
      </dl>
    </CardPanel>

    <div class="mt-6 mb-3 flex items-center justify-between gap-4">
      <h2 class="text-section font-semibold tracking-tight text-zinc-900">Categories</h2>
      <AppButton variant="ghost" size="sm">
        Manage limits
        <AppIcon name="chevron-right" :size="13" />
      </AppButton>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <BudgetCard v-for="budget in budgets" :key="budget.id" :budget="budget" />

      <button
        type="button"
        class="focus-ring grid cursor-pointer place-items-center rounded-lg border border-dashed border-zinc-300 p-4 text-zinc-500 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
      >
        <span class="flex items-center gap-2 py-5 text-sm font-medium">
          <AppIcon name="plus" :size="15" />
          Add a category
        </span>
      </button>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel
        class="xl:col-span-2"
        title="Spending pace"
        subtitle="Cumulative spend across the month"
      >
        <AreaChart
          :data="paceActual"
          :labels="paceLabels"
          :color="palette.steel"
          :height="210"
          :format-value="asCurrency"
        />

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-zinc-50 p-3.5">
          <div>
            <p class="text-xs text-zinc-500">Envelope at day 30</p>
            <p class="mt-0.5 text-sm font-medium text-zinc-900 tabular-nums">
              {{ formatCurrency(paceBudget[paceBudget.length - 1] ?? 0, false) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-zinc-500">Pace</p>
            <p
              class="mt-0.5 text-sm font-medium tabular-nums"
              :class="paceGap >= 0 ? 'text-rose-700' : 'text-emerald-700'"
            >
              {{ paceGap >= 0 ? "Over" : "Under" }} by
              {{ formatCurrency(Math.abs(paceGap), false) }}
            </p>
          </div>
        </div>
      </CardPanel>

      <CardPanel title="Notices" subtitle="September 2026">
        <ul class="space-y-4">
          <li v-if="nearestLimit" class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
              <AppIcon name="alert-triangle" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900">
                {{ nearestLimit.category }} is close to its limit
              </p>
              <p class="mt-0.5 text-xs text-zinc-500">
                {{ formatPercent((nearestLimit.spent / nearestLimit.limit) * 100, 0) }} used with
                {{ daysLeft }} days left.
              </p>
            </div>
          </li>

          <li v-if="overBudget.length > 0" class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
              <AppIcon name="trending-up" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900">
                {{ overBudget.length }} over budget
              </p>
              <p class="mt-0.5 text-xs text-zinc-500">
                {{ overBudget.map((b) => b.category).join(", ") }} exceeded their limits.
              </p>
            </div>
          </li>

          <li class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
              <AppIcon name="trending-down" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900">Groceries trending down</p>
              <p class="mt-0.5 text-xs text-zinc-500">
                12% below your three-month average.
              </p>
            </div>
          </li>

          <li class="flex gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-500">
              <AppIcon name="calendar" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-900">Weekend spike</p>
              <p class="mt-0.5 text-xs text-zinc-500">
                Saturdays average 2.4× your weekday spend.
              </p>
            </div>
          </li>
        </ul>
      </CardPanel>
    </div>
  </DashboardLayout>
</template>
