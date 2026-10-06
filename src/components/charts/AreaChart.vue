<script setup lang="ts">
import { computed, ref, useId } from "vue";

const props = withDefaults(
  defineProps<{
    data: number[];
    labels?: string[];
    color?: string;
    height?: number;
    formatValue?: (value: number) => string;
    formatTick?: (value: number) => string;
    interactive?: boolean;
  }>(),
  { color: "#34d399", height: 220, interactive: true },
);

const W = 720;
const PAD_LEFT = 50;
const PAD_RIGHT = 10;

const uid = useId();
const gradientId = `area-grad-${uid.replace(/[^a-zA-Z0-9-_]/g, "")}`;

const plotH = computed(() => props.height);

const format = computed(() => props.formatValue ?? ((v: number) => v.toFixed(0)));

interface Point {
  x: number;
  y: number;
}

interface Geometry {
  line: string;
  area: string;
  points: Point[];
  top: number;
  bottom: number;
}

const EMPTY: Geometry = { line: "", area: "", points: [], top: 0, bottom: 0 };

const geometry = computed<Geometry>(() => {
  const values = props.data;
  if (values.length === 0) return EMPTY;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min;
  const padding = span === 0 ? Math.abs(max) * 0.2 || 1 : span * 0.18;
  const top = max + padding;
  const bottom = Math.max(min - padding, 0);
  const range = top - bottom || 1;

  const stepX =
    values.length > 1 ? (W - PAD_LEFT - PAD_RIGHT) / (values.length - 1) : 0;

  const points: Point[] = values.map((value, index) => ({
    x: PAD_LEFT + index * stepX,
    y: plotH.value - ((value - bottom) / range) * plotH.value,
  }));

  const first = points[0];
  if (!first) return EMPTY;

  const line = smooth(points);
  const last = points[points.length - 1] ?? first;
  const area = `${line} L${last.x},${plotH.value} L${first.x},${plotH.value} Z`;

  return { line, area, points, top, bottom };
});

function smooth(points: Point[]): string {
  const first = points[0];
  if (!first) return "";
  if (points.length < 3) {
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  }

  let d = `M${first.x},${first.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const prev = points[i - 1] ?? points[i];
    const current = points[i];
    const next = points[i + 1];
    if (!prev || !current || !next) continue;
    const after = points[i + 2] ?? next;

    const cp1x = current.x + (next.x - prev.x) / 6;
    const cp1y = current.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (after.x - current.x) / 6;
    const cp2y = next.y - (after.y - current.y) / 6;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }
  return d;
}

const STEPS = [3, 2, 1, 0];

const tickFormat = computed(() => {
  if (props.formatTick) return props.formatTick;
  const sample = format.value(0);
  const prefix = /^[^\d-]*/.exec(sample)?.[0] ?? "";
  const suffix = /[^\d]*$/.exec(sample)?.[0] ?? "";
  const compact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return (value: number) => `${prefix}${compact.format(value)}${suffix}`;
});

const ticks = computed(() => {
  const { top, bottom } = geometry.value;
  return STEPS.map((step) => ({
    y: (plotH.value / 3) * step,
    label: tickFormat.value(bottom + ((top - bottom) / 3) * step),
  }));
});

const lastPoint = computed(() => geometry.value.points.at(-1) ?? null);

const activeIndex = ref<number | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);

const activePoint = computed<Point | null>(() => {
  if (activeIndex.value === null) return null;
  return geometry.value.points[activeIndex.value] ?? null;
});

const activeLabel = computed(() => {
  if (activeIndex.value === null) return "";
  return props.labels?.[activeIndex.value] ?? `#${activeIndex.value + 1}`;
});

const activeValue = computed(() => {
  if (activeIndex.value === null) return "";
  const value = props.data[activeIndex.value];
  return value === undefined ? "" : format.value(value);
});

function onMove(event: MouseEvent) {
  if (!props.interactive) return;
  const el = svgRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0) return;
  const count = props.data.length;
  if (count === 0) return;
  const x = ((event.clientX - rect.left) / rect.width) * W;
  const ratio = (x - PAD_LEFT) / (W - PAD_LEFT - PAD_RIGHT);
  const index = Math.round(ratio * (count - 1));
  activeIndex.value = Math.min(Math.max(index, 0), count - 1);
}

function onLeave() {
  activeIndex.value = null;
}
</script>

<template>
  <div class="relative">
    <svg
      ref="svgRef"
      :viewBox="`0 0 ${W} ${plotH}`"
      class="h-auto w-full overflow-visible"
      role="img"
      :aria-label="`Trend chart with ${data.length} points`"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.35" />
          <stop offset="50%" :stop-color="color" stop-opacity="0.12" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g>
        <line
          v-for="tick in ticks"
          :key="`grid-${tick.y}`"
          :x1="PAD_LEFT"
          :x2="W - PAD_RIGHT"
          :y1="tick.y"
          :y2="tick.y"
          stroke="rgba(255,255,255,0.05)"
          stroke-width="1"
          stroke-dasharray="2 4"
        />
      </g>

      <g>
        <text
          v-for="tick in ticks"
          :key="`tick-${tick.y}`"
          :x="PAD_LEFT - 8"
          :y="tick.y + 3"
          text-anchor="end"
          class="fill-zinc-600 text-[10px] tabular-nums"
        >
          {{ tick.label }}
        </text>
      </g>

      <path :d="geometry.area" :fill="`url(#${gradientId})`" />

      <path
        :d="geometry.line"
        fill="none"
        :stroke="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="{ filter: `drop-shadow(0 0 6px ${color}60)` }"
      />

      <g v-if="lastPoint && !activePoint">
        <circle :cx="lastPoint.x" :cy="lastPoint.y" r="10" :fill="color" opacity="0.18" />
        <circle
          :cx="lastPoint.x"
          :cy="lastPoint.y"
          r="4"
          :fill="color"
          stroke="#09090b"
          stroke-width="2.5"
        />
      </g>

      <g v-if="activePoint">
        <line
          :x1="activePoint.x"
          :x2="activePoint.x"
          :y1="0"
          :y2="plotH"
          stroke="rgba(255,255,255,0.14)"
          stroke-width="1"
          stroke-dasharray="3 3"
        />
        <circle
          :cx="activePoint.x"
          :cy="activePoint.y"
          r="10"
          :fill="color"
          opacity="0.2"
        />
        <circle
          :cx="activePoint.x"
          :cy="activePoint.y"
          r="4.5"
          :fill="color"
          stroke="#09090b"
          stroke-width="2.5"
        />
      </g>
    </svg>

    <div
      v-if="activePoint"
      class="pointer-events-none absolute top-0 z-10 -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-lg border border-white/10 bg-zinc-900/95 px-3 py-2 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur"
      :style="{ left: `${(activePoint.x / W) * 100}%` }"
    >
      <p class="text-[10px] tracking-wide text-zinc-500 uppercase">{{ activeLabel }}</p>
      <p class="mt-0.5 text-sm font-semibold text-zinc-50 tabular-nums">
        {{ activeValue }}
      </p>
    </div>
    <div
      v-if="labels?.length"
      class="mt-3 flex justify-between pl-[6.9%] text-[11px] text-zinc-500"
    >
      <span v-for="(label, i) in labels" :key="`${label}-${i}`">{{ label }}</span>
    </div>
  </div>
</template>
