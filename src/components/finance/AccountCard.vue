<script setup lang="ts">
import IconTile from "@/components/ui/IconTile.vue";
import Sparkline from "@/components/charts/Sparkline.vue";
import { formatCurrency, formatPercent } from "@/utils/format";
import { palette } from "@/data/mock";
import type { Account } from "@/data/mock";

const props = defineProps<{ account: Account }>();

const meta: Record<Account["kind"], { label: string; icon: string }> = {
  checking: { label: "Checking", icon: "banknote" },
  savings: { label: "Savings", icon: "coins" },
  credit: { label: "Credit card", icon: "credit-card" },
  investment: { label: "Investment", icon: "trending-up" },
  cash: { label: "Cash", icon: "wallet" },
};

const isNegative = () => props.account.balance < 0;
const lineColor = () => (props.account.change >= 0 ? palette.green : palette.brick);
</script>

<template>
  <article class="rounded-lg border border-zinc-200 bg-white p-5 shadow-card">
    <div class="flex items-center gap-3">
      <IconTile :icon="meta[account.kind].icon" :size="36" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-zinc-900">{{ account.name }}</p>
        <p class="truncate text-xs text-zinc-500">{{ account.detail }}</p>
      </div>
    </div>

    <div class="mt-4 flex items-end justify-between gap-4">
      <div class="min-w-0">
        <p
          class="text-2xl font-semibold tracking-tight tabular-nums"
          :class="isNegative() ? 'text-rose-700' : 'text-zinc-900'"
        >
          {{ formatCurrency(account.balance) }}
        </p>
        <p
          class="mt-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums ring-1 ring-inset"
          :class="
            account.change >= 0
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
              : 'bg-rose-50 text-rose-700 ring-rose-600/20'
          "
        >
          {{ account.change >= 0 ? "+" : "−" }}{{ formatPercent(Math.abs(account.change)) }}
          <span class="font-normal opacity-80">vs. last month</span>
        </p>
      </div>

      <div class="w-20 shrink-0">
        <Sparkline :values="account.spark" :color="lineColor()" :width="80" :height="28" />
      </div>
    </div>
  </article>
</template>
