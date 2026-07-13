import process from "node:process";
import { createHash } from "node:crypto";

// Server-only Meta Conversions API helper (.server.ts: never bundled for the
// browser). Sends a server-side Purchase that Meta deduplicates against the
// browser Pixel via a shared event_id (the Stripe session id).

const PIXEL_ID = "4360012974213226";
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;

/** SHA-256 hex of a normalized value (trimmed + lowercased). */
function sha256(v: string): string {
  return createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
}

interface StripeAddressLike {
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface CheckoutSessionForCapi {
  id: string;
  currency?: string | null;
  amount_total?: number | null;
  client_reference_id?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    address?: StripeAddressLike | null;
  } | null;
  shipping_details?: {
    name?: string | null;
    address?: StripeAddressLike | null;
  } | null;
  metadata?: Record<string, string> | null;
}

export async function sendPurchase({
  session,
  quantity,
}: {
  session: CheckoutSessionForCapi;
  quantity: number;
}): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!token) return; // No token configured → do nothing, silently.

  const md = session.metadata ?? {};
  const email = session.customer_details?.email ?? session.customer_email ?? "";
  const userId = session.client_reference_id ?? md.user_id ?? "";

  const name = session.shipping_details?.name ?? session.customer_details?.name ?? "";
  const nameParts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const addr =
    session.shipping_details?.address ?? session.customer_details?.address ?? null;

  const userData: Record<string, unknown> = {};

  // Hashed fields — only include when the source value is non-empty
  // (never send the hash of an empty string).
  const setHash = (key: string, value: string | null | undefined) => {
    const t = (value ?? "").trim();
    if (t) userData[key] = [sha256(t)];
  };
  setHash("em", email);
  setHash("fn", firstName);
  setHash("ln", lastName);
  setHash("ct", addr?.city);
  setHash("st", addr?.state);
  setHash("zp", (addr?.postal_code ?? "").replace(/\s+/g, ""));
  setHash("country", addr?.country);
  setHash("external_id", userId);

  // Non-hashed fields.
  const setRaw = (key: string, value: string | null | undefined) => {
    if (value) userData[key] = value;
  };
  setRaw("fbp", md.fbp);
  setRaw("fbc", md.fbc);
  setRaw("client_user_agent", md.client_ua);
  setRaw("client_ip_address", md.client_ip);

  const event = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: session.id, // same id as the Pixel → Meta dedup
    event_source_url: "https://vaporpr.com/merci",
    action_source: "website",
    user_data: userData,
    custom_data: {
      currency: (session.currency ?? "cad").toUpperCase(),
      value: (session.amount_total ?? 0) / 100, // amount_total is in cents
      content_ids: ["vaporpro-steam-cleaner"],
      content_type: "product",
      num_items: quantity,
    },
  };

  const body: Record<string, unknown> = { data: [event], access_token: token };
  const testCode = process.env.META_TEST_EVENT_CODE;
  if (testCode) body.test_event_code = testCode;

  try {
    const res = await fetch(GRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error("Meta CAPI Purchase failed:", res.status, text);
    } else {
      console.log("Meta CAPI Purchase sent:", text);
    }
  } catch (err) {
    // Log only — the webhook must never fail because of tracking.
    console.error(
      "Meta CAPI Purchase error:",
      err instanceof Error ? err.message : err,
    );
  }
}
