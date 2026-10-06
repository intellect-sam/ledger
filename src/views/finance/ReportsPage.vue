<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import SelectField from "@/components/ui/SelectField.vue";
import Badge from "@/components/ui/Badge.vue";
import { useAccountsStore } from "@/stores/accounts";
import { useTransactionsStore } from "@/stores/transactions";
import { useToastStore } from "@/stores/toast";
import { formatCurrency } from "@/utils/format";

const { items: accounts } = storeToRefs(useAccountsStore());
const { items: transactions } = storeToRefs(useTransactionsStore());
const toast = useToastStore();

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface MonthlyReport {
  key: string;
  label: string;
  income: number;
  expense: number;
  net: number;
  count: number;
}

const scopeAccount = ref<string>("all");

// Walk the last 12 months (current month inclusive) ending today.
const monthlyReports = computed<MonthlyReport[]>(() => {
  const now = new Date();
  const buckets: MonthlyReport[] = [];

  for (let offset = 0; offset < 12; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      key,
      label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      income: 0,
      expense: 0,
      net: 0,
      count: 0,
    });
  }

  for (const txn of transactions.value) {
    if (scopeAccount.value !== "all" && txn.account !== scopeAccount.value) continue;
    const month = txn.date.slice(0, 7);
    const bucket = buckets.find((b) => b.key === month);
    if (!bucket) continue;
    bucket.count += 1;
    if (txn.type === "income") bucket.income += txn.amount;
    else bucket.expense += txn.amount;
    bucket.net = bucket.income - bucket.expense;
  }

  return buckets;
});

const totals = computed(() => {
  return monthlyReports.value.reduce(
    (acc, m) => {
      acc.income += m.income;
      acc.expense += m.expense;
      acc.count += m.count;
      return acc;
    },
    { income: 0, expense: 0, count: 0 },
  );
});

function download(report: MonthlyReport, kind: "pdf" | "csv") {
  const scope = scopeAccount.value === "all" ? "All accounts" : scopeAccount.value;
  toast.success(
    `${report.label} statement`,
    `${kind.toUpperCase()} queued · ${scope}`,
  );
}

function exportAll(kind: "pdf" | "csv") {
  toast.success(
    `Twelve-month report`,
    `${kind.toUpperCase()} queued · ${totals.value.count} transactions`,
  );
}
</script>

