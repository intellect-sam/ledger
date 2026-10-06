<script setup lang="ts">
import { RouterLink } from "vue-router";
import BrandMark from "@/components/ui/BrandMark.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    panelTitle?: string;
    panelText?: string;
    panelPoints?: string[];
  }>(),
  { panelPoints: () => [] },
);
</script>

<template>
  <div class="relative grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
    <!-- Form side -->
    <div class="relative flex flex-col px-6 py-8 sm:px-10">
      <RouterLink to="/" class="self-start" aria-label="Ledger home">
        <BrandMark />
      </RouterLink>

      <div class="flex flex-1 items-center justify-center py-10">
        <div class="w-full max-w-sm">
          <h1 class="font-display text-3xl font-semibold tracking-tight text-zinc-50">
            {{ title }}
          </h1>
          <p v-if="subtitle" class="mt-2 text-sm leading-relaxed text-zinc-400">
            {{ subtitle }}
          </p>

          <div class="mt-8">
            <slot />
          </div>
        </div>
      </div>

      <p v-if="$slots.footer" class="text-center text-sm text-zinc-500">
        <slot name="footer" />
      </p>
    </div>

    <!-- Showcase panel. Rich, premium — the "why Ledger" moment. -->
    <div
      class="relative hidden overflow-hidden border-l border-white/[0.06] lg:flex lg:items-center lg:p-14"
    >
      <!-- Layered atmospheric background -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-amber-500/[0.05]"
        aria-hidden="true"
      />
      <div
        class="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        class="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]"
        aria-hidden="true"
      />
      <!-- Subtle grid texture -->
      <div
        class="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]"
        aria-hidden="true"
      />

      <div class="relative w-full max-w-md">
        <slot name="panel">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-emerald-300 uppercase"
          >
            <span class="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            September · in focus
          </span>

          <h2
            v-if="panelTitle"
            class="font-display mt-6 text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-zinc-50"
          >
            {{ panelTitle }}
          </h2>
          <p v-if="panelText" class="mt-4 text-base leading-relaxed text-zinc-400">
            {{ panelText }}
          </p>

          <ul v-if="panelPoints.length" class="mt-10 space-y-4">
            <li
              v-for="point in panelPoints"
              :key="point"
              class="flex items-start gap-3 text-sm text-zinc-300"
            >
              <span
                class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
              >
                <AppIcon name="check" :size="12" :stroke-width="3" />
              </span>
              {{ point }}
            </li>
          </ul>

          <!-- Hairline divider in gold -->
          <div class="hairline-gold mt-12" aria-hidden="true" />

          <p class="mt-6 text-xs tracking-wide text-zinc-500 uppercase">
            Trusted by 42,000 households · SOC 2 Type II
          </p>
        </slot>
      </div>
    </div>
  </div>
</template>
