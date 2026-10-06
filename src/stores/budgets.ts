import { defineStore } from "pinia";
import { ref } from "vue";
import { budgets as seed } from "@/data/mock";
import type { Budget } from "@/data/mock";

export type NewBudgetInput = Omit<Budget, "id" | "spent">;

export const useBudgetsStore = defineStore("budgets", () => {
  const items = ref<Budget[]>([...seed]);

  function addBudget(input: NewBudgetInput): Budget {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `b_${crypto.randomUUID().slice(0, 8)}`
        : `b_${Date.now().toString(36)}`;

    const budget: Budget = { id, spent: 0, ...input };
    items.value = [...items.value, budget];
    return budget;
  }

  return { items, addBudget };
});