<template>
  <DashboardLayout
    title="Reports"
    subtitle="Monthly statements and 12-month exports"
  >
    <template #actions>
      <AppButton variant="outline" @click="exportAll('csv')">
        <AppIcon name="download" :size="15" />
        Export CSV
      </AppButton>
      <AppButton variant="primary" @click="exportAll('pdf')">
        <AppIcon name="download" :size="15" />
        Export PDF
      </AppButton>
    </template>

    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Twelve-month income"
        :value="formatCurrency(totals.income, false)"
        icon="trending-up"
        hint="rolling period"
      />
      <StatCard
        label="Twelve-month expenses"
        :value="formatCurrency(totals.expense, false)"
        icon="trending-down"
        hint="rolling period"
      />
      <StatCard
        label="Transactions covered"
        :value="totals.count.toString()"
        icon="receipt"
        hint="in current scope"
      />
    </div>

    <CardPanel
      class="mt-4"
      title="Monthly statements"
      subtitle="Download by month, in CSV or PDF"
      :padded="false"
    >
      <template #actions>
        <SelectField v-model="scopeAccount" class="w-48">
          <option value="all">All accounts</option>
          <option v-for="acc in accounts" :key="acc.id" :value="acc.name">
            {{ acc.name }}
          </option>
        </SelectField>
      </template>

      <div
        class="hidden grid-cols-[minmax(0,1fr)_6rem_6rem_6rem_auto] items-center gap-4 border-b border-white/[0.06] px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-zinc-600 uppercase md:grid"
      >
        <span>Period</span>
        <span class="text-right">Income</span>
        <span class="text-right">Expenses</span>
        <span class="text-right">Net</span>
        <span class="text-right">Download</span>
      </div>

      <ul class="divide-y divide-white/[0.05]">
        <li
          v-for="report in monthlyReports"
          :key="report.key"
          class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03] md:grid-cols-[minmax(0,1fr)_6rem_6rem_6rem_auto]"
        >
          <div class="min-w-0 flex items-center gap-3">
            <span
              class="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-zinc-300 ring-1 ring-inset ring-white/10"
            >
              <AppIcon name="receipt" :size="15" />
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-zinc-100">{{ report.label }}</p>
              <p class="truncate text-xs text-zinc-500">
                {{ report.count }} transaction{{ report.count === 1 ? "" : "s" }}
                <template v-if="report.count === 0"> · nothing recorded</template>
              </p>
            </div>
          </div>

          <span class="hidden text-right text-sm text-emerald-400 tabular-nums md:block">
            {{ formatCurrency(report.income, false) }}
          </span>
          <span class="hidden text-right text-sm text-rose-400 tabular-nums md:block">
            {{ formatCurrency(report.expense, false) }}
          </span>
          <span
            class="hidden text-right text-sm font-medium tabular-nums md:block"
            :class="report.net >= 0 ? 'text-zinc-100' : 'text-rose-400'"
          >
            {{ report.net >= 0 ? "+" : "−" }}{{ formatCurrency(Math.abs(report.net), false) }}
          </span>

          <div class="flex items-center justify-end gap-1">
            <button
              type="button"
              :disabled="report.count === 0"
              class="focus-ring inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs text-zinc-300 transition-colors hover:bg-white/[0.07] hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
              @click="download(report, 'csv')"
            >
              <AppIcon name="download" :size="12" />
              CSV
            </button>
            <button
              type="button"
              :disabled="report.count === 0"
              class="focus-ring inline-flex h-8 cursor-pointer items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 text-xs text-emerald-300 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              @click="download(report, 'pdf')"
            >
              <AppIcon name="download" :size="12" />
              PDF
            </button>
          </div>
        </li>
      </ul>
    </CardPanel>

    <CardPanel class="mt-4" title="Tax & audit bundles" subtitle="Prepared packages, available on request">
      <ul class="divide-y divide-white/[0.06]">
        <li class="flex items-center justify-between gap-4 py-3 first:pt-0">
          <div class="min-w-0 flex items-center gap-3">
            <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25">
              <AppIcon name="shield" :size="15" />
            </span>
            <div>
              <p class="text-sm font-medium text-zinc-100">Year-end tax summary</p>
              <p class="mt-0.5 text-xs text-zinc-500">
                Categorized spending + income · ready in ~5 minutes
              </p>
            </div>
          </div>
          <Badge variant="sun">Available</Badge>
        </li>
        <li class="flex items-center justify-between gap-4 py-3">
          <div class="min-w-0 flex items-center gap-3">
            <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/25">
              <AppIcon name="receipt" :size="15" />
            </span>
            <div>
              <p class="text-sm font-medium text-zinc-100">Mortgage proof-of-income bundle</p>
              <p class="mt-0.5 text-xs text-zinc-500">
                Last 24 months income · lender-ready PDF
              </p>
            </div>
          </div>
          <Badge variant="mint">Available</Badge>
        </li>
        <li class="flex items-center justify-between gap-4 py-3 last:pb-0">
          <div class="min-w-0 flex items-center gap-3">
            <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-zinc-400 ring-1 ring-inset ring-white/10">
              <AppIcon name="calendar" :size="15" />
            </span>
            <div>
              <p class="text-sm font-medium text-zinc-100">Custom date-range export</p>
              <p class="mt-0.5 text-xs text-zinc-500">
                Pick any window, choose accounts, filter categories
              </p>
            </div>
          </div>
          <AppButton variant="outline" size="sm" @click="toast.info('Custom export', 'Opening the builder…')">
            Build
          </AppButton>
        </li>
      </ul>
    </CardPanel>
  </DashboardLayout>
</template>
