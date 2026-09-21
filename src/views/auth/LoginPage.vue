<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import AuthLayout from "@/components/layout/AuthLayout.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import router from "@/router";

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

/** UI-only form state — hand these to your store when you wire up auth. */
const email = ref("");
const password = ref("");
const remember = ref(true);
const showPassword = ref(false);

const panelPoints = [
  "Every account in a single ledger",
  "Budgets tracked against the month's pace",
  "Bills and autopay in one list",
];

const handleSubmit = async () => {
  if (!email.value || !password.value){
    authStore.error = "fill the email and password"
    return
  }
  const success = await authStore.signIn(email.value, password.value)
  if (success){
    router.push("/dashboard")
  } 
}
</script>

<template>
  <AuthLayout
    title="Sign in to Ledger"
    subtitle="Welcome back. Pick up where the month left off."
    panel-title="Your money, in focus."
    panel-text="One ledger for balances, budgets, and bills, updated as the month moves."
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
          autocomplete="current-password"
          placeholder="••••••••"
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
      </FormField>

      <div class="flex items-center justify-between gap-4">
        <label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
          <input
            v-model="remember"
            type="checkbox"
            class="size-4 cursor-pointer rounded border-zinc-300"
          />
          Remember me
        </label>
        <RouterLink
          to="/forgot-password"
          class="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Forgot password?
        </RouterLink>
      </div>

      <AppButton type="submit" variant="accent" block :disabled="loading">{{ loading ? "loading" : "Sign in" }}</AppButton>
    </form>

    <template #footer>
      Don't have an account?
      <RouterLink
        to="/register"
        class="font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Create one
      </RouterLink>
    </template>
  </AuthLayout>
</template>
