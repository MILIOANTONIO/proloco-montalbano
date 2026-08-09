"use client";

import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PushSubscribeButton({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [status, setStatus] = useState<"idle" | "enabled" | "denied" | "unsupported">("idle");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") setStatus("enabled");
    if (Notification.permission === "denied") setStatus("denied");
  }, []);

  async function subscribe() {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("denied");
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, locale }),
    });
    setStatus("enabled");
  }

  if (status === "unsupported") return null;

  return (
    <button
      onClick={subscribe}
      disabled={status === "enabled"}
      className="w-full cursor-pointer rounded-full border border-brand-400 bg-white px-4 py-2.5 text-sm font-medium text-brand-800 transition-colors duration-200 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {status === "enabled" ? t.push.enabled : status === "denied" ? t.push.denied : t.push.enable}
    </button>
  );
}
