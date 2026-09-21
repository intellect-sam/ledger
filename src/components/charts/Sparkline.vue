<script setup lang="ts">
import { computed, useId } from "vue";

const props = withDefaults(
  defineProps<{
    values: number[];
    color?: string;
    width?: number;
    height?: number;
    filled?: boolean;
  }>(),
  { color: "#3f8f6f", width: 96, height: 32, filled: true },
);

const uid = useId();
const gradientId = `spark-grad-${uid.replace(/[^a-zA-Z0-9-_]/g, "")}`;

const geometry = computed(() => {
  const values = props.values;
  if (values.length === 0) return { line: "", area: "" };

  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const inset = 2;
  const usableH = props.height - inset * 2;
  const stepX = values.length > 1 ? props.width / (values.length - 1) : 0;

  const points = values.map((value, index) => ({
    x: values.length > 1 ? index * stepX : props.width / 2,
    y: inset + usableH - ((value - min) / span) * usableH,
  }));

  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return { line: "", area: "" };

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${last.x},${props.height} L${first.x},${props.height} Z`;

  return { line, area };
});
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    class="h-auto w-full overflow-visible"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.18" />
        <stop offset="100%" :stop-color="color" stop-opacity="0" />
      </linearGradient>
    </defs>

    <path v-if="filled" :d="geometry.area" :fill="`url(#${gradientId})`" />
    <path
      :d="geometry.line"
      fill="none"
      :stroke="color"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
