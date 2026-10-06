<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";
import SelectField from "@/components/ui/SelectField.vue";
import { useAccountsStore } from "@/stores/accounts";
import { useTransactionsStore } from "@/stores/transactions";
import { useToastStore } from "@/stores/toast";
import { formatCurrency } from "@/utils/format";

const open = defineModel<boolean>("open", { default: false });

const accountsStore = useAccountsStore();
const { items: accounts } = storeToRefs(accountsStore);

const todayISO = () => new Date().toISOString().slice(0, 10);

interface FormState {
  from: string;
  to: string;
  amount: string;
  date: string;
  note: string;
}

const initialForm = (): FormState => ({
  from: accounts.value[0]?.name ?? "",
  to: accounts.value[1]?.name ?? "",
  amount: "",
  date: todayISO(),
  note: "",
});

const form = reactive<FormState>(initialForm());
const errors = reactive<Record<keyof FormState, string>>({
  from: "",
  to: "",
  amount: "",
  date: "",
  note: "",
});
const touched = reactive<Record<keyof FormState, boolean>>({
  from: false,
  to: false,
  amount: false,
  date: false,
  note: false,
});

const submitting = ref(false);
const submitError = ref("");

const fromAccount = computed(() =>
  accounts.value.find((a) => a.name === form.from),
);

const toOptions = computed(() => accounts.value.filter((a) => a.name !== form.from));

watch(
  () => form.from,
  () => {
    if (form.from === form.to) form.to = toOptions.value[0]?.name ?? "";
  },
);

function validateField(field: keyof FormState): string {
  const value = form[field];

  if (field === "amount") {
    if (!value) return "Enter an amount.";
    const num = Number(value);
    if (Number.isNaN(num)) return "Amount must be a number.";
    if (num <= 0) return "Amount must be greater than zero.";
    if (num > 1_000_000_000) return "Amount is unrealistically large.";
    if (fromAccount.value && fromAccount.value.balance >= 0 && num > fromAccount.value.balance) {
      return `Not enough in ${fromAccount.value.name}.`;
    }
    return "";
  }

  if (field === "from") return value ? "" : "Pick a source account.";
  if (field === "to") {
    if (!value) return "Pick a destination account.";
    if (value === form.from) return "Destination must differ from source.";
    return "";
  }
  if (field === "date") {
    if (!value) return "Pick a date.";
    const parsed = Date.parse(`${value as string}T00:00:00`);
    if (Number.isNaN(parsed)) return "Date is not valid.";
    return "";
  }
  if (field === "note" && (value as string).length > 160) {
    return "Note must be 160 characters or fewer.";
  }
  return "";
}

function runFieldValidation(field: keyof FormState) {
  errors[field] = validateField(field);
}

function markTouched(field: keyof FormState) {
  touched[field] = true;
  runFieldValidation(field);
}

const isValid = computed(() =>
  (Object.keys(errors) as (keyof FormState)[]).every((f) => validateField(f) === ""),
);

function resetForm() {
  Object.assign(form, initialForm());
  (Object.keys(errors) as (keyof FormState)[]).forEach((k) => {
    errors[k] = "";
    touched[k] = false;
  });
  submitError.value = "";
}

function close() {
  if (submitting.value) return;
  open.value = false;
}

async function handleSubmit() {
  submitError.value = "";
  (Object.keys(touched) as (keyof FormState)[]).forEach((k) => {
    touched[k] = true;
    runFieldValidation(k);
  });
  if (!isValid.value) {
    submitError.value = "Fix the highlighted fields and try again.";
    return;
  }

  submitting.value = true;
  try {
    const transactions = useTransactionsStore();
    const toast = useToastStore();
    const amount = Number(form.amount);
    const noteSuffix = form.note.trim() ? ` · ${form.note.trim()}` : "";

    transactions.addTransaction({
      merchant: `Transfer to ${form.to}${noteSuffix}`,
      category: "Transfers",
      date: form.date,
      amount,
      type: "expense",
      account: form.from,
      status: "completed",
    });
    transactions.addTransaction({
      merchant: `Transfer from ${form.from}${noteSuffix}`,
      category: "Transfers",
      date: form.date,
      amount,
      type: "income",
      account: form.to,
      status: "completed",
    });

    accountsStore.updateBalance(form.from, -amount);
    accountsStore.updateBalance(form.to, amount);

    toast.success(
      `Transferred ${formatCurrency(amount)}`,
      `${form.from} → ${form.to}`,
    );
    open.value = false;
  } catch (err) {
    submitError.value =
      err instanceof Error ? err.message : "Could not complete the transfer.";
  } finally {
    submitting.value = false;
  }
}

const firstFieldRef = ref<HTMLInputElement | null>(null);

