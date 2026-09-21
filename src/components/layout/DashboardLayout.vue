<script setup lang="ts">
import { ref } from "vue";
import AppSidebar from "./AppSidebar.vue";
import AppTopbar from "./AppTopbar.vue";

defineProps<{
  title: string;
  subtitle?: string;
}>();

const sidebarOpen = ref(false);
</script>

<template>
  <div class="lg:grid lg:min-h-screen lg:grid-cols-[16rem_minmax(0,1fr)]">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex min-h-screen min-w-0 flex-col">
      <AppTopbar @toggle-sidebar="sidebarOpen = true" />

      <main class="mx-auto w-full max-w-[90rem] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <header class="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div class="min-w-0">
            <h1 class="text-title font-semibold tracking-tight text-zinc-900">{{ title }}</h1>
            <p v-if="subtitle" class="mt-1 text-sm text-zinc-500">{{ subtitle }}</p>
          </div>

          <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
            <slot name="actions" />
          </div>
        </header>

        <slot />
      </main>
    </div>
  </div>
</template>
