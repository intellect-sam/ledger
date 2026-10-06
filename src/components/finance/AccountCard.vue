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
  <article class="surface-card group relative overflow-hidden rounded-xl p-5 transition-all hover:border-white/10">
    <div
      class="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full bg-emerald-500/[0.05] blur-2xl transition-opacity duration-500 group-hover:bg-emerald-500/[0.12]"
      aria-hidden="true"
    />

    <div class="relative flex items-center gap-3">
      <IconTile :icon="meta[account.kind].icon" :size="38" />
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-zinc-100">{{ account.name }}</p>
        <p class="truncate text-xs text-zinc-500">{{ account.detail }}</p>
      </div>
    </div>

    <div class="relative mt-5 flex items-end justify-between gap-4">
      <div class="min-w-0">
        <p
          class="num-display text-2xl font-semibold tracking-tight"
          :class="isNegative() ? 'text-rose-400' : 'text-zinc-50'"
        >
          {{ formatCurrency(account.balance) }}
        </p>
        <p
          class="mt-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums ring-1 ring-inset"
          :class="
            account.change >= 0
              ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/25'
              : 'bg-rose-500/10 text-rose-400 ring-rose-500/25'
          "
        >
          {{ account.change >= 0 ? "+" : "−" }}{{ formatPercent(Math.abs(account.change)) }}
          <span class="font-normal opacity-70">vs. last month</span>
        </p>
      </div>

      <div class="w-24 shrink-0">
        <Sparkline :values="account.spark" :color="lineColor()" :width="80" :height="30" />
      </div>
    </div>
  </article>
</template>
