<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import Avatar from "@/components/ui/Avatar.vue";

defineEmits<{ toggleSidebar: [] }>();
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-zinc-950/70 px-4 backdrop-blur-xl sm:px-6"
  >
    <button
      type="button"
      class="focus-ring grid size-9 cursor-pointer place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 lg:hidden"
      aria-label="Open navigation"
      @click="$emit('toggleSidebar')"
    >
      <AppIcon name="menu" :size="18" />
    </button>

    <div class="relative w-full max-w-md">
      <AppIcon
        name="search"
        :size="15"
        class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-500"
      />
      <input
        type="search"
        placeholder="Search transactions, accounts, bills…"
        class="focus-ring h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pr-14 pl-9 text-sm text-zinc-100 transition-colors placeholder:text-zinc-500 hover:bg-white/[0.05] focus:border-emerald-500/40 focus:bg-white/[0.06]"
      />
      <kbd
        class="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-sans text-[10px] font-medium text-zinc-400 sm:block"
      >
        ⌘K
      </kbd>
    </div>

    <div class="ml-auto flex items-center gap-1">
      <button
        type="button"
        class="focus-ring hidden h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-zinc-100 sm:inline-flex"
      >
        <AppIcon name="calendar" :size="15" class="text-zinc-500" />
        Last 12 months
        <AppIcon name="chevron-down" :size="13" class="text-zinc-500" />
      </button>

      <button
        type="button"
        class="focus-ring relative grid size-9 cursor-pointer place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
        aria-label="Notifications"
      >
        <AppIcon name="bell" :size="17" />
        <span
          class="absolute top-2 right-2 size-1.5 rounded-full bg-rose-400 ring-2 ring-zinc-950 shadow-[0_0_6px_rgba(251,113,133,0.8)]"
        />
      </button>

      <div class="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

      <button
        type="button"
        class="focus-ring flex cursor-pointer items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-white/5"
      >
        <Avatar name="Sam Rivera" size="sm" />
        <span class="hidden text-xs font-medium text-zinc-200 sm:block">Sam Rivera</span>
        <AppIcon name="chevron-down" :size="13" class="hidden text-zinc-500 sm:block" />
      </button>
    </div>
  </header>
</template>
