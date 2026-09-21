import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/pages/HomePage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import RegisterPage from "@/views/auth/RegisterPage.vue";
import ForgotPasswordPage from "@/views/auth/ForgotPasswordPage.vue";

import OverviewPage from "@/views/finance/OverviewPage.vue";
import TransactionsPage from "@/views/finance/TransactionsPage.vue";
import BudgetsPage from "@/views/finance/BudgetsPage.vue";
import AccountsPage from "@/views/finance/AccountsPage.vue";
import AnalyticsPage from "@/views/finance/AnalyticsPage.vue";
import SettingsPage from "@/views/finance/SettingsPage.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/login" },
    { path: "/login", name: "login", component: LoginPage },
    { path: "/register", name: "register", component: RegisterPage },
    { path: "/forgot-password", name: "forgot-password", component: ForgotPasswordPage },

    { path: "/dashboard", name: "dashboard", component: OverviewPage, meta: { requiresAuth: true } },
    { path: "/transactions", name: "transactions", component: TransactionsPage, meta: { requiresAuth: true } },
    { path: "/budgets", name: "budgets", component: BudgetsPage, meta: { requiresAuth: true } },
    { path: "/accounts", name: "accounts", component: AccountsPage, meta: { requiresAuth: true } },
    { path: "/analytics", name: "analytics", component: AnalyticsPage, meta: { requiresAuth: true } },
    { path: "/settings", name: "settings", component: SettingsPage, meta: { requiresAuth: true } },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    await authStore.initAuth();
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: "login" };
  }
})

export default router;
