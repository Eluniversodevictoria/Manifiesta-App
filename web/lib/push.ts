const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function sendPushNotification({
  title,
  body,
  url,
  user_ids,
}: {
  title: string;
  body: string;
  url?: string;
  user_ids?: string[];
}) {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/push-notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ title, body, url: url ?? '/app', user_ids }),
    });
  } catch {
    // fire-and-forget — nunca bloquear la acción principal
  }
}
