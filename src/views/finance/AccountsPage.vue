<script setup lang="ts">
import { computed } from "vue";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import Badge from "@/components/ui/Badge.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import AccountCard from "@/components/finance/AccountCard.vue";
import { formatCurrency, formatPercent } from "@/utils/format";
import { accounts, palette } from "@/data/mock";

const kindColors: Record<string, string> = {
  checking: palette.teal,
  savings: palette.green,
  credit: palette.brick,
  investment: palette.steel,
  cash: palette.amber,
};

const kindLabels: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit",
  investment: "Investment",
  cash: "Cash",
};

const assets = computed(() =>
  accounts.filter((a) => a.balance > 0).reduce((sum, a) => sum + a.balance, 0),
);
const liabilities = computed(() =>
  accounts.filter((a) => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0),
);
const netWorth = computed(() => assets.value - liabilities.value);

const distribution = computed(() =>
  accounts
    .filter((account) => account.balance > 0)
    .map((account) => ({
      label: account.name,
      value: account.balance,
      color: kindColors[account.kind] ?? palette.slate,
    })),
);
</script>

<template>
  <DashboardLayout title="Accounts" subtitle="5 connected accounts · synced 8 minutes ago">
    <template #actions>
      <AppButton variant="outline">
        <AppIcon name="lock" :size="15" />
        Manage access
      </AppButton>
      <AppButton variant="primary">
        <AppIcon name="plus" :size="15" />
        Link account
      </AppButton>
    </template>

    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Total assets"
        :value="formatCurrency(assets)"
        :change="8.4"
        icon="trending-up"
        hint="4 accounts"
      />
      <StatCard
        label="Total debt"
        :value="formatCurrency(liabilities)"
        :change="-12.8"
        icon="credit-card"
        invert-trend
        hint="1 credit card"
      />
      <StatCard
        label="Net worth"
        :value="formatCurrency(netWorth)"
        :change="6.8"
        icon="wallet"
        hint="assets minus debt"
      />
    </div>

    <div class="mt-6 mb-3 flex items-center justify-between gap-4">
      <h2 class="text-section font-semibold tracking-tight text-zinc-900">Connected accounts</h2>
      <Badge variant="mint" dot>All synced</Badge>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <AccountCard v-for="account in accounts" :key="account.id" :account="account" />

      <button
        type="button"
        class="focus-ring grid cursor-pointer place-items-center rounded-lg border border-dashed border-zinc-300 p-4 text-zinc-500 transition-colors hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
      >
        <span class="flex items-center gap-2 py-9 text-sm font-medium">
          <AppIcon name="plus" :size="15" />
          Link a new account
        </span>
      </button>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <CardPanel title="Where your money sits" subtitle="Positive balances only">
        <div class="flex flex-col items-center gap-6">
          <DonutChart
            :slices="distribution"
            :size="170"
            :thickness="18"
            center-label="Assets"
            :center-value="formatCurrency(assets, false)"
          />

          <ul class="w-full space-y-2.5">
            <li v-for="slice in distribution" :key="slice.label" class="flex items-center gap-2.5">
              <span class="size-2 shrink-0 rounded-sm" :style="{ backgroundColor: slice.color }" />
              <span class="min-w-0 flex-1 truncate text-sm text-zinc-600">{{ slice.label }}</span>
              <span class="shrink-0 text-xs text-zinc-400 tabular-nums">
                {{ formatPercent(assets ? (slice.value / assets) * 100 : 0, 0) }}
              </span>
            </li>
          </ul>
        </div>
      </CardPanel>

      <CardPanel
        class="xl:col-span-2"
        title="Account detail"
        subtitle="Balances and month-over-month change"
        :padded="false"
      >
        <template #actions>
          <AppButton variant="ghost" size="sm">
            <AppIcon name="download" :size="13" />
            Statement
          </AppButton>
        </template>

        <div
          class="hidden grid-cols-[minmax(0,1fr)_7rem_8rem_5rem] gap-4 border-b border-zinc-100 px-5 py-2 text-[11px] font-medium tracking-wide text-zinc-400 uppercase md:grid"
        >
          <span>Account</span>
          <span>Type</span>
          <span class="text-right">Balance</span>
          <span class="text-right">Change</span>
        </div>

        <ul class="divide-y divide-zinc-100">
          <li
            v-for="account in accounts"
            :key="account.id"
            class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-zinc-50 md:grid-cols-[minmax(0,1fr)_7rem_8rem_5rem]"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-zinc-900">{{ account.name }}</p>
              <p class="truncate text-xs text-zinc-500">{{ account.detail }}</p>
            </div>

            <span class="hidden md:block">
              <Badge>{{ kindLabels[account.kind] }}</Badge>
            </span>

            <span
              class="text-right text-sm font-medium tabular-nums"
              :class="account.balance < 0 ? 'text-rose-700' : 'text-zinc-900'"
            >
              {{ formatCurrency(account.balance) }}
            </span>

            <span
              class="hidden text-right text-sm tabular-nums md:block"
              :class="account.change >= 0 ? 'text-emerald-700' : 'text-rose-700'"
            >
              {{ account.change >= 0 ? "+" : "−" }}{{ formatPercent(Math.abs(account.change)) }}
            </span>
          </li>
        </ul>
      </CardPanel>
    </div>
  </DashboardLayout>
</template>
