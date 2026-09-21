<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import IconTile from "@/components/ui/IconTile.vue";
import Badge from "@/components/ui/Badge.vue";
import { categoryColor, categoryIcon, statusVariant } from "@/utils/category";
import { formatCurrency, formatRelativeDate } from "@/utils/format";
import type { Transaction } from "@/data/mock";

withDefaults(
  defineProps<{
    items: Transaction[];
    showHeader?: boolean;
    showAccount?: boolean;
  }>(),
  { showHeader: true, showAccount: true },
);
</script>

<template>
  <div>
    <div
      v-if="showHeader"
      class="hidden grid-cols-[auto_minmax(0,1fr)_9rem_7rem_7rem] items-center gap-3 border-b border-zinc-100 px-2 pb-2 text-[11px] font-medium tracking-wide text-zinc-400 uppercase md:grid"
    >
      <span class="size-9" />
      <span>Merchant</span>
      <span v-if="showAccount">Account</span>
      <span v-else />
      <span>Date</span>
      <span class="text-right">Amount</span>
    </div>

    <ul class="divide-y divide-zinc-100">
      <li
        v-for="item in items"
        :key="item.id"
        class="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-2 py-3 transition-colors hover:bg-zinc-50 md:grid-cols-[auto_minmax(0,1fr)_9rem_7rem_7rem]"
      >
        <IconTile
          :icon="categoryIcon(item.category)"
          :color="categoryColor(item.category)"
        />

        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-zinc-900">{{ item.merchant }}</p>
          <div class="mt-0.5 flex items-center gap-2">
            <span class="truncate text-xs text-zinc-500">{{ item.category }}</span>
            <Badge
              v-if="item.status !== 'completed'"
              :variant="statusVariant[item.status] ?? 'neutral'"
              class="capitalize"
            >
              {{ item.status }}
            </Badge>
          </div>
        </div>

        <span v-if="showAccount" class="hidden truncate text-sm text-zinc-500 md:block">
          {{ item.account }}
        </span>
        <span v-else class="hidden md:block" />

        <span class="hidden text-sm whitespace-nowrap text-zinc-500 md:block">
          {{ formatRelativeDate(item.date) }}
        </span>

        <span
          class="text-right text-sm font-medium whitespace-nowrap tabular-nums"
          :class="item.type === 'income' ? 'text-emerald-700' : 'text-zinc-900'"
        >
          {{ item.type === "income" ? "+" : "−" }}{{ formatCurrency(item.amount) }}
        </span>
      </li>
    </ul>

    <div v-if="items.length === 0" class="flex flex-col items-center px-4 py-14 text-center">
      <span class="grid size-10 place-items-center rounded-full bg-zinc-100 text-zinc-400">
        <AppIcon name="search" :size="18" />
      </span>
      <p class="mt-3 text-sm font-medium text-zinc-900">No transactions found</p>
      <p class="mt-1 max-w-xs text-xs text-zinc-500">
        Try a different search term, or widen the date range.
      </p>
      <div v-if="$slots['empty-action']" class="mt-4">
        <slot name="empty-action" />
      </div>
    </div>
  </div>
</template>
