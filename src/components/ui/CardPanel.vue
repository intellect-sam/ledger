<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    /** Removes inner padding when the child manages its own (tables, lists). */
    padded?: boolean;
  }>(),
  { padded: true },
);
</script>

<template>
  <section class="rounded-lg border border-zinc-200 bg-white shadow-card">
    <header
      v-if="title || $slots.actions"
      class="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4"
    >
      <div class="min-w-0">
        <h2 class="truncate text-section font-semibold tracking-tight text-zinc-900">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="mt-0.5 truncate text-xs text-zinc-500">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
        <slot name="actions" />
      </div>
    </header>

    <div :class="padded ? 'px-5 py-4' : ''">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="border-t border-zinc-100 px-5 py-3.5">
      <slot name="footer" />
    </footer>
  </section>
</template>
