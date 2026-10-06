import { defineStore } from "pinia";
import { ref } from "vue";
import { accounts as seed } from "@/data/mock";
import type { Account } from "@/data/mock";

export type NewAccountInput = Omit<Account, "id" | "spark">;

/**
 * Linked accounts. Seeded from mock; a newly-linked account starts with a
 * flat sparkline at its opening balance so the UI stays consistent.
 */
export const useAccountsStore = defineStore("accounts", () => {
  const items = ref<Account[]>([...seed]);

  function addAccount(input: NewAccountInput): Account {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `acc_${crypto.randomUUID().slice(0, 8)}`
        : `acc_${Date.now().toString(36)}`;

    const sparkPoint = input.balance / 1000;
    const account: Account = {
      id,
      ...input,
      spark: Array.from({ length: 7 }, () => sparkPoint),
    };
    items.value = [...items.value, account];
    return account;
  }

  function updateBalance(accountName: string, delta: number) {
    items.value = items.value.map((a) =>
      a.name === accountName ? { ...a, balance: a.balance + delta } : a,
    );
  }

  return { items, addAccount, updateBalance };
});
