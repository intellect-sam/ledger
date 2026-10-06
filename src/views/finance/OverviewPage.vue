<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import AreaChart from "@/components/charts/AreaChart.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import TransactionList from "@/components/finance/TransactionList.vue";
import TransactionModal from "@/components/finance/TransactionModal.vue";
import TransferModal from "@/components/finance/TransferModal.vue";
import BillList from "@/components/finance/BillList.vue";
import GoalCard from "@/components/finance/GoalCard.vue";
import { formatCompactCurrency, formatCurrency, formatPercent } from "@/utils/format";
import {
  cashFlowSeries,
  categoryBreakdown,
  goals,
  monthlySeries,
  netWorthSeries,
  palette,
  summary,
  upcomingBills,
} from "@/data/mock";
import { useTransactionsStore } from "@/stores/transactions";

const monthLabels = monthlySeries.map((point) => point.label);

const { items: transactions } = storeToRefs(useTransactionsStore());
const recentTransactions = computed(() => transactions.value.slice(0, 6));

const addOpen = ref(false);
const transferOpen = ref(false);

const spendingTotal = computed(() =>
  categoryBreakdown.reduce((total, slice) => total + slice.value, 0),
);

const latestNetWorth = computed(() => netWorthSeries[netWorthSeries.length - 1] ?? 0);

const netWorthChange = computed(() => {
  const first = netWorthSeries[0];
  const last = netWorthSeries[netWorthSeries.length - 1];
  if (first === undefined || last === undefined || first === 0) return 0;
  return ((last - first) / first) * 100;
});

const asCurrency = (value: number) => formatCurrency(value, false);
</script>

<template>
  <DashboardLayout title="Overview" subtitle="September 2026 · 5 accounts · synced 8 minutes ago">
    <template #actions>
      <AppButton variant="outline" @click="transferOpen = true">
        <AppIcon name="arrow-left-right" :size="15" />
        Transfer
      </AppButton>
      <AppButton variant="primary" @click="addOpen = true">
        <AppIcon name="plus" :size="15" />
        Add transaction
      </AppButton>
    </template>

    <TransactionModal v-model:open="addOpen" />
    <TransferModal v-model:open="transferOpen" />

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total balance"
        :value="formatCurrency(summary.totalBalance)"
        :change="summary.totalBalanceChange"
        icon="wallet"
        hint="vs. last month"
      />
      <StatCard
        label="Income"
        :value="formatCurrency(summary.monthlyIncome, false)"
        :change="summary.monthlyIncomeChange"
        icon="trending-up"
        hint="September"
      />
      <StatCard
        label="Expenses"
        :value="formatCurrency(summary.monthlyExpense, false)"
        :change="summary.monthlyExpenseChange"
        icon="trending-down"
        invert-trend
        hint="September"
      />
      <StatCard
        label="Savings rate"
        :value="formatPercent(summary.savingsRate, 0)"
        :change="summary.savingsRateChange"
        icon="target"
        hint="of income kept"
      />
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel
        class="xl:col-span-2"
        title="Net cash flow"
        subtitle="Income less expenses, by month"
      >
        <AreaChart
          :data="cashFlowSeries"
          :labels="monthLabels"
          :color="palette.steel"
          :height="230"
          :format-value="asCurrency"
        />
      </CardPanel>

      <CardPanel title="Spending by category" subtitle="September 2026">
        <div class="flex flex-col items-center gap-6 sm:flex-row xl:flex-col">
          <DonutChart
            :slices="categoryBreakdown"
            :size="170"
            :thickness="18"
            center-label="Total"
            :center-value="formatCurrency(spendingTotal, false)"
          />

          <ul class="w-full space-y-3">
            <li v-for="slice in categoryBreakdown" :key="slice.label" class="flex items-center gap-2.5">
              <span
                class="size-2 shrink-0 rounded-sm"
                :style="{ backgroundColor: slice.color, boxShadow: `0 0 6px ${slice.color}aa` }"
              />
              <span class="min-w-0 flex-1 truncate text-sm text-zinc-300">{{ slice.label }}</span>
              <span class="shrink-0 text-sm text-zinc-100 tabular-nums">
                {{ formatCurrency(slice.value, false) }}
              </span>
              <span class="w-9 shrink-0 text-right text-xs text-zinc-500 tabular-nums">
                {{ formatPercent(spendingTotal ? (slice.value / spendingTotal) * 100 : 0, 0) }}
              </span>
            </li>
          </ul>
        </div>
      </CardPanel>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel
        class="xl:col-span-2"
        title="Recent transactions"
        subtitle="Last 6 of 1,248"
        :padded="false"
      >
        <template #actions>
          <AppButton variant="ghost" size="sm">
            View all
            <AppIcon name="chevron-right" :size="13" />
          </AppButton>
        </template>

        <div class="px-3 pb-2">
          <TransactionList :items="recentTransactions" :show-header="false" />
        </div>
      </CardPanel>

      <CardPanel title="Upcoming bills" subtitle="Next 30 days">
        <template #actions>
          <AppButton variant="ghost" size="sm">
            <AppIcon name="plus" :size="13" />
            Add
          </AppButton>
        </template>

        <BillList :items="upcomingBills" />
      </CardPanel>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel class="xl:col-span-2" title="Net worth" subtitle="Assets minus liabilities">
        <template #actions>
          <span class="num-display text-section font-semibold text-zinc-50">
            {{ formatCompactCurrency(latestNetWorth) }}
          </span>
          <span
            class="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-400 tabular-nums ring-1 ring-emerald-500/25 ring-inset"
          >
            +{{ formatPercent(netWorthChange) }}
          </span>
        </template>

        <AreaChart
          :data="netWorthSeries"
          :labels="monthLabels"
          :color="palette.green"
          :height="200"
          :format-value="asCurrency"
        />
      </CardPanel>

      <CardPanel title="Savings goals" subtitle="3 active">
        <div class="space-y-3">
          <GoalCard v-for="goal in goals" :key="goal.id" :goal="goal" />
        </div>
      </CardPanel>
    </div>
  </DashboardLayout>
</template>
