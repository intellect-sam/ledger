<script setup lang="ts">
import { RouterLink } from "vue-router";
import BrandMark from "@/components/ui/BrandMark.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

/**
 * Split auth shell: a centred form column and, on wide screens, a tinted
 * product panel. Pages pass copy via props, or replace the panel entirely
 * with the `#panel` slot.
 */
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
  <div class="grid min-h-screen lg:grid-cols-2">
    <div class="flex flex-col px-6 py-8 sm:px-10">
      <RouterLink to="/" class="self-start" aria-label="Ledger home">
        <BrandMark />
      </RouterLink>

      <div class="flex flex-1 items-center justify-center py-10">
        <div class="w-full max-w-sm">
          <h1 class="text-2xl font-semibold tracking-tight text-zinc-900">{{ title }}</h1>
          <p v-if="subtitle" class="mt-1.5 text-sm text-zinc-500">{{ subtitle }}</p>

          <div class="mt-7">
            <slot />
          </div>
        </div>
      </div>

      <p v-if="$slots.footer" class="text-center text-sm text-zinc-500">
        <slot name="footer" />
      </p>
    </div>

    <div class="hidden border-l border-zinc-200 bg-accent-soft lg:flex lg:items-center lg:p-12">
      <div class="w-full max-w-md">
        <slot name="panel">
          <h2
            v-if="panelTitle"
            class="text-2xl font-semibold tracking-tight text-balance text-zinc-900"
          >
            {{ panelTitle }}
          </h2>
          <p v-if="panelText" class="mt-3 text-sm leading-relaxed text-zinc-600">
            {{ panelText }}
          </p>

          <ul v-if="panelPoints.length" class="mt-7 space-y-3">
            <li
              v-for="point in panelPoints"
              :key="point"
              class="flex items-start gap-2.5 text-sm text-zinc-700"
            >
              <AppIcon name="check" :size="15" :stroke-width="2.5" class="mt-0.5 text-accent" />
              {{ point }}
            </li>
          </ul>
        </slot>
      </div>
    </div>
  </div>
</template>
