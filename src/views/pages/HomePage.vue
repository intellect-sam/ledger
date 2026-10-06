<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import BrandMark from "@/components/ui/BrandMark.vue";
import AreaChart from "@/components/charts/AreaChart.vue";
import { netWorthSeries } from "@/data/mock";
import { formatCompactCurrency, formatPercent } from "@/utils/format";

const sections = [
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#pricing" },
];

const features = [
  {
    icon: "target",
    title: "Budgets that hold up",
    body: "Set a limit per category and track the month's pace against it, not just the running total. You see you're heavy on dining two weeks before the statement does.",
  },
  {
    icon: "wallet",
    title: "Every account in one place",
    body: "Checking, savings, cards, and brokerage balances side by side, each with its month-over-month move. A card balance stays negative because it is.",
  },
  {
    icon: "bar-chart",
    title: "Analytics you'll actually read",
    body: "Twelve months of income against expense, a category breakdown, and which weekdays cost you the most. No vanity metrics.",
  },
];

const first = netWorthSeries[0];
const last = netWorthSeries[netWorthSeries.length - 1];
const netWorthChange =
  first !== undefined && last !== undefined ? ((last - first) / first) * 100 : 0;
</script>

<template>
  <div class="relative min-h-screen">
    <header
      class="sticky top-0 z-40 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl"
    >
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <RouterLink to="/" aria-label="Ledger home">
          <BrandMark />
        </RouterLink>

        <nav class="hidden items-center gap-6 sm:flex">
          <a
            v-for="section in sections"
            :key="section.href"
            :href="section.href"
            class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            {{ section.label }}
          </a>
        </nav>

        <div class="ml-auto flex items-center gap-2">
          <AppButton to="/login" variant="ghost" size="sm">Sign in</AppButton>
          <AppButton to="/register" variant="accent" size="sm">Get started</AppButton>
        </div>
      </div>
    </header>

    <main>
      <!-- Hero -->
      <section class="relative overflow-hidden">
        <!-- Aurora -->
        <div
          class="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div class="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[140px]" />
          <div class="absolute -top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[140px]" />
        </div>

        <div class="relative mx-auto max-w-6xl px-6 pt-20 pb-14 sm:pt-28 sm:pb-20">
          <div class="max-w-3xl">
            <span
              class="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3 py-1 text-[11px] font-medium tracking-wide text-emerald-300 uppercase"
            >
              <span class="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              Personal finance · September cohort
            </span>
            <h1
              class="font-display mt-6 text-5xl font-semibold tracking-tight text-balance text-zinc-50 sm:text-6xl"
            >
              Know exactly where your
              <span class="relative inline-block">
                <span class="relative z-10 bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-200 bg-clip-text text-transparent">
                  money
                </span>
              </span>
              goes.
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Ledger pulls your accounts, budgets, and bills into one monthly view —
              so the numbers add up before the month ends rather than after.
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-3">
              <AppButton to="/register" variant="accent">
                Get started
                <AppIcon name="arrow-right" :size="14" :stroke-width="2.25" />
              </AppButton>
              <AppButton to="/login" variant="outline">See a demo</AppButton>
            </div>

            <p class="mt-5 text-xs text-zinc-500">
              No card required · 2-minute setup · SOC 2 Type II
            </p>
          </div>
        </div>

        <!-- Hero chart card -->
        <div class="relative mx-auto max-w-6xl px-6 pb-24 sm:pb-28">
          <div class="surface-card relative overflow-hidden rounded-2xl p-1">
            <!-- Soft gold inner frame -->
            <div
              class="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-amber-500/10"
              aria-hidden="true"
            />
            <div class="rounded-xl bg-zinc-950/60">
              <div class="flex items-center justify-between gap-4 border-b border-white/[0.06] px-6 py-4">
                <div>
                  <p class="text-[11px] tracking-wide text-zinc-500 uppercase">Net worth</p>
                  <p class="num-display mt-1 text-2xl font-semibold text-zinc-50">
                    {{ formatCompactCurrency(last ?? 0) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[11px] tracking-wide text-zinc-500 uppercase">Last 12 months</p>
                  <p
                    class="mt-1 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-400 tabular-nums ring-1 ring-emerald-500/25 ring-inset"
                  >
                    <AppIcon name="trending-up" :size="13" :stroke-width="2" />
                    {{ netWorthChange >= 0 ? "+" : "" }}{{ formatPercent(netWorthChange) }}
                  </p>
                </div>
              </div>

              <div class="px-6 py-6">
                <AreaChart
                  :data="netWorthSeries"
                  :interactive="false"
                  :height="220"
                  :format-value="formatCompactCurrency"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Product -->
      <section id="product" class="relative scroll-mt-16 border-t border-white/[0.06]">
        <div class="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div class="max-w-2xl">
            <p class="text-[11px] font-semibold tracking-[0.14em] text-emerald-400 uppercase">
              What's inside
            </p>
            <h2 class="font-display mt-4 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              Six screens covering the month, end to end.
            </h2>
            <p class="mt-4 text-base leading-relaxed text-zinc-400">
              Here are the three you'll open most.
            </p>
          </div>

          <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="surface-card group relative overflow-hidden rounded-xl p-6 transition-colors hover:border-white/10"
            >
              <div
                class="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/[0.05] blur-2xl transition-opacity duration-500 group-hover:bg-emerald-500/[0.12]"
                aria-hidden="true"
              />
              <span
                class="relative grid size-11 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/25"
              >
                <AppIcon :name="feature.icon" :size="18" :stroke-width="2" />
              </span>
              <h3 class="relative mt-5 text-lg font-semibold tracking-tight text-zinc-50">
                {{ feature.title }}
              </h3>
              <p class="relative mt-2 text-sm leading-relaxed text-zinc-400">
                {{ feature.body }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing / CTA -->
      <section id="pricing" class="scroll-mt-16 border-t border-white/[0.06]">
        <div class="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div
            class="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-zinc-900/50 to-amber-500/[0.06] px-8 py-12 sm:px-14 sm:py-16"
          >
            <!-- Decorative glows -->
            <div
              class="pointer-events-none absolute -top-32 -left-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-[100px]"
              aria-hidden="true"
            />
            <div
              class="pointer-events-none absolute -right-24 -bottom-32 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px]"
              aria-hidden="true"
            />
            <!-- Gold hairline on top -->
            <div class="hairline-gold absolute inset-x-10 top-0" aria-hidden="true" />

            <div class="relative max-w-xl">
              <p class="text-[11px] font-semibold tracking-[0.14em] text-amber-300 uppercase">
                Start free
              </p>
              <h2 class="font-display mt-4 text-3xl font-semibold tracking-tight text-balance text-zinc-50 sm:text-4xl">
                Close the month properly — with everything in one place.
              </h2>
              <p class="mt-4 text-base leading-relaxed text-zinc-300">
                Connect your accounts, set a budget per category, and let the month close itself.
              </p>

              <div class="mt-10 flex flex-wrap items-center gap-3">
                <RouterLink
                  to="/register"
                  class="glow-emerald focus-ring inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-500 px-4 text-sm font-medium text-zinc-950 transition-all hover:bg-emerald-400"
                >
                  Create your account
                  <AppIcon name="arrow-right" :size="14" :stroke-width="2.25" />
                </RouterLink>
                <RouterLink
                  to="/login"
                  class="focus-ring inline-flex h-10 items-center rounded-lg border border-white/15 bg-white/[0.03] px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/[0.07]"
                >
                  Sign in instead
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-white/[0.06]">
      <div
        class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <BrandMark />
          <p class="mt-3 text-xs text-zinc-500">Personal finance, in one place.</p>
        </div>

        <nav class="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
          <a href="#product" class="transition-colors hover:text-zinc-200">Product</a>
          <a href="#pricing" class="transition-colors hover:text-zinc-200">Pricing</a>
          <RouterLink to="/login" class="transition-colors hover:text-zinc-200">Sign in</RouterLink>
          <RouterLink to="/register" class="transition-colors hover:text-zinc-200">
            Get started
          </RouterLink>
        </nav>
      </div>

      <div class="border-t border-white/[0.04]">
        <p class="mx-auto max-w-6xl px-6 py-5 text-xs text-zinc-600">
          © 2026 Ledger. A demo interface — no real accounts are connected.
        </p>
      </div>
    </footer>
  </div>
</template>
