<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";
import SelectField from "@/components/ui/SelectField.vue";
import { storeToRefs } from "pinia";
import { useAccountsStore } from "@/stores/accounts";
import { useTransactionsStore } from "@/stores/transactions";
import { useToastStore } from "@/stores/toast";
import { formatCurrency } from "@/utils/format";
import type { Transaction, TransactionStatus, TransactionType } from "@/data/mock";

const { items: accounts } = storeToRefs(useAccountsStore());

const open = defineModel<boolean>("open", { default: false });

const emit = defineEmits<{ created: [transaction: Transaction] }>();

const EXPENSE_CATEGORIES = [
  "Groceries",
  "Dining",
  "Housing",
  "Transport",
  "Shopping",
  "Utilities",
  "Subscriptions",
  "Health",
  "Travel",
  "Education",
  "Transfers",
];

const INCOME_CATEGORIES = ["Income", "Transfers"];

const todayISO = () => new Date().toISOString().slice(0, 10);

interface FormState {
  type: TransactionType;
  amount: string;
  merchant: string;
  category: string;
  account: string;
  date: string;
  status: TransactionStatus;
  notes: string;
}

const initialForm = (): FormState => ({
  type: "expense",
  amount: "",
  merchant: "",
  category: "",
  account: accounts.value[0]?.name ?? "",
  date: todayISO(),
  status: "completed",
  notes: "",
});

const form = reactive<FormState>(initialForm());
const errors = reactive<Record<keyof FormState, string>>({
  type: "",
  amount: "",
  merchant: "",
  category: "",
  account: "",
  date: "",
  status: "",
  notes: "",
});

const touched = reactive<Record<keyof FormState, boolean>>({
  type: false,
  amount: false,
  merchant: false,
  category: false,
  account: false,
  date: false,
  status: false,
  notes: false,
});

const submitting = ref(false);
const submitError = ref("");

const categoryOptions = computed(() =>
  form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES,
);

// Reset category whenever the type switches and the current pick is not in
// the new list. Avoids landing with a stale pairing like "Income / Groceries".
watch(
  () => form.type,
  (next) => {
    const valid = next === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (form.category && !valid.includes(form.category)) {
      form.category = "";
      touched.category = false;
      errors.category = "";
    }
  },
);

function validateField(field: keyof FormState): string {
  const value = form[field];

  if (field === "amount") {
    if (value === "" || value === null) return "Enter an amount.";
    const num = Number(value);
    if (Number.isNaN(num)) return "Amount must be a number.";
    if (num <= 0) return "Amount must be greater than zero.";
    if (num > 1_000_000_000) return "Amount is unrealistically large.";
    return "";
  }

  if (field === "merchant") {
    const trimmed = (value as string).trim();
    if (trimmed.length === 0) return "Merchant is required.";
    if (trimmed.length < 2) return "Merchant must be at least 2 characters.";
    if (trimmed.length > 80) return "Merchant must be 80 characters or fewer.";
    return "";
  }

  if (field === "category") {
    if (!value) return "Pick a category.";
    return "";
  }

  if (field === "account") {
    if (!value) return "Pick an account.";
    return "";
  }

  if (field === "date") {
    if (!value) return "Pick a date.";
    const parsed = Date.parse(`${value as string}T00:00:00`);
    if (Number.isNaN(parsed)) return "That date is not valid.";
    const now = Date.now();
    const twoYearsAhead = now + 1000 * 60 * 60 * 24 * 365 * 2;
    const tenYearsAgo = now - 1000 * 60 * 60 * 24 * 365 * 10;
    if (parsed > twoYearsAhead) return "Date is too far in the future.";
    if (parsed < tenYearsAgo) return "Date is too far in the past.";
    return "";
  }

  if (field === "notes") {
    if ((value as string).length > 240) return "Notes must be 240 characters or fewer.";
    return "";
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

const isValid = computed(() => {
  const fields: (keyof FormState)[] = [
    "amount",
    "merchant",
    "category",
    "account",
    "date",
    "notes",
  ];
  return fields.every((f) => validateField(f) === "");
});

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
  // Touch every field so pending errors appear if the user never blurred them.
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
    const store = useTransactionsStore();
    const toast = useToastStore();
    const created = store.addTransaction({
      merchant: form.merchant.trim(),
      category: form.category,
      date: form.date,
      amount: Number(form.amount),
      type: form.type,
      account: form.account,
      status: form.status,
    });
    const signed = (created.type === "income" ? "+" : "−") + formatCurrency(created.amount);
    toast.success(
      `${created.merchant} · ${signed}`,
      `Added to ${created.account}`,
    );
    emit("created", created);
    open.value = false;
  } catch (err) {
    submitError.value =
      err instanceof Error ? err.message : "Could not save the transaction.";
  } finally {
    submitting.value = false;
  }
}

