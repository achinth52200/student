"use client";

import { useState, useEffect } from "react";
import { Bell, BellRing, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationBanner() {
  const { requestPermission, isSupported } = useNotifications();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  if (!isSupported || permission === "granted" || dismissed) return null;
  if (permission === "denied") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-rose-800">Notifications Blocked</p>
          <p className="text-xs text-rose-600 mt-0.5">
            Please enable notifications in your browser settings to receive reminder alerts on your lock screen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50/50 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
        <BellRing className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-indigo-900">Enable Notifications</p>
        <p className="text-xs text-indigo-600 mt-0.5 leading-relaxed">
          Get real push notifications on your lock screen when reminders are due. Never miss a deadline!
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          className="btn-gradient rounded-lg text-xs h-8 px-3"
          onClick={async () => {
            const result = await requestPermission();
            setPermission(result);
          }}
        >
          <Check className="w-3 h-3 mr-1" />
          Enable
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 rounded-lg hover:bg-indigo-100 text-indigo-400"
          onClick={() => setDismissed(true)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
