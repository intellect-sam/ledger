<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";
import Avatar from "@/components/ui/Avatar.vue";
import BrandMark from "@/components/ui/BrandMark.vue";
import { navItems, summary } from "@/data/mock";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const authStore = useAuthStore();

function handleSignOut() {
  authStore.signOut();
  router.push('/login')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-zinc-900/20 lg:hidden"
    @click="$emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-auto lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center gap-2.5 px-4 py-4">
      <BrandMark class="flex-1" />
      <button
        type="button"
        class="focus-ring grid size-7 cursor-pointer place-items-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 lg:hidden"
        aria-label="Close navigation"
        @click="$emit('close')"
      >
        <AppIcon name="x" :size="16" />
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto px-2 pb-4">
      <p class="px-2 pt-2 pb-1.5 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
        Menu
      </p>

      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        v-slot="{ href, navigate, isActive }"
        :to="item.to"
        custom
      >
        <a
          :href="href"
          class="focus-ring mb-0.5 flex items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors"
          :class="
            isActive
              ? 'bg-accent-soft font-medium text-accent'
              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          "
          @click="navigate"
        >
          <AppIcon :name="item.icon" :size="16" :class="isActive ? 'text-accent' : 'text-zinc-400'" />
          {{ item.label }}
        </a>
      </RouterLink>

      <p class="px-2 pt-5 pb-1.5 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
        Workspace
      </p>

      <a
        href="#"
        class="focus-ring mb-0.5 flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
      >
        <AppIcon name="receipt" :size="16" class="text-zinc-400" />
        Reports
      </a>
      <a
        href="#"
        class="focus-ring flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
      >
        <AppIcon name="shield" :size="16" class="text-zinc-400" />
        Security
      </a>
    </nav>

    <div class="px-2 pb-2">
      <div class="rounded-md border border-zinc-200 p-3">
        <div class="flex items-baseline justify-between gap-2">
          <p class="text-xs text-zinc-500">Savings rate</p>
          <p class="text-sm font-semibold text-zinc-900 tabular-nums">{{ summary.savingsRate }}%</p>
        </div>
        <p class="mt-1 text-[11px] text-zinc-500">
          {{ summary.savingsRateChange }} pts above last month
        </p>
      </div>
    </div>

    <div class="border-t border-zinc-200 p-2">
      <div class="flex items-center gap-2.5 rounded-md px-2 py-1.5">
        <Avatar name="Sam Rivera" size="sm" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-medium text-zinc-900">Sam Rivera</p>
          <p class="truncate text-[11px] text-zinc-500">sam@ledger.app</p>
        </div>
        <button
          type="button"
          @click="handleSignOut"
          class="focus-ring grid size-7 cursor-pointer place-items-center rounded text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Sign out"
        >
          <AppIcon name="logout" :size="15" />
        </button>
      </div>
    </div>
  </aside>
</template>
