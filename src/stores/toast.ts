import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastKind = "success" | "info" | "error";

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  description?: string;
}

/**
 * Transient notifications shown bottom-right. Toasts auto-dismiss after
 * `timeout` ms (default 4s); pass `0` to make them stick.
 */
export const useToastStore = defineStore("toast", () => {
  const items = ref<Toast[]>([]);
  let nextId = 0;

  function show(toast: Omit<Toast, "id">, timeout = 4000): number {
    const id = ++nextId;
    items.value = [...items.value, { ...toast, id }];
    if (timeout > 0) {
      window.setTimeout(() => dismiss(id), timeout);
    }
    return id;
  }

  function dismiss(id: number) {
    items.value = items.value.filter((t) => t.id !== id);
  }

  function success(title: string, description?: string) {
    return show({ kind: "success", title, description });
  }
  function info(title: string, description?: string) {
    return show({ kind: "info", title, description });
  }
  function error(title: string, description?: string) {
    return show({ kind: "error", title, description });
  }

  return { items, show, dismiss, success, info, error };
});
