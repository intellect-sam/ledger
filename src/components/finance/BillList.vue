<script setup lang="ts">
import IconTile from "@/components/ui/IconTile.vue";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Bill } from "@/data/mock";

defineProps<{ items: Bill[] }>();
</script>

<template>
  <ul class="divide-y divide-white/[0.06]">
    <li
      v-for="bill in items"
      :key="bill.id"
      class="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-white/[0.03]"
    >
      <IconTile :icon="bill.icon" :size="38" />

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-zinc-100">{{ bill.name }}</p>
        <p class="mt-0.5 flex items-center gap-1.5 truncate text-xs text-zinc-500">
          Due {{ formatDate(bill.due) }}
          <span class="text-zinc-700">·</span>
          <span :class="bill.autopay ? 'text-emerald-400' : 'text-zinc-400'">
            {{ bill.autopay ? "Autopay" : "Manual" }}
          </span>
        </p>
      </div>

      <span class="shrink-0 text-sm font-medium text-zinc-100 tabular-nums">
        {{ formatCurrency(bill.amount) }}
      </span>
    </li>
  </ul>
</template>
