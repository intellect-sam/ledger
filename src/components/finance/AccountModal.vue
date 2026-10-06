<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";
import SelectField from "@/components/ui/SelectField.vue";
import { useAccountsStore } from "@/stores/accounts";
import { useToastStore } from "@/stores/toast";
import { formatCurrency } from "@/utils/format";
import type { Account } from "@/data/mock";

const open = defineModel<boolean>("open", { default: false });

const KINDS: { value: Account["kind"]; label: string; icon: string }[] = [
  { value: "checking", label: "Checking", icon: "banknote" },
  { value: "savings", label: "Savings", icon: "coins" },
  { value: "credit", label: "Credit card", icon: "credit-card" },
  { value: "investment", label: "Investment", icon: "trending-up" },
  { value: "cash", label: "Cash", icon: "wallet" },
];

interface FormState {
  name: string;
  kind: Account["kind"];
  detail: string;
  balance: string;
}

const initialForm = (): FormState => ({
  name: "",
  kind: "checking",
  detail: "",
  balance: "",
});

const form = reactive<FormState>(initialForm());
const errors = reactive<Record<keyof FormState, string>>({
  name: "",
  kind: "",
  detail: "",
  balance: "",
});
const touched = reactive<Record<keyof FormState, boolean>>({
  name: false,
  kind: false,
  detail: false,
  balance: false,
});

const submitting = ref(false);
const submitError = ref("");

function validateField(field: keyof FormState): string {
  const value = form[field];
  if (field === "name") {
    const trimmed = (value as string).trim();
    if (!trimmed) return "Account name is required.";
    if (trimmed.length < 2) return "Account name must be at least 2 characters.";
    if (trimmed.length > 50) return "Account name must be 50 characters or fewer.";
    return "";
  }
  if (field === "detail") {
    if ((value as string).length > 60) return "Detail must be 60 characters or fewer.";
    return "";
  }
  if (field === "balance") {
    if (value === "") return "Enter the current balance.";
    const num = Number(value);
    if (Number.isNaN(num)) return "Balance must be a number.";
    if (Math.abs(num) > 1_000_000_000) return "Balance is unrealistically large.";
    if (form.kind !== "credit" && num < 0) {
      return "Only credit cards can have a negative balance.";
    }
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
    const accountsStore = useAccountsStore();
    const toast = useToastStore();
    const balance = Number(form.balance);
    const created = accountsStore.addAccount({
      name: form.name.trim(),
      kind: form.kind,
      detail: form.detail.trim() || "—",
      balance,
      change: 0,
    });
    toast.success(
      `${created.name} linked`,
      `Opening balance ${formatCurrency(created.balance)}`,
    );
    open.value = false;
  } catch (err) {
    submitError.value =
      err instanceof Error ? err.message : "Could not link the account.";
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
        aria-labelledby="account-modal-title"
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
              class="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-emerald-500/15 blur-[80px]"
              aria-hidden="true"
            />

            <header
              class="relative flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5"
            >
              <div class="min-w-0">
                <h2
                  id="account-modal-title"
                  class="font-display text-xl font-semibold tracking-tight text-zinc-50"
                >
                  Link a new account
                </h2>
                <p class="mt-1 text-xs text-zinc-500">
                  Add a checking, savings, credit card, or investment account.
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

              <!-- Type as segmented chips -->
              <div>
                <span class="mb-1.5 block text-xs font-medium tracking-wide text-zinc-300 uppercase">
                  Type
                </span>
                <div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  <button
                    v-for="kind in KINDS"
                    :key="kind.value"
                    type="button"
                    class="focus-ring flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-all"
                    :class="
                      form.kind === kind.value
                        ? 'border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-300'
                        : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/15 hover:text-zinc-200'
                    "
                    @click="form.kind = kind.value; runFieldValidation('balance')"
                  >
                    <AppIcon :name="kind.icon" :size="16" :stroke-width="2" />
                    {{ kind.label }}
                  </button>
                </div>
              </div>

              <FormField
                v-slot="{ id }"
                label="Account name"
                :error="touched.name ? errors.name : ''"
              >
                <TextInput
                  :id="id"
                  v-model="form.name"
                  placeholder="Everyday Checking"
                  :invalid="touched.name && !!errors.name"
                  @input="touched.name && runFieldValidation('name')"
                />
              </FormField>

              <FormField
                v-slot="{ id }"
                label="Institution"
                optional
                :error="touched.detail ? errors.detail : ''"
                :hint="!touched.detail ? 'E.g. “Chase •• 4291”.' : ''"
              >
                <TextInput
                  :id="id"
                  v-model="form.detail"
                  placeholder="Chase •• 4291"
                  :invalid="touched.detail && !!errors.detail"
                  @input="touched.detail && runFieldValidation('detail')"
                />
              </FormField>

              <FormField
                v-slot="{ id }"
                :label="form.kind === 'credit' ? 'Current balance (can be negative)' : 'Opening balance'"
                :error="touched.balance ? errors.balance : ''"
              >
                <TextInput
                  :id="id"
                  v-model="form.balance"
                  type="number"
                  placeholder="0.00"
                  :invalid="touched.balance && !!errors.balance"
                  @input="touched.balance && runFieldValidation('balance')"
                >
                  <template #leading>
                    <span class="text-sm font-medium text-zinc-500">$</span>
                  </template>
                </TextInput>
              </FormField>
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
                <AppIcon v-if="!submitting" name="plus" :size="14" :stroke-width="2.25" />
                {{ submitting ? "Linking…" : "Link account" }}
              </AppButton>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
