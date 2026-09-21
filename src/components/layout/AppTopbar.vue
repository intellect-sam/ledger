<script setup lang="ts">
import AppIcon from "@/components/ui/AppIcon.vue";
import Avatar from "@/components/ui/Avatar.vue";

defineEmits<{ toggleSidebar: [] }>();
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6"
  >
    <button
      type="button"
      class="focus-ring grid size-9 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
      aria-label="Open navigation"
      @click="$emit('toggleSidebar')"
    >
      <AppIcon name="menu" :size="18" />
    </button>

    <div class="relative w-full max-w-sm">
      <AppIcon
        name="search"
        :size="15"
        class="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-zinc-400"
      />
      <input
        type="search"
        placeholder="Search"
        class="focus-ring h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 pr-12 pl-8 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:bg-white"
      />
      <kbd
        class="pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 rounded border border-zinc-200 bg-white px-1 py-0.5 font-sans text-[10px] text-zinc-400 sm:block"
      >
        ⌘K
      </kbd>
    </div>

    <div class="ml-auto flex items-center gap-1">
      <button
        type="button"
        class="focus-ring hidden h-9 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:inline-flex"
      >
        <AppIcon name="calendar" :size="15" class="text-zinc-400" />
        Last 12 months
        <AppIcon name="chevron-down" :size="13" class="text-zinc-400" />
      </button>

      <button
        type="button"
        class="focus-ring relative grid size-9 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        aria-label="Notifications"
      >
        <AppIcon name="bell" :size="17" />
        <span class="absolute top-2 right-2 size-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>

      <div class="mx-1 hidden h-5 w-px bg-zinc-200 sm:block" />

      <button
        type="button"
        class="focus-ring flex cursor-pointer items-center gap-2 rounded-md p-1 pr-1.5 transition-colors hover:bg-zinc-100"
      >
        <Avatar name="Sam Rivera" size="sm" />
        <span class="hidden text-xs font-medium text-zinc-700 sm:block">Sam Rivera</span>
        <AppIcon name="chevron-down" :size="13" class="hidden text-zinc-400 sm:block" />
      </button>
    </div>
  </header>
</template>
