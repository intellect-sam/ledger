<script setup lang="ts">
import { storeToRefs } from "pinia";
import AppIcon from "./AppIcon.vue";
import { useToastStore } from "@/stores/toast";
import type { ToastKind } from "@/stores/toast";

const toastStore = useToastStore();
const { items } = storeToRefs(toastStore);

const iconFor: Record<ToastKind, string> = {
  success: "check",
  info: "bell",
  error: "alert-triangle",
};

const toneFor: Record<ToastKind, string> = {
  success:
    "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300 shadow-[0_12px_32px_-12px_rgba(16,185,129,0.5)]",
  info: "border-white/10 bg-white/[0.05] text-zinc-200",
  error:
    "border-rose-500/25 bg-rose-500/[0.08] text-rose-300 shadow-[0_12px_32px_-12px_rgba(251,113,133,0.5)]",
};

const iconToneFor: Record<ToastKind, string> = {
  success: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  info: "bg-white/5 text-zinc-300 ring-white/10",
  error: "bg-rose-500/15 text-rose-400 ring-rose-500/30",
};
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-end gap-2 px-4 pb-6 sm:px-6"
      aria-live="polite"
      aria-atomic="false"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
        leave-to-class="opacity-0 translate-x-6"
        move-class="transition-transform duration-200"
      >
        <div
          v-for="toast in items"
          :key="toast.id"
          class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-3.5 py-3 backdrop-blur-xl"
          :class="toneFor[toast.kind]"
          role="status"
        >
          <span
            class="grid size-7 shrink-0 place-items-center rounded-lg ring-1 ring-inset"
            :class="iconToneFor[toast.kind]"
          >
            <AppIcon :name="iconFor[toast.kind]" :size="14" :stroke-width="2.25" />
          </span>

          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-zinc-50">{{ toast.title }}</p>
            <p v-if="toast.description" class="mt-0.5 text-xs text-zinc-400">
              {{ toast.description }}
            </p>
          </div>

          <button
            type="button"
            class="focus-ring grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200"
            aria-label="Dismiss"
            @click="toastStore.dismiss(toast.id)"
          >
            <AppIcon name="x" :size="13" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
