<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import Badge from "@/components/ui/Badge.vue";
import DonutChart from "@/components/charts/DonutChart.vue";
import AccountCard from "@/components/finance/AccountCard.vue";
import AccountModal from "@/components/finance/AccountModal.vue";
import { formatCurrency, formatPercent } from "@/utils/format";
import { palette } from "@/data/mock";
import { useAccountsStore } from "@/stores/accounts";

const { items: accounts } = storeToRefs(useAccountsStore());

const linkOpen = ref(false);

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
  accounts.value.filter((a) => a.balance > 0).reduce((sum, a) => sum + a.balance, 0),
);
const liabilities = computed(() =>
  accounts.value.filter((a) => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0),
);
const netWorth = computed(() => assets.value - liabilities.value);

const distribution = computed(() =>
  accounts.value
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
      <AppButton variant="outline" to="/settings#security">
        <AppIcon name="lock" :size="15" />
        Manage access
      </AppButton>
      <AppButton variant="primary" @click="linkOpen = true">
        <AppIcon name="plus" :size="15" />
        Link account
      </AppButton>
    </template>

    <AccountModal v-model:open="linkOpen" />

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

    <div class="mt-8 mb-4 flex items-center justify-between gap-4">
      <h2 class="font-display text-section font-semibold tracking-tight text-zinc-50">
        Connected accounts
      </h2>
      <Badge variant="mint" dot>All synced</Badge>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <AccountCard v-for="account in accounts" :key="account.id" :account="account" />

      <button
        type="button"
        class="focus-ring group grid cursor-pointer place-items-center rounded-xl border border-dashed border-white/10 p-4 text-zinc-500 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/[0.03] hover:text-emerald-300"
        @click="linkOpen = true"
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
            :size="180"
            :thickness="18"
            center-label="Assets"
            :center-value="formatCurrency(assets, false)"
          />

          <ul class="w-full space-y-3">
            <li v-for="slice in distribution" :key="slice.label" class="flex items-center gap-2.5">
              <span
                class="size-2 shrink-0 rounded-sm"
                :style="{ backgroundColor: slice.color, boxShadow: `0 0 6px ${slice.color}aa` }"
              />
              <span class="min-w-0 flex-1 truncate text-sm text-zinc-300">{{ slice.label }}</span>
              <span class="shrink-0 text-xs text-zinc-500 tabular-nums">
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
          class="hidden grid-cols-[minmax(0,1fr)_7rem_8rem_5rem] gap-4 border-b border-white/[0.06] px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-zinc-600 uppercase md:grid"
        >
          <span>Account</span>
          <span>Type</span>
          <span class="text-right">Balance</span>
          <span class="text-right">Change</span>
        </div>

        <ul class="divide-y divide-white/[0.05]">
          <li
            v-for="account in accounts"
            :key="account.id"
            class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03] md:grid-cols-[minmax(0,1fr)_7rem_8rem_5rem]"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-zinc-100">{{ account.name }}</p>
              <p class="truncate text-xs text-zinc-500">{{ account.detail }}</p>
            </div>

            <span class="hidden md:block">
              <Badge>{{ kindLabels[account.kind] }}</Badge>
            </span>

            <span
              class="text-right text-sm font-medium tabular-nums"
              :class="account.balance < 0 ? 'text-rose-400' : 'text-zinc-100'"
            >
              {{ formatCurrency(account.balance) }}
            </span>

            <span
              class="hidden text-right text-sm tabular-nums md:block"
              :class="account.change >= 0 ? 'text-emerald-400' : 'text-rose-400'"
            >
              {{ account.change >= 0 ? "+" : "−" }}{{ formatPercent(Math.abs(account.change)) }}
            </span>
          </li>
        </ul>
      </CardPanel>
    </div>
  </DashboardLayout>
</template>
