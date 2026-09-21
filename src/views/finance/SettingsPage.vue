<script setup lang="ts">
import { ref } from "vue";
import DashboardLayout from "@/components/layout/DashboardLayout.vue";
import CardPanel from "@/components/ui/CardPanel.vue";
import AppButton from "@/components/ui/AppButton.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import Avatar from "@/components/ui/Avatar.vue";
import Badge from "@/components/ui/Badge.vue";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import TextInput from "@/components/ui/TextInput.vue";
import SelectField from "@/components/ui/SelectField.vue";

const sections = [
  { id: "profile", label: "Profile", icon: "user" },
  { id: "preferences", label: "Preferences", icon: "settings" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "danger", label: "Danger zone", icon: "alert-triangle" },
];

/** Local UI state — swap for your store when you wire things up. */
const displayName = ref("Sam Rivera");
const email = ref("sam@ledger.app");
const phone = ref("+1 (555) 018-2244");
const occupation = ref("Product Designer");
const currency = ref("usd");
const weekStart = ref("monday");
const dateFormat = ref("mdy");
const timezone = ref("est");

const notifyBudgets = ref(true);
const notifyBills = ref(true);
const notifyWeekly = ref(false);
const notifyLarge = ref(true);
const notifyMarketing = ref(false);

const twoFactor = ref(true);
const biometric = ref(false);
</script>