// Scroll lock + reset-on-open + focus the first field.
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
        aria-labelledby="transaction-modal-title"
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
            <!-- Decorative glow in the corner -->
            <div
              class="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-emerald-500/15 blur-[80px]"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-amber-500/10 blur-[80px]"
              aria-hidden="true"
            />

            <!-- Header -->
            <header
              class="relative flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5"
            >
              <div class="min-w-0">
                <h2
                  id="transaction-modal-title"
                  class="font-display text-xl font-semibold tracking-tight text-zinc-50"
                >
                  Add transaction
                </h2>
                <p class="mt-1 text-xs text-zinc-500">
                  Record income or an expense against one of your accounts.
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

            <!-- Form -->
            <form
              class="relative max-h-[calc(100vh-10rem)] space-y-5 overflow-y-auto px-6 py-6"
              novalidate
              @submit.prevent="handleSubmit"
            >
              <!-- Submit-level error banner -->
              <div
                v-if="submitError"
                class="flex items-start gap-2.5 rounded-lg border border-rose-500/25 bg-rose-500/[0.08] px-3 py-2.5"
                role="alert"
              >
                <AppIcon
                  name="alert-triangle"
                  :size="15"
                  class="mt-px shrink-0 text-rose-400"
                />
                <p class="text-sm text-rose-300">{{ submitError }}</p>
              </div>

              <!-- Type: segmented control -->
              <div>
                <span class="mb-1.5 block text-xs font-medium tracking-wide text-zinc-300 uppercase">
                  Type
                </span>
                <div
                  class="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1"
                >
                  <button
                    type="button"
                    class="focus-ring h-9 cursor-pointer rounded-md text-sm font-medium transition-all"
                    :class="
                      form.type === 'expense'
                        ? 'bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    "
                    @click="form.type = 'expense'"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <AppIcon name="trending-down" :size="14" :stroke-width="2.25" />
                      Expense
                    </span>
                  </button>
                  <button
                    type="button"
                    class="focus-ring h-9 cursor-pointer rounded-md text-sm font-medium transition-all"
                    :class="
                      form.type === 'income'
                        ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                    "
                    @click="form.type = 'income'"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <AppIcon name="trending-up" :size="14" :stroke-width="2.25" />
                      Income
                    </span>
                  </button>
                </div>
              </div>

              <!-- Amount with $ prefix -->
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

              <!-- Merchant -->
              <FormField
                v-slot="{ id }"
                label="Merchant"
                :error="touched.merchant ? errors.merchant : ''"
              >
                <TextInput
                  :id="id"
                  v-model="form.merchant"
                  :placeholder="form.type === 'income' ? 'Northwind Labs' : 'Whole Foods Market'"
                  :invalid="touched.merchant && !!errors.merchant"
                  @input="touched.merchant && runFieldValidation('merchant')"
                />
              </FormField>

              <!-- Category + Account -->
              <div class="grid gap-5 sm:grid-cols-2">
                <FormField
                  v-slot="{ id }"
                  label="Category"
                  :error="touched.category ? errors.category : ''"
                >
                  <SelectField
                    :id="id"
                    v-model="form.category"
                    :invalid="touched.category && !!errors.category"
                    @change="markTouched('category')"
                  >
                    <option value="" disabled>Choose a category</option>
                    <option
                      v-for="category in categoryOptions"
                      :key="category"
                      :value="category"
                    >
                      {{ category }}
                    </option>
                  </SelectField>
                </FormField>

                <FormField
                  v-slot="{ id }"
                  label="Account"
                  :error="touched.account ? errors.account : ''"
                >
                  <SelectField
                    :id="id"
                    v-model="form.account"
                    :invalid="touched.account && !!errors.account"
                    @change="markTouched('account')"
                  >
                    <option value="" disabled>Choose an account</option>
                    <option v-for="acc in accounts" :key="acc.id" :value="acc.name">
                      {{ acc.name }}
                    </option>
                  </SelectField>
                </FormField>
              </div>

              <!-- Date + Status -->
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

                <FormField v-slot="{ id }" label="Status">
                  <SelectField :id="id" v-model="form.status">
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </SelectField>
                </FormField>
              </div>

              <!-- Notes -->
              <FormField
                v-slot="{ id }"
                label="Notes"
                optional
                :error="touched.notes ? errors.notes : ''"
                :hint="!touched.notes ? `${form.notes.length}/240 characters` : ''"
              >
                <textarea
                  :id="id"
                  v-model="form.notes"
                  rows="2"
                  maxlength="240"
                  placeholder="Anything worth remembering about this transaction…"
                  class="focus-ring block w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-zinc-100 transition-colors placeholder:text-zinc-500 hover:bg-white/[0.05] focus:border-emerald-500/40 focus:bg-white/[0.06]"
                  :aria-invalid="(touched.notes && !!errors.notes) || undefined"
                  @input="touched.notes && runFieldValidation('notes')"
                />
              </FormField>
            </form>

            <!-- Footer -->
            <footer
              class="relative flex items-center justify-end gap-2 border-t border-white/[0.06] bg-zinc-950/40 px-6 py-4"
            >
              <AppButton
                variant="ghost"
                :disabled="submitting"
                @click="close"
              >
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
                  name="plus"
                  :size="14"
                  :stroke-width="2.25"
                />
                {{ submitting ? "Saving…" : "Add transaction" }}
              </AppButton>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
