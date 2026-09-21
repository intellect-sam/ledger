<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import AuthLayout from "@/components/layout/AuthLayout.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import router from "@/router";

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore)

const name = ref("");
const email = ref("");
const password = ref("");
const agreed = ref(false);
const showPassword = ref(false);

const strength = computed(() => {
  const value = password.value;
  if (value.length === 0) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
});

const strengthLabel = computed(
  () => ["", "Weak", "Fair", "Strong"][strength.value] ?? "",
);

const panelPoints = [
  "Import accounts in under two minutes",
  "Category budgets with pace tracking",
  "Twelve months of history from day one",
];

async function handleSubmit() {
  if (!name.value || !email.value || !password.value) {
    authStore.error = 'Please fill in all fields'
    return
  }
  if (!agreed.value) {
    alert("You must agree to the terms and privacy policy.");
    return;
  }

  const success = await authStore.signUp(email.value, password.value, name.value);
  if (success){
    router.push("/dashboard")
  }
}


</script>

<template>
  <AuthLayout
    title="Create your account"
    subtitle="Free to start. No card required."
    panel-title="The month, closed properly."
    panel-text="Ledger keeps balances, budgets, and bills in one ledger so nothing waits until the statement."
    :panel-points="panelPoints"
  >
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div
        v-if="error"
        class="flex items-start gap-2.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-2.5"
        role="alert"
      >
        <AppIcon name="alert-triangle" :size="15" class="mt-px shrink-0 text-rose-600" />
        <p class="text-sm text-rose-700">{{ error }}</p>
      </div>

      <FormField v-slot="{ id }" label="Full name">
        <TextInput :id="id" v-model="name" autocomplete="name" placeholder="Sam Rivera" />
      </FormField>

      <FormField v-slot="{ id }" label="Email">
        <TextInput
          :id="id"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
        />
      </FormField>

      <FormField v-slot="{ id }" label="Password">
        <TextInput
          :id="id"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="At least 8 characters"
        >
          <template #trailing>
            <button
              type="button"
              class="focus-ring grid size-8 cursor-pointer place-items-center rounded text-zinc-400 transition-colors hover:text-zinc-700"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <AppIcon :name="showPassword ? 'eye-off' : 'eye'" :size="16" />
            </button>
          </template>
        </TextInput>

        <div v-if="password.length > 0" class="mt-2.5">
          <div class="flex gap-1.5">
            <span
              v-for="segment in 3"
              :key="segment"
              class="h-1 flex-1 rounded-full transition-colors"
              :class="segment <= strength ? 'bg-accent' : 'bg-zinc-200'"
            />
          </div>
          <p class="mt-1.5 text-xs text-zinc-500">{{ strengthLabel }}</p>
        </div>
      </FormField>

      <label class="flex cursor-pointer items-start gap-2.5 text-sm text-zinc-600">
        <input
          v-model="agreed"
          type="checkbox"
          class="mt-0.5 size-4 cursor-pointer rounded border-zinc-300"
        />
        <span>
          I agree to the
          <a href="#" class="font-medium text-accent transition-colors hover:text-accent-hover">
            Terms
          </a>
          and
          <a href="#" class="font-medium text-accent transition-colors hover:text-accent-hover">
            Privacy Policy
          </a>
        </span>
      </label>

      <AppButton type="submit" variant="accent" block :disabled="loading">
        {{ loading ? "Creating account..." : "Create account" }}
      </AppButton>
    </form>

    <template #footer>
      Already have an account?
      <RouterLink
        to="/login"
        class="font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Sign in
      </RouterLink>
    </template>
  </AuthLayout>
</template>