<template>
  <DashboardLayout title="Settings" subtitle="Profile, preferences, and security">
    <template #actions>
      <AppButton variant="outline">Discard</AppButton>
      <AppButton variant="primary">
        <AppIcon name="check" :size="15" :stroke-width="2.25" />
        Save changes
      </AppButton>
    </template>

    <div class="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
      <nav class="lg:sticky lg:top-20 lg:self-start">
        <ul class="no-scrollbar flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          <li v-for="section in sections" :key="section.id" class="shrink-0 lg:shrink">
            <a
              :href="`#${section.id}`"
              class="focus-ring flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm whitespace-nowrap text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <AppIcon :name="section.icon" :size="15" class="text-zinc-400" />
              {{ section.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="min-w-0 space-y-4">
        <CardPanel
          id="profile"
          class="scroll-mt-20"
          title="Profile"
          subtitle="How you appear across Ledger"
        >
          <div class="flex flex-wrap items-center gap-4">
            <Avatar name="Sam Rivera" size="lg" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-zinc-900">Profile photo</p>
              <p class="mt-0.5 text-xs text-zinc-500">PNG or JPG, up to 2 MB.</p>
            </div>
            <div class="flex gap-2">
              <AppButton variant="outline" size="sm">Upload</AppButton>
              <AppButton variant="ghost" size="sm">Remove</AppButton>
            </div>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Full name</span>
              <TextInput v-model="displayName" autocomplete="name" />
            </label>
            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Email address</span>
              <TextInput v-model="email" type="email" autocomplete="email" />
            </label>
            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Phone</span>
              <TextInput v-model="phone" type="tel" autocomplete="tel" />
            </label>
            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Occupation</span>
              <TextInput v-model="occupation" />
            </label>
          </div>
        </CardPanel>

        <CardPanel
          id="preferences"
          class="scroll-mt-20"
          title="Preferences"
          subtitle="Currency, dates, and regional defaults"
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Primary currency</span>
              <SelectField v-model="currency">
                <option value="usd">USD — US Dollar</option>
                <option value="eur">EUR — Euro</option>
                <option value="gbp">GBP — British Pound</option>
                <option value="jpy">JPY — Japanese Yen</option>
              </SelectField>
            </label>

            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Week starts on</span>
              <SelectField v-model="weekStart">
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
                <option value="saturday">Saturday</option>
              </SelectField>
            </label>

            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Date format</span>
              <SelectField v-model="dateFormat">
                <option value="mdy">MM/DD/YYYY</option>
                <option value="dmy">DD/MM/YYYY</option>
                <option value="ymd">YYYY-MM-DD</option>
              </SelectField>
            </label>

            <label class="block">
              <span class="mb-1.5 block text-xs font-medium text-zinc-600">Timezone</span>
              <SelectField v-model="timezone">
                <option value="est">(GMT-05:00) Eastern Time</option>
                <option value="cst">(GMT-06:00) Central Time</option>
                <option value="pst">(GMT-08:00) Pacific Time</option>
                <option value="utc">(GMT+00:00) UTC</option>
              </SelectField>
            </label>
          </div>
        </CardPanel>

        <CardPanel
          id="notifications"
          class="scroll-mt-20"
          title="Notifications"
          subtitle="Choose what reaches your inbox"
        >
          <ul class="divide-y divide-zinc-100">
            <li class="flex items-center justify-between gap-6 py-3.5 first:pt-0">
              <div class="min-w-0">
                <p class="text-sm font-medium text-zinc-900">Budget alerts</p>
                <p class="mt-0.5 text-xs text-zinc-500">
                  When a category passes 80% of its limit.
                </p>
              </div>
              <ToggleSwitch v-model="notifyBudgets" />
            </li>
            <li class="flex items-center justify-between gap-6 py-3.5">
              <div class="min-w-0">
                <p class="text-sm font-medium text-zinc-900">Upcoming bills</p>
                <p class="mt-0.5 text-xs text-zinc-500">Three days before a bill is due.</p>
              </div>
              <ToggleSwitch v-model="notifyBills" />
            </li>
            <li class="flex items-center justify-between gap-6 py-3.5">
              <div class="min-w-0">
                <p class="text-sm font-medium text-zinc-900">Weekly digest</p>
                <p class="mt-0.5 text-xs text-zinc-500">Monday summary of last week.</p>
              </div>
              <ToggleSwitch v-model="notifyWeekly" />
            </li>
            <li class="flex items-center justify-between gap-6 py-3.5">
              <div class="min-w-0">
                <p class="text-sm font-medium text-zinc-900">Large transactions</p>
                <p class="mt-0.5 text-xs text-zinc-500">Anything over $500.</p>
              </div>
              <ToggleSwitch v-model="notifyLarge" />
            </li>
            <li class="flex items-center justify-between gap-6 py-3.5 last:pb-0">
              <div class="min-w-0">
                <p class="text-sm font-medium text-zinc-900">Product updates</p>
                <p class="mt-0.5 text-xs text-zinc-500">Occasional feature news.</p>
              </div>
              <ToggleSwitch v-model="notifyMarketing" />
            </li>
          </ul>
        </CardPanel>

        <CardPanel
          id="security"
          class="scroll-mt-20"
          title="Security"
          subtitle="Protect your account and data"
        >
          <ul class="divide-y divide-zinc-100">
            <li class="flex items-center justify-between gap-6 py-3.5 first:pt-0">
              <div class="min-w-0">
                <p class="flex items-center gap-2 text-sm font-medium text-zinc-900">
                  Two-factor authentication
                  <Badge variant="mint" dot>Enabled</Badge>
                </p>
                <p class="mt-0.5 text-xs text-zinc-500">
                  Require a one-time code on new devices.
                </p>
              </div>
              <ToggleSwitch v-model="twoFactor" />
            </li>
            <li class="flex items-center justify-between gap-6 py-3.5">
              <div class="min-w-0">
                <p class="text-sm font-medium text-zinc-900">Biometric unlock</p>
                <p class="mt-0.5 text-xs text-zinc-500">Use Face ID on the mobile app.</p>
              </div>
              <ToggleSwitch v-model="biometric" />
            </li>
            <li class="flex items-center justify-between gap-6 py-3.5 last:pb-0">
              <div class="min-w-0">
                <p class="text-sm font-medium text-zinc-900">Password</p>
                <p class="mt-0.5 text-xs text-zinc-500">Last changed 4 months ago.</p>
              </div>
              <AppButton variant="outline" size="sm">Change password</AppButton>
            </li>
          </ul>

          <div class="mt-4 rounded-md bg-zinc-50 p-4">
            <p class="text-sm font-medium text-zinc-900">Active sessions</p>
            <ul class="mt-3 space-y-3">
              <li class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <p class="truncate text-sm text-zinc-700">MacBook Pro · New York</p>
                  <p class="text-xs text-zinc-500">Current session</p>
                </div>
                <Badge variant="mint" dot>Active</Badge>
              </li>
              <li class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                  <p class="truncate text-sm text-zinc-700">iPhone 16 Pro · New York</p>
                  <p class="text-xs text-zinc-500">2 hours ago</p>
                </div>
                <AppButton variant="ghost" size="sm">Revoke</AppButton>
              </li>
            </ul>
          </div>
        </CardPanel>

        <section
          id="danger"
          class="scroll-mt-20 rounded-lg border border-rose-200 bg-rose-50/60 p-5"
        >
          <div class="flex items-start gap-3">
            <span class="grid size-7 shrink-0 place-items-center rounded-md bg-rose-100 text-rose-700">
              <AppIcon name="alert-triangle" :size="14" />
            </span>
            <div class="min-w-0 flex-1">
              <h2 class="text-sm font-semibold text-zinc-900">Delete account</h2>
              <p class="mt-1 text-xs text-zinc-600">
                Permanently removes every transaction, budget, and linked account. This cannot be
                undone.
              </p>
              <div class="mt-3.5 flex flex-wrap gap-2">
                <AppButton variant="outline" size="sm">Export all data</AppButton>
                <button
                  type="button"
                  class="focus-ring inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-rose-300 bg-white px-2.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100"
                >
                  <AppIcon name="trash" :size="14" />
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </DashboardLayout>
</template>
