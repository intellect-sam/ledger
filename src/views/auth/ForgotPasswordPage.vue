<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import AuthLayout from "@/components/layout/AuthLayout.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import FormField from "@/components/ui/FormField.vue";
import TextInput from "@/components/ui/TextInput.vue";

const email = ref("");

/** UI-only. Swap for your store once the reset request is wired up. */
const submitted = ref(false);

const panelPoints = [
  "Reset links expire after 30 minutes",
  "Accounts and history stay untouched",
  "Two-factor codes still apply on new devices",
];
</script>

<template>
  <AuthLayout
    :title="submitted ? 'Check your inbox' : 'Reset your password'"
    :subtitle="
      submitted
        ? `We sent a reset link to ${email}.`
        : 'Enter the email on your account and we will send you a reset link.'
    "
    panel-title="Locked out, briefly."
    panel-text="A reset changes your password and nothing else. Balances, budgets, and history are never affected."
    :panel-points="panelPoints"
  >
    <form v-if="!submitted" class="space-y-5" @submit.prevent="submitted = true">
      <FormField v-slot="{ id }" label="Email">
        <TextInput
          :id="id"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
        />
      </FormField>

      <AppButton type="submit" variant="accent" block>Send reset link</AppButton>
    </form>

    <div v-else>
      <div
        class="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4"
      >
        <div
          class="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-emerald-500/15 blur-2xl"
          aria-hidden="true"
        />
        <p class="relative flex items-center gap-2 text-sm font-medium text-zinc-100">
          <AppIcon name="mail" :size="15" class="text-emerald-400" />
          Reset link sent
        </p>
        <p class="relative mt-1.5 text-xs leading-relaxed text-zinc-400">
          It can take a minute to arrive. If it hasn't, check your spam folder before sending
          another.
        </p>
      </div>

      <AppButton class="mt-4" variant="outline" block @click="submitted = false">
        Send again
      </AppButton>
    </div>

    <template #footer>
      Remembered it?
      <RouterLink
        to="/login"
        class="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
      >
        Back to sign in
      </RouterLink>
    </template>
  </AuthLayout>
</template>
