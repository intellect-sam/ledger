<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import AuthLayout from "@/components/layout/AuthLayout.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);
const route = useRoute();
const router = useRouter();

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
  if (!email.value || !password.value) {
    authStore.error = "Enter your email and password.";
    return;
  }
  const success = await authStore.signIn(email.value, password.value);
  if (success) {
    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : null;
    router.push(redirect ?? "/dashboard");
  }
};
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
        class="flex items-start gap-2.5 rounded-lg border border-rose-500/25 bg-rose-500/[0.08] px-3 py-2.5"
        role="alert"
      >
        <AppIcon name="alert-triangle" :size="15" class="mt-px shrink-0 text-rose-400" />
        <p class="text-sm text-rose-300">{{ error }}</p>
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
              class="focus-ring grid size-8 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:text-zinc-200"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <AppIcon :name="showPassword ? 'eye-off' : 'eye'" :size="16" />
            </button>
          </template>
        </TextInput>
      </FormField>

      <div class="flex items-center justify-between gap-4">
        <label class="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
          <input
            v-model="remember"
            type="checkbox"
            class="size-4 cursor-pointer rounded border-white/15 bg-white/5"
          />
          Remember me
        </label>
        <RouterLink
          to="/forgot-password"
          class="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
        >
          Forgot password?
        </RouterLink>
      </div>

      <AppButton type="submit" variant="accent" block :disabled="loading">
        {{ loading ? "Signing in…" : "Sign in" }}
      </AppButton>

      <div class="flex items-center gap-3 pt-1">
        <span class="h-px flex-1 bg-white/[0.07]" />
        <span class="text-[11px] tracking-wide text-zinc-600 uppercase">or continue with</span>
        <span class="h-px flex-1 bg-white/[0.07]" />
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button
          type="button"
          class="focus-ring inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07]"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.98 10.98 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.07H2.18A10.98 10.98 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A10.98 10.98 0 0 0 2.18 7.07l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/>
          </svg>
          Google
        </button>
        <button
          type="button"
          class="focus-ring inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07]"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Apple
        </button>
      </div>
    </form>

    <template #footer>
      Don't have an account?
      <RouterLink
        to="/register"
        class="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
      >
        Create one
      </RouterLink>
    </template>
  </AuthLayout>
</template>
