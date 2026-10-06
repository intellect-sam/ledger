<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    slices: { label: string; value: number; color: string }[];
    size?: number;
    thickness?: number;
    centerLabel?: string;
    centerValue?: string;
  }>(),
  { size: 180, thickness: 18, centerLabel: "Categories" },
);

const radius = computed(() => (props.size - props.thickness) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const center = computed(() => props.size / 2);

const total = computed(() => props.slices.reduce((sum, slice) => sum + slice.value, 0));

const arcs = computed(() => {
  const c = circumference.value;
  const sum = total.value;
  let consumed = 0;

  return props.slices.map((slice, index) => {
    const fraction = sum > 0 ? slice.value / sum : 0;
    const raw = fraction * c;
    const dash = Math.max(raw - 2, 0);
    const offset = -consumed * c;
    consumed += fraction;

    return {
      index,
      label: slice.label,
      color: slice.color,
      percent: fraction * 100,
      dash,
      gap: Math.max(c - dash, 0),
      offset,
    };
  });
});

const activeIndex = ref<number | null>(null);

const activeArc = computed(() =>
  activeIndex.value === null ? null : arcs.value[activeIndex.value] ?? null,
);
</script>

<template>
  <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg
      :viewBox="`0 0 ${size} ${size}`"
      class="size-full -rotate-90"
      role="img"
      aria-label="Breakdown by category"
    >
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        :stroke-width="thickness"
      />

      <circle
        v-for="arc in arcs"
        :key="arc.label"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="arc.color"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke-dasharray="`${arc.dash} ${arc.gap}`"
        :stroke-dashoffset="arc.offset"
        class="cursor-pointer transition-opacity"
        :style="{
          opacity: activeIndex === null || activeIndex === arc.index ? 1 : 0.22,
          filter: activeIndex === arc.index ? `drop-shadow(0 0 8px ${arc.color}80)` : 'none',
        }"
        @mouseenter="activeIndex = arc.index"
        @mouseleave="activeIndex = null"
      />
    </svg>

    <div class="pointer-events-none absolute inset-0 grid place-content-center text-center">
      <template v-if="activeArc">
        <p class="text-[10px] tracking-wide text-zinc-500 uppercase">{{ activeArc.label }}</p>
        <p class="num-display mt-1 text-xl font-semibold text-zinc-50">
          {{ activeArc.percent.toFixed(1) }}%
        </p>
      </template>
      <template v-else>
        <p class="text-[10px] tracking-wide text-zinc-500 uppercase">{{ centerLabel }}</p>
        <p class="num-display mt-1 text-xl font-semibold text-zinc-50">
          {{ centerValue ?? slices.length }}
        </p>
      </template>
    </div>
  </div>
</template>
