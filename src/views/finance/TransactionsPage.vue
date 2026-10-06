<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import StatCard from "@/components/ui/StatCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import TextInput from "@/components/ui/TextInput.vue";
import SelectField from "@/components/ui/SelectField.vue";
import TransactionList from "@/components/finance/TransactionList.vue";
import TransactionModal from "@/components/finance/TransactionModal.vue";
import { formatCurrency, formatSignedCurrency } from "@/utils/format";
import { useTransactionsStore } from "@/stores/transactions";

const { items: transactions } = storeToRefs(useTransactionsStore());

const query = ref("");
const typeFilter = ref("all");
const categoryFilter = ref("all");
const addOpen = ref(false);

const categories = computed(() => [
  "all",
  ...Array.from(new Set(transactions.value.map((item) => item.category))).sort(),
]);

const filtered = computed(() =>
  transactions.value.filter((item) => {
    const needle = query.value.trim().toLowerCase();
    const matchesQuery =
      needle === "" ||
      item.merchant.toLowerCase().includes(needle) ||
      item.category.toLowerCase().includes(needle);
    const matchesType = typeFilter.value === "all" || item.type === typeFilter.value;
    const matchesCategory =
      categoryFilter.value === "all" || item.category === categoryFilter.value;
    return matchesQuery && matchesType && matchesCategory;
  }),
);

const moneyIn = computed(() =>
  filtered.value.filter((i) => i.type === "income").reduce((sum, i) => sum + i.amount, 0),
);
const moneyOut = computed(() =>
  filtered.value.filter((i) => i.type === "expense").reduce((sum, i) => sum + i.amount, 0),
);
const net = computed(() => moneyIn.value - moneyOut.value);

const pages = [1, 2, 3, 4, 5];
</script>

<template>
  <DashboardLayout
    title="Transactions"
    subtitle="September 2026 · 1,248 records across 5 accounts"
  >
    <template #actions>
      <AppButton variant="outline">
        <AppIcon name="calendar" :size="15" />
        Sep 1 – Sep 30
      </AppButton>
      <AppButton variant="primary" @click="addOpen = true">
        <AppIcon name="plus" :size="15" />
        Add transaction
      </AppButton>
    </template>

    <TransactionModal v-model:open="addOpen" />

    <div class="grid gap-4 sm:grid-cols-3">
      <StatCard label="Money in" :value="formatCurrency(moneyIn, false)" />
      <StatCard label="Money out" :value="formatCurrency(moneyOut, false)" />
      <StatCard
        label="Net"
        :value="formatSignedCurrency(net)"
        :tone="net >= 0 ? 'positive' : 'negative'"
      />
    </div>

    <CardPanel class="mt-4" :padded="false">
      <div class="flex flex-col gap-3 border-b border-white/[0.06] p-4 lg:flex-row lg:items-center">
        <div class="w-full lg:max-w-xs">
          <TextInput v-model="query" type="search" placeholder="Search merchant or category">
            <template #leading>
              <AppIcon name="search" :size="15" class="text-zinc-500" />
            </template>
          </TextInput>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <SelectField v-model="typeFilter" class="w-36">
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </SelectField>

          <SelectField v-model="categoryFilter" class="w-44">
            <option v-for="category in categories" :key="category" :value="category">
              {{ category === "all" ? "All categories" : category }}
            </option>
          </SelectField>

          <AppButton variant="outline">
            <AppIcon name="filter" :size="15" />
            More filters
          </AppButton>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <span class="text-xs text-zinc-500 tabular-nums">{{ filtered.length }} results</span>
          <AppButton variant="outline">
            <AppIcon name="download" :size="15" />
            Export
          </AppButton>
        </div>
      </div>

      <div class="px-3 pt-3">
        <TransactionList :items="filtered" />
      </div>

      <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-xs text-zinc-500 tabular-nums">
            Showing {{ filtered.length }} of {{ transactions.length }}
          </p>

          <nav class="flex items-center gap-0.5" aria-label="Pagination">
            <button
              type="button"
              class="focus-ring grid size-8 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
              aria-label="Previous page"
            >
              <AppIcon name="chevron-left" :size="15" />
            </button>
            <button
              v-for="page in pages"
              :key="page"
              type="button"
              class="focus-ring size-8 cursor-pointer rounded-md text-sm tabular-nums transition-colors"
              :class="
                page === 1
                  ? 'bg-emerald-500/15 font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              "
            >
              {{ page }}
            </button>
            <button
              type="button"
              class="focus-ring grid size-8 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
              aria-label="Next page"
            >
              <AppIcon name="chevron-right" :size="15" />
            </button>
          </nav>
        </div>
      </template>
    </CardPanel>
  </DashboardLayout>
</template>
