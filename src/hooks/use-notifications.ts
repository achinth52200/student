"use client";

import { useEffect, useCallback, useRef } from "react";

type NotificationOptions = {
  title: string;
  body: string;
  tag?: string;
  data?: any;
};

/**
 * Hook to manage OS-level push notifications via Service Worker.
 * Provides permission request, notification sending, and reminder scheduling.
 */
export function useNotifications() {
  const swRegistration = useRef<ServiceWorkerRegistration | null>(null);

  // Register service worker on mount
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        swRegistration.current = reg;
        console.log("[StudentSync] Service Worker registered");
      })
      .catch((err) => {
        console.warn("[StudentSync] SW registration failed:", err);
      });
  }, []);

  /**
   * Request notification permission from the user.
   * Returns the permission state.
   */
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return "denied";
    }

    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";

    const result = await Notification.requestPermission();
    return result;
  }, []);

  /**
   * Send an immediate OS-level notification.
   */
  const sendNotification = useCallback(
    async ({ title, body, tag, data }: NotificationOptions) => {
      const permission = await requestPermission();
      if (permission !== "granted") return;

      // Try via Service Worker first (works in background)
      if (swRegistration.current?.active) {
        swRegistration.current.active.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          body,
          tag: tag || `studentsync-${Date.now()}`,
          data,
        });
      } else {
        // Fallback to direct Notification API
        new Notification(title, {
          body,
          icon: "/logo.svg",
          tag: tag || `studentsync-${Date.now()}`,
        });
      }
    },
    [requestPermission]
  );

  /**
   * Check reminders and notify for overdue/due-today ones.
   */
  const checkAndNotifyReminders = useCallback(
    (reminders: { id: string; title: string; dueDate: Date | string; completed: boolean }[]) => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const pendingReminders = reminders.filter((r) => {
        if (r.completed) return false;
        const due = new Date(r.dueDate);
        const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
        // Due today or overdue
        return dueDay <= today;
      });

      if (pendingReminders.length === 0) return;

      // Send a grouped notification
      if (pendingReminders.length === 1) {
        const r = pendingReminders[0];
        sendNotification({
          title: "📋 Reminder Due!",
          body: r.title,
          tag: `reminder-${r.id}`,
          data: { reminderId: r.id },
        });
      } else {
        sendNotification({
          title: `📋 ${pendingReminders.length} Reminders Due!`,
          body: pendingReminders.map((r) => `• ${r.title}`).join("\n"),
          tag: "reminders-group",
          data: { count: pendingReminders.length },
        });
      }
    },
    [sendNotification]
  );

  return {
    requestPermission,
    sendNotification,
    checkAndNotifyReminders,
    isSupported: typeof window !== "undefined" && "Notification" in window,
    permission: typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default",
  };
}
