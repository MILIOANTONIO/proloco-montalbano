import webpush from "web-push";
import { prisma } from "./prisma";

let configured = false;

export function getWebPush() {
  if (!configured) {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const contact = process.env.VAPID_CONTACT_EMAIL || "mailto:info@example.it";
    if (!publicKey || !privateKey) {
      throw new Error("Chiavi VAPID non configurate (VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY)");
    }
    webpush.setVapidDetails(contact, publicKey, privateKey);
    configured = true;
  }
  return webpush;
}

/**
 * Invia una notifica push a tutti gli iscritti. Usata sia dal composer manuale
 * in /admin/push sia dall'invio automatico alla pubblicazione di news/eventi.
 * Non lancia eccezioni: se le chiavi VAPID non sono configurate, non fa nulla
 * (per non bloccare la creazione di news/eventi se il push non è ancora impostato).
 */
export async function sendPushToAll({ title, body, url }: { title: string; body: string; url: string }) {
  let webpush;
  try {
    webpush = getWebPush();
  } catch {
    return { sent: 0, total: 0, removed: 0, skipped: true as const };
  }

  const subscriptions = await prisma.pushSubscription.findMany();
  const payload = JSON.stringify({ title, body, url });

  let sent = 0;
  const stale: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) stale.push(sub.id);
      }
    })
  );

  if (stale.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { id: { in: stale } } });
  }

  return { sent, total: subscriptions.length, removed: stale.length, skipped: false as const };
}
