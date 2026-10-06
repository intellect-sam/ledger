<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    value: number;
    max: number;
    /** Any CSS color — hex from the data layer works directly. */
    color?: string;
    height?: number;
    /** Switches the bar to red once `value` exceeds `max`. */
    warnOnOverflow?: boolean;
  }>(),
  { color: "#34d399", height: 6, warnOnOverflow: true },
);

const percent = computed(() => (props.max > 0 ? (props.value / props.max) * 100 : 0));
const width = computed(() => Math.min(Math.max(percent.value, 0), 100));

const barColor = computed(() =>
  props.warnOnOverflow && percent.value > 100 ? "#fb7185" : props.color,
);

/** Soft glow under the fill, same hue, half-strength. */
const barShadow = computed(() => `0 0 10px -2px ${barColor.value}`);
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-full bg-white/[0.05] ring-1 ring-inset ring-white/[0.04]"
    :style="{ height: `${height}px` }"
    role="progressbar"
    :aria-valuenow="Math.round(percent)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full rounded-full transition-[width] duration-500 ease-out"
      :style="{ width: `${width}%`, backgroundColor: barColor, boxShadow: barShadow }"
    />
  </div>
</template>
