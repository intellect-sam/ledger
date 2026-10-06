import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/views/pages/HomePage.vue";
import LoginPage from "@/views/auth/LoginPage.vue";
import RegisterPage from "@/views/auth/RegisterPage.vue";
import ForgotPasswordPage from "@/views/auth/ForgotPasswordPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";

import OverviewPage from "@/views/finance/OverviewPage.vue";
import TransactionsPage from "@/views/finance/TransactionsPage.vue";
import BudgetsPage from "@/views/finance/BudgetsPage.vue";
import AccountsPage from "@/views/finance/AccountsPage.vue";
import AnalyticsPage from "@/views/finance/AnalyticsPage.vue";
import ReportsPage from "@/views/finance/ReportsPage.vue";
import SettingsPage from "@/views/finance/SettingsPage.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth", top: 80 };
    }
    return savedPosition ?? { top: 0, behavior: "smooth" };
  },
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/login", name: "login", component: LoginPage, meta: { guestOnly: true } },
    { path: "/register", name: "register", component: RegisterPage, meta: { guestOnly: true } },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPasswordPage,
      meta: { guestOnly: true },
    },

    { path: "/dashboard", name: "dashboard", component: OverviewPage, meta: { requiresAuth: true } },
    { path: "/transactions", name: "transactions", component: TransactionsPage, meta: { requiresAuth: true } },
    { path: "/budgets", name: "budgets", component: BudgetsPage, meta: { requiresAuth: true } },
    { path: "/accounts", name: "accounts", component: AccountsPage, meta: { requiresAuth: true } },
    { path: "/analytics", name: "analytics", component: AnalyticsPage, meta: { requiresAuth: true } },
    { path: "/reports", name: "reports", component: ReportsPage, meta: { requiresAuth: true } },
    { path: "/settings", name: "settings", component: SettingsPage, meta: { requiresAuth: true } },

    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundPage },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.isInitialized) {
    await authStore.initAuth();
  }

  if (to.meta.requiresAuth && !authStore.user) {
    return { name: "login", query: to.path === "/" ? undefined : { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && authStore.user) {
    return { name: "dashboard" };
  }
});

export default router;
