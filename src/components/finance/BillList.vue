<script setup lang="ts">
import IconTile from "@/components/ui/IconTile.vue";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Bill } from "@/data/mock";

defineProps<{ items: Bill[] }>();
</script>

<template>
  <ul class="divide-y divide-zinc-100">
    <li
      v-for="bill in items"
      :key="bill.id"
      class="-mx-2 flex items-center gap-3 rounded-md px-2 py-3 transition-colors hover:bg-zinc-50"
    >
      <IconTile :icon="bill.icon" :size="36" />

      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-medium text-zinc-900">{{ bill.name }}</p>
        <p class="mt-0.5 truncate text-xs text-zinc-500">
          Due {{ formatDate(bill.due) }} · {{ bill.autopay ? "Autopay" : "Manual" }}
        </p>
      </div>

      <span class="shrink-0 text-sm font-medium text-zinc-900 tabular-nums">
        {{ formatCurrency(bill.amount) }}
      </span>
    </li>
  </ul>
</template>
