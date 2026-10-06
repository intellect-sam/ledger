<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";
import Avatar from "@/components/ui/Avatar.vue";
import BrandMark from "@/components/ui/BrandMark.vue";
import { navItems, summary } from "@/data/mock";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import router from "@/router";

defineProps<{ open: boolean }>();
defineEmits<{ close: [] }>();

const authStore = useAuthStore();
const toast = useToastStore();

async function handleSignOut() {
  await authStore.signOut();
  toast.info("Signed out", "See you back soon.");
  router.push("/login");
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
    @click="$emit('close')"
  />

  <aside
    class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-auto lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Subtle sheen along the top -->
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/[0.04] to-transparent"
      aria-hidden="true"
    />

    <div class="relative flex items-center gap-2.5 px-4 py-5">
      <BrandMark class="flex-1" />
      <button
        type="button"
        class="focus-ring grid size-7 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200 lg:hidden"
        aria-label="Close navigation"
        @click="$emit('close')"
      >
        <AppIcon name="x" :size="16" />
      </button>
    </div>

    <nav class="relative flex-1 overflow-y-auto px-3 pb-4">
      <p class="px-2 pt-2 pb-2 text-[10px] font-semibold tracking-[0.14em] text-zinc-600 uppercase">
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
          class="focus-ring group relative mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all"
          :class="
            isActive
              ? 'bg-emerald-500/[0.10] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20'
              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
          "
          @click="navigate"
        >
          <span
            v-if="isActive"
            class="absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            aria-hidden="true"
          />
          <AppIcon
            :name="item.icon"
            :size="16"
            :stroke-width="isActive ? 2 : 1.75"
            :class="isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'"
          />
          {{ item.label }}
        </a>
      </RouterLink>

      <p class="px-2 pt-6 pb-2 text-[10px] font-semibold tracking-[0.14em] text-zinc-600 uppercase">
        Workspace
      </p>

      <RouterLink
        v-slot="{ href, navigate, isActive }"
        to="/reports"
        custom
      >
        <a
          :href="href"
          class="focus-ring group relative mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all"
          :class="
            isActive
              ? 'bg-emerald-500/[0.10] font-medium text-emerald-300 ring-1 ring-inset ring-emerald-500/20'
              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
          "
          @click="navigate"
        >
          <span
            v-if="isActive"
            class="absolute inset-y-1.5 left-0 w-0.5 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            aria-hidden="true"
          />
          <AppIcon
            name="receipt"
            :size="16"
            :stroke-width="isActive ? 2 : 1.75"
            :class="isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'"
          />
          Reports
        </a>
      </RouterLink>

      <RouterLink
        v-slot="{ href, navigate, isActive }"
        to="/settings#security"
        custom
      >
        <a
          :href="href"
          class="focus-ring group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors"
          :class="
            isActive
              ? 'text-emerald-300'
              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
          "
          @click="navigate"
        >
          <AppIcon
            name="shield"
            :size="16"
            :class="isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'"
          />
          Security
        </a>
      </RouterLink>
    </nav>

    <!-- Savings-rate mini card with a soft emerald glow. -->
    <div class="relative px-3 pb-3">
      <div
        class="relative overflow-hidden rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3.5"
      >
        <div
          class="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-emerald-500/20 blur-2xl"
          aria-hidden="true"
        />
        <div class="relative flex items-baseline justify-between gap-2">
          <p class="text-[11px] tracking-wide text-zinc-500 uppercase">Savings rate</p>
          <p class="text-sm font-semibold text-emerald-300 tabular-nums">
            {{ summary.savingsRate }}%
          </p>
        </div>
        <p class="relative mt-1 text-[11px] text-zinc-500">
          +{{ summary.savingsRateChange }} pts vs. last month
        </p>
      </div>
    </div>

    <div class="relative border-t border-white/[0.06] p-2.5">
      <div class="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
        <Avatar name="Sam Rivera" size="sm" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-medium text-zinc-100">Sam Rivera</p>
          <p class="truncate text-[11px] text-zinc-500">sam@ledger.app</p>
        </div>
        <button
          type="button"
          @click="handleSignOut"
          class="focus-ring grid size-7 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-rose-400"
          aria-label="Sign out"
        >
          <AppIcon name="logout" :size="15" />
        </button>
      </div>
    </div>
  </aside>
</template>
