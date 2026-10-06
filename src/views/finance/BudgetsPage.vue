<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import ProgressBar from "@/components/ui/ProgressBar.vue";
import AreaChart from "@/components/charts/AreaChart.vue";
import BudgetCard from "@/components/finance/BudgetCard.vue";
import BudgetModal from "@/components/finance/BudgetModal.vue";
import { formatCurrency, formatPercent } from "@/utils/format";
import { paceActual, paceBudget, palette } from "@/data/mock";
import { useBudgetsStore } from "@/stores/budgets";

const { items: budgets } = storeToRefs(useBudgetsStore());

const newBudgetOpen = ref(false);

const totalLimit = computed(() => budgets.value.reduce((sum, b) => sum + b.limit, 0));
const totalSpent = computed(() => budgets.value.reduce((sum, b) => sum + b.spent, 0));
const remaining = computed(() => Math.max(totalLimit.value - totalSpent.value, 0));
const usedPercent = computed(() =>
  totalLimit.value > 0 ? (totalSpent.value / totalLimit.value) * 100 : 0,
);

const daysLeft = 14;
const dailyAllowance = computed(() => remaining.value / daysLeft);

const overBudget = computed(() =>
  budgets.value.filter((budget) => budget.spent > budget.limit),
);
const nearestLimit = computed(() =>
  [...budgets.value]
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
      <AppButton variant="primary" @click="newBudgetOpen = true">
        <AppIcon name="plus" :size="15" />
        New budget
      </AppButton>
    </template>

    <BudgetModal v-model:open="newBudgetOpen" />

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
        <span class="text-sm text-zinc-100 tabular-nums">
          {{ formatCurrency(totalSpent, false) }}
          <span class="text-zinc-500">/ {{ formatCurrency(totalLimit, false) }}</span>
        </span>
      </template>

      <ProgressBar :value="totalSpent" :max="totalLimit" :color="palette.green" :height="8" />

      <dl class="mt-5 grid gap-3 sm:grid-cols-3">
        <div class="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
          <dt class="text-[11px] tracking-wide text-zinc-500 uppercase">Used</dt>
          <dd class="num-display mt-1 text-lg font-semibold text-zinc-50">
            {{ formatPercent(usedPercent, 0) }}
          </dd>
        </div>
        <div class="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
          <dt class="text-[11px] tracking-wide text-zinc-500 uppercase">Left to spend</dt>
          <dd class="num-display mt-1 text-lg font-semibold text-zinc-50">
            {{ formatCurrency(remaining, false) }}
          </dd>
        </div>
        <div class="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
          <dt class="text-[11px] tracking-wide text-zinc-500 uppercase">Over limit</dt>
          <dd
            class="num-display mt-1 text-lg font-semibold"
            :class="overBudget.length > 0 ? 'text-rose-400' : 'text-zinc-50'"
          >
            {{ overBudget.length }}
            <span class="text-xs font-normal text-zinc-500">
              {{ overBudget.length === 1 ? "category" : "categories" }}
            </span>
          </dd>
        </div>
      </dl>
    </CardPanel>

    <div class="mt-8 mb-4 flex items-center justify-between gap-4">
      <h2 class="font-display text-section font-semibold tracking-tight text-zinc-50">
        Categories
      </h2>
      <AppButton variant="ghost" size="sm">
        Manage limits
        <AppIcon name="chevron-right" :size="13" />
      </AppButton>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <BudgetCard v-for="budget in budgets" :key="budget.id" :budget="budget" />

      <button
        type="button"
        class="focus-ring group grid cursor-pointer place-items-center rounded-xl border border-dashed border-white/10 p-4 text-zinc-500 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] hover:text-emerald-300"
        @click="newBudgetOpen = true"
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
          :color="palette.green"
          :height="210"
          :format-value="asCurrency"
        />

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3.5">
          <div>
            <p class="text-[11px] tracking-wide text-zinc-500 uppercase">Envelope at day 30</p>
            <p class="mt-0.5 text-sm font-medium text-zinc-100 tabular-nums">
              {{ formatCurrency(paceBudget[paceBudget.length - 1] ?? 0, false) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-[11px] tracking-wide text-zinc-500 uppercase">Pace</p>
            <p
              class="mt-0.5 text-sm font-medium tabular-nums"
              :class="paceGap >= 0 ? 'text-rose-400' : 'text-emerald-400'"
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
            <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25">
              <AppIcon name="alert-triangle" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-100">
                {{ nearestLimit.category }} is close to its limit
              </p>
              <p class="mt-0.5 text-xs text-zinc-500">
                {{ formatPercent((nearestLimit.spent / nearestLimit.limit) * 100, 0) }} used with
                {{ daysLeft }} days left.
              </p>
            </div>
          </li>

          <li v-if="overBudget.length > 0" class="flex gap-3">
            <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/25">
              <AppIcon name="trending-up" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-100">
                {{ overBudget.length }} over budget
              </p>
              <p class="mt-0.5 text-xs text-zinc-500">
                {{ overBudget.map((b) => b.category).join(", ") }} exceeded their limits.
              </p>
            </div>
          </li>

          <li class="flex gap-3">
            <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/25">
              <AppIcon name="trending-down" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-100">Groceries trending down</p>
              <p class="mt-0.5 text-xs text-zinc-500">
                12% below your three-month average.
              </p>
            </div>
          </li>

          <li class="flex gap-3">
            <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-white/5 text-zinc-400 ring-1 ring-inset ring-white/10">
              <AppIcon name="calendar" :size="14" />
            </span>
            <div class="min-w-0">
              <p class="text-sm font-medium text-zinc-100">Weekend spike</p>
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
