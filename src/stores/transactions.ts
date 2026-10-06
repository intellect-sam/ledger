import { defineStore } from "pinia";
import { ref } from "vue";
import { transactions as seed } from "@/data/mock";
import type { Transaction } from "@/data/mock";

export type NewTransactionInput = Omit<Transaction, "id">;

/**
 * Transactions ledger. Seeded from mock data; new entries are prepended so
 * they show up at the top of Overview's recent list and Transactions' table.
 */
export const useTransactionsStore = defineStore("transactions", () => {
  const items = ref<Transaction[]>([...seed]);

  function addTransaction(input: NewTransactionInput): Transaction {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `txn_${crypto.randomUUID().slice(0, 8)}`
        : `txn_${Date.now().toString(36)}`;

    const txn: Transaction = { id, ...input };
    items.value = [txn, ...items.value];
    return txn;
  }

  return { items, addTransaction };
});
