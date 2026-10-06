<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";
import SelectField from "@/components/ui/SelectField.vue";
import { useBudgetsStore } from "@/stores/budgets";
import { useToastStore } from "@/stores/toast";
import { palette } from "@/data/mock";
import { categoryIcon } from "@/utils/category";
import { formatCurrency } from "@/utils/format";

const open = defineModel<boolean>("open", { default: false });

const budgetsStore = useBudgetsStore();
const { items: existingBudgets } = storeToRefs(budgetsStore);

const CATEGORY_CHOICES = [
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
];

const COLOR_CHOICES: { name: string; value: string }[] = [
  { name: "Emerald", value: palette.green },
  { name: "Gold", value: palette.amber },
  { name: "Teal", value: palette.teal },
  { name: "Coral", value: palette.brick },
  { name: "Lavender", value: palette.plum },
  { name: "Blue", value: palette.steel },
  { name: "Slate", value: palette.slate },
];

interface FormState {
  category: string;
  limit: string;
  color: string;
}

const initialForm = (): FormState => ({
  category: "",
  limit: "",
  color: palette.green,
});

const form = reactive<FormState>(initialForm());
const errors = reactive<Record<keyof FormState, string>>({
  category: "",
  limit: "",
  color: "",
});
const touched = reactive<Record<keyof FormState, boolean>>({
  category: false,
  limit: false,
  color: false,
});

const submitting = ref(false);
const submitError = ref("");

const takenCategories = computed(
  () => new Set(existingBudgets.value.map((b) => b.category.toLowerCase())),
);

const categoryOptions = computed(() =>
  CATEGORY_CHOICES.filter((c) => !takenCategories.value.has(c.toLowerCase())),
);

function validateField(field: keyof FormState): string {
  const value = form[field];
  if (field === "category") {
    const trimmed = (value as string).trim();
    if (!trimmed) return "Pick or enter a category.";
    if (trimmed.length < 2) return "Category must be at least 2 characters.";
    if (trimmed.length > 32) return "Category must be 32 characters or fewer.";
    if (takenCategories.value.has(trimmed.toLowerCase())) {
      return "You already have a budget for that category.";
    }
    return "";
  }
  if (field === "limit") {
    if (!value) return "Enter a monthly limit.";
    const num = Number(value);
    if (Number.isNaN(num)) return "Limit must be a number.";
    if (num <= 0) return "Limit must be greater than zero.";
    if (num > 1_000_000) return "Limit is unrealistically large.";
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

const previewIcon = computed(() => categoryIcon(form.category || "Other"));

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
    const toast = useToastStore();
    const created = budgetsStore.addBudget({
      category: form.category.trim(),
      icon: previewIcon.value,
      limit: Number(form.limit),
      color: form.color,
    });
    toast.success(
      `${created.category} budget added`,
      `${formatCurrency(created.limit, false)} per month`,
    );
    open.value = false;
  } catch (err) {
    submitError.value =
      err instanceof Error ? err.message : "Could not create the budget.";
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
        aria-labelledby="budget-modal-title"
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
              :style="{ backgroundColor: `${form.color}30` }"
              aria-hidden="true"
            />

            <header
              class="relative flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5"
            >
              <div class="min-w-0">
                <h2
                  id="budget-modal-title"
                  class="font-display text-xl font-semibold tracking-tight text-zinc-50"
                >
                  New budget
                </h2>
                <p class="mt-1 text-xs text-zinc-500">
                  Set a monthly limit for a spending category.
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

              <!-- Live preview -->
              <div
                class="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <span
                  class="grid size-10 shrink-0 place-items-center rounded-lg ring-1 ring-inset"
                  :style="{
                    backgroundColor: `${form.color}1f`,
                    color: form.color,
                    boxShadow: `inset 0 0 0 1px ${form.color}3a`,
                  }"
                >
                  <AppIcon :name="previewIcon" :size="18" :stroke-width="2" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-zinc-100">
                    {{ form.category || "Category" }}
                  </p>
                  <p class="text-xs text-zinc-500 tabular-nums">
                    {{ form.limit ? formatCurrency(Number(form.limit), false) : "$0" }}
                    per month
                  </p>
                </div>
              </div>

              <!-- Category: dropdown of unused suggestions + free-form text -->
              <FormField
                v-slot="{ id }"
                label="Category"
                :error="touched.category ? errors.category : ''"
                :hint="!touched.category && categoryOptions.length === 0 ? 'All suggested categories are taken — enter your own.' : ''"
              >
                <div class="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <TextInput
                    :id="id"
                    v-model="form.category"
                    placeholder="e.g. Dining, Pets, Hobbies…"
                    :invalid="touched.category && !!errors.category"
                    @input="touched.category && runFieldValidation('category')"
                  />
                  <SelectField
                    v-if="categoryOptions.length > 0"
                    v-model="form.category"
                    class="w-full sm:w-44"
                    @change="markTouched('category')"
                  >
                    <option value="">Suggestions…</option>
                    <option v-for="c in categoryOptions" :key="c" :value="c">{{ c }}</option>
                  </SelectField>
                </div>
              </FormField>

              <FormField
                v-slot="{ id }"
                label="Monthly limit"
                :error="touched.limit ? errors.limit : ''"
              >
                <TextInput
                  :id="id"
                  v-model="form.limit"
                  type="number"
                  placeholder="0.00"
                  :invalid="touched.limit && !!errors.limit"
                  @input="touched.limit && runFieldValidation('limit')"
                >
                  <template #leading>
                    <span class="text-sm font-medium text-zinc-500">$</span>
                  </template>
                </TextInput>
              </FormField>

              <div>
                <span class="mb-2 block text-xs font-medium tracking-wide text-zinc-300 uppercase">
                  Color
                </span>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="choice in COLOR_CHOICES"
                    :key="choice.value"
                    type="button"
                    class="focus-ring size-8 cursor-pointer rounded-full ring-2 ring-offset-2 ring-offset-zinc-900 transition-all"
                    :class="form.color === choice.value ? 'scale-105' : 'ring-transparent hover:scale-105'"
                    :style="{
                      backgroundColor: choice.value,
                      boxShadow: form.color === choice.value ? `0 0 12px ${choice.value}aa` : 'none',
                    }"
                    :aria-label="choice.name"
                    :aria-pressed="form.color === choice.value"
                    @click="form.color = choice.value"
                  />
                </div>
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
                <AppIcon v-if="!submitting" name="plus" :size="14" :stroke-width="2.25" />
                {{ submitting ? "Creating…" : "Create budget" }}
              </AppButton>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
