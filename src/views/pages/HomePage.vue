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
  <div class="min-h-screen bg-white">
    <header class="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div class="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        <RouterLink to="/" aria-label="Ledger home">
          <BrandMark />
        </RouterLink>

        <nav class="hidden items-center gap-6 sm:flex">
          <a
            v-for="section in sections"
            :key="section.href"
            :href="section.href"
            class="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
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
      <section class="border-b border-zinc-200 bg-zinc-50">
        <div class="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24 sm:pb-16">
          <div class="max-w-2xl">
            <p class="text-xs font-medium tracking-wide text-accent uppercase">
              Personal finance
            </p>
            <h1
              class="mt-4 text-4xl font-semibold tracking-tight text-balance text-zinc-900 sm:text-5xl"
            >
              Know exactly where your money goes.
            </h1>
            <p class="mt-5 text-lg leading-relaxed text-zinc-600">
              Ledger pulls your accounts, budgets, and bills into one monthly view, so the
              numbers add up before the month ends rather than after.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <AppButton to="/register" variant="accent">Get started</AppButton>
              <AppButton to="/login" variant="outline">See a demo</AppButton>
            </div>

            <p class="mt-4 text-xs text-zinc-500">No card required · 2-minute setup</p>
          </div>
        </div>

        <div class="mx-auto max-w-6xl px-6 pb-16 sm:pb-20">
          <div class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-card">
            <div class="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-3.5">
              <div>
                <p class="text-sm font-semibold text-zinc-900">Net worth</p>
                <p class="mt-0.5 text-xs text-zinc-500">Last 12 months</p>
              </div>
              <p
                class="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700 tabular-nums ring-1 ring-emerald-600/20 ring-inset"
              >
                <AppIcon name="trending-up" :size="13" :stroke-width="2" />
                {{ netWorthChange >= 0 ? "+" : "" }}{{ formatPercent(netWorthChange) }}
              </p>
            </div>

            <div class="px-5 py-5">
              <AreaChart
                :data="netWorthSeries"
                :interactive="false"
                :height="200"
                :format-value="formatCompactCurrency"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="product" class="scroll-mt-16 border-b border-zinc-200">
        <div class="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 class="text-2xl font-semibold tracking-tight text-zinc-900">What's inside</h2>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Six screens covering the month end to end. Here are the three you'll open most.
          </p>

          <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="rounded-lg border border-zinc-200 bg-white p-6 shadow-card"
            >
              <span class="grid size-9 place-items-center rounded-md bg-accent-soft text-accent">
                <AppIcon :name="feature.icon" :size="17" />
              </span>
              <h3 class="mt-4 text-section font-semibold tracking-tight text-zinc-900">
                {{ feature.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-zinc-600">{{ feature.body }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" class="scroll-mt-16 border-b border-zinc-200">
        <div class="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div class="rounded-lg bg-accent px-8 py-10 shadow-card sm:px-12 sm:py-14">
            <h2 class="max-w-lg text-2xl font-semibold tracking-tight text-balance text-white">
              Start your first month with everything in one place.
            </h2>
            <p class="mt-3 max-w-lg text-sm leading-relaxed text-white/80">
              Connect your accounts, set a budget per category, and let the month close itself.
            </p>

            <RouterLink
              to="/register"
              class="mt-7 inline-flex h-9 items-center rounded-md bg-white px-3 text-sm font-medium text-accent transition-colors hover:bg-zinc-100"
            >
              Create your account
            </RouterLink>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div
        class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <BrandMark />
          <p class="mt-3 text-xs text-zinc-500">Personal finance, in one place.</p>
        </div>

        <nav class="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500">
          <a href="#product" class="transition-colors hover:text-zinc-900">Product</a>
          <a href="#pricing" class="transition-colors hover:text-zinc-900">Pricing</a>
          <RouterLink to="/login" class="transition-colors hover:text-zinc-900">Sign in</RouterLink>
          <RouterLink to="/register" class="transition-colors hover:text-zinc-900">
            Get started
          </RouterLink>
        </nav>
      </div>

      <div class="border-t border-zinc-100">
        <p class="mx-auto max-w-6xl px-6 py-5 text-xs text-zinc-400">
          © 2026 Ledger. A demo interface — no real accounts are connected.
        </p>
      </div>
    </footer>
  </div>
</template>
