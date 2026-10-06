<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import BrandMark from "@/components/ui/BrandMark.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>

<template>
  <div class="relative flex min-h-screen flex-col px-6 py-8 sm:px-10">
    <!-- Aurora backdrop -->
    <div
      class="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div class="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[140px]" />
      <div class="absolute -top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[140px]" />
    </div>

    <RouterLink to="/" class="relative self-start" aria-label="Ledger home">
      <BrandMark />
    </RouterLink>

    <div class="relative flex flex-1 items-center justify-center py-20">
      <div class="max-w-md text-center">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-amber-300 uppercase"
        >
          <AppIcon name="alert-triangle" :size="12" :stroke-width="2.25" />
          404 · page not found
        </span>

        <h1 class="font-display mt-6 text-5xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
          We couldn't find that.
        </h1>
        <p class="mt-5 text-base leading-relaxed text-zinc-400">
          The page you were looking for has moved, been renamed, or never existed.
          Head back to a place you know.
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <AppButton
            :to="authStore.user ? '/dashboard' : '/'"
            variant="accent"
          >
            <AppIcon name="arrow-left" :size="14" :stroke-width="2.25" />
            {{ authStore.user ? "Back to dashboard" : "Back to home" }}
          </AppButton>
          <AppButton v-if="!authStore.user" to="/login" variant="outline">Sign in</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
