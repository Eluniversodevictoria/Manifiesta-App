import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const { title, body, url, user_ids } = await req.json();
  const vapidPublic = Deno.env.get("NEXT_PUBLIC_VAPID_PUBLIC_KEY")!;
  const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY")!;

  webpush.setVapidDetails(
    "mailto:soportemanifiesta.app@gmail.com",
    vapidPublic,
    vapidPrivate
  );

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let query = sb.from("push_subscriptions").select("endpoint, p256dh, auth");
  if (user_ids && user_ids.length > 0) query = query.in("user_id", user_ids);

  const { data: subs } = await query;
  if (!subs || subs.length === 0)
    return new Response(JSON.stringify({ sent: 0 }), { headers: cors });

  const payload = JSON.stringify({
    title: title ?? "MANIFIESTA",
    body: body ?? "",
    url: url ?? "/app",
  });

  let sent = 0;
  const stale: string[] = [];

  await Promise.all(
    subs.map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (err: unknown) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) stale.push(sub.endpoint);
      }
    })
  );

  if (stale.length > 0)
    await sb.from("push_subscriptions").delete().in("endpoint", stale);

  return new Response(JSON.stringify({ sent, removed: stale.length }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