watch(open, (isOpen) => {
  if (isOpen) {
    resetForm();
    document.body.style.overflow = "hidden";
    nextTick(() => firstFieldRef.value?.focus());
  } else {
    document.body.style.overflow = "";
  }
});

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") close();
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-10 backdrop-blur-md sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-modal-title"
        @click.self="close"
        @keydown="onKeydown"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          leave-active-class="transition duration-150 ease-in"
          enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
          leave-to-class="opacity-0 translate-y-2 scale-[0.98]"
          appear
        >
          <div
            v-if="open"
            class="surface-card relative w-full max-w-lg overflow-hidden rounded-2xl"
          >
            <div
              class="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-amber-500/15 blur-[80px]"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-[80px]"
              aria-hidden="true"
            />

            <header
              class="relative flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5"
            >
              <div class="min-w-0">
                <h2
                  id="transfer-modal-title"
                  class="font-display text-xl font-semibold tracking-tight text-zinc-50"
                >
                  Transfer money
                </h2>
                <p class="mt-1 text-xs text-zinc-500">
                  Move funds between any two of your linked accounts.
                </p>
              </div>
              <button
                type="button"
                class="focus-ring grid size-8 cursor-pointer place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
                aria-label="Close"
                @click="close"
              >
                <AppIcon name="x" :size="16" />
              </button>
            </header>

            <form
              class="relative max-h-[calc(100vh-10rem)] space-y-5 overflow-y-auto px-6 py-6"
              novalidate
              @submit.prevent="handleSubmit"
            >
              <div
                v-if="submitError"
                class="flex items-start gap-2.5 rounded-lg border border-rose-500/25 bg-rose-500/[0.08] px-3 py-2.5"
                role="alert"
              >
                <AppIcon name="alert-triangle" :size="15" class="mt-px shrink-0 text-rose-400" />
                <p class="text-sm text-rose-300">{{ submitError }}</p>
              </div>

              <FormField
                v-slot="{ id }"
                label="From"
                :error="touched.from ? errors.from : ''"
                :hint="
                  !touched.from && fromAccount
                    ? `Available ${formatCurrency(fromAccount.balance)}`
                    : ''
                "
              >
                <SelectField
                  :id="id"
                  v-model="form.from"
                  :invalid="touched.from && !!errors.from"
                  @change="markTouched('from')"
                >
                  <option v-for="acc in accounts" :key="acc.id" :value="acc.name">
                    {{ acc.name }} · {{ formatCurrency(acc.balance) }}
                  </option>
                </SelectField>
              </FormField>

              <div class="relative flex items-center">
                <div class="h-px flex-1 bg-white/[0.06]" />
                <span class="grid size-9 place-items-center rounded-full border border-white/10 bg-zinc-900/80 text-emerald-400">
                  <AppIcon name="arrow-right" :size="14" :stroke-width="2.25" />
                </span>
                <div class="h-px flex-1 bg-white/[0.06]" />
              </div>

              <FormField
                v-slot="{ id }"
                label="To"
                :error="touched.to ? errors.to : ''"
              >
                <SelectField
                  :id="id"
                  v-model="form.to"
                  :invalid="touched.to && !!errors.to"
                  @change="markTouched('to')"
                >
                  <option v-for="acc in toOptions" :key="acc.id" :value="acc.name">
                    {{ acc.name }} · {{ formatCurrency(acc.balance) }}
                  </option>
                </SelectField>
              </FormField>

              <FormField
                v-slot="{ id }"
                label="Amount"
                :error="touched.amount ? errors.amount : ''"
              >
                <TextInput
                  :id="id"
                  v-model="form.amount"
                  type="number"
                  placeholder="0.00"
                  :invalid="touched.amount && !!errors.amount"
                  @input="touched.amount && runFieldValidation('amount')"
                >
                  <template #leading>
                    <span class="text-sm font-medium text-zinc-500">$</span>
                  </template>
                </TextInput>
              </FormField>

              <div class="grid gap-5 sm:grid-cols-2">
                <FormField
                  v-slot="{ id }"
                  label="Date"
                  :error="touched.date ? errors.date : ''"
                >
                  <TextInput
                    :id="id"
                    v-model="form.date"
                    type="date"
                    :invalid="touched.date && !!errors.date"
                    @change="markTouched('date')"
                  />
                </FormField>

                <FormField
                  v-slot="{ id }"
                  label="Note"
                  optional
                  :error="touched.note ? errors.note : ''"
                >
                  <TextInput
                    :id="id"
                    v-model="form.note"
                    placeholder="Rent split, savings top-up…"
                    :invalid="touched.note && !!errors.note"
                    @input="touched.note && runFieldValidation('note')"
                  />
                </FormField>
              </div>
            </form>

            <footer
              class="relative flex items-center justify-end gap-2 border-t border-white/[0.06] bg-zinc-950/40 px-6 py-4"
            >
              <AppButton variant="ghost" :disabled="submitting" @click="close">
                Cancel
              </AppButton>
              <AppButton
                variant="accent"
                type="button"
                :disabled="submitting"
                @click="handleSubmit"
              >
                <AppIcon
                  v-if="!submitting"
                  name="arrow-left-right"
                  :size="14"
                  :stroke-width="2.25"
                />
                {{ submitting ? "Transferring…" : "Transfer" }}
              </AppButton>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
