import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import process from "node:process";

// GET /api/checkout-session?session_id=cs_...
// Returns the amount actually paid for a Stripe Checkout Session, so the
// thank-you page can fire a Purchase event without waiting for the webhook
// (Stripe redirects the buyer before the webhook has written the order).
//
// Security: the session's client_reference_id (set to the user id at checkout)
// MUST match the authenticated user, otherwise anyone could read another
// customer's order by guessing a session id.

export const Route = createFileRoute("/api/checkout-session")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
          console.error("STRIPE_SECRET_KEY is not set");
          return Response.json(
            { error: "Paiement non configuré." },
            { status: 500 },
          );
        }

        const url = new URL(request.url);
        const sessionId = url.searchParams.get("session_id") ?? "";
        if (!sessionId.startsWith("cs_")) {
          return Response.json({ error: "session_id invalide." }, { status: 400 });
        }

        // Verify the caller.
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.toLowerCase().startsWith("bearer ")
          ? authHeader.slice(7).trim()
          : "";
        if (!token) {
          return Response.json({ error: "Connexion requise." }, { status: 401 });
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
        if (!supabaseUrl || !supabaseAnonKey) {
          console.error("Supabase env missing");
          return Response.json(
            { error: "Authentification non configurée." },
            { status: 500 },
          );
        }
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: userError } =
          await supabase.auth.getUser(token);
        if (userError || !userData.user) {
          return Response.json(
            { error: "Session invalide." },
            { status: 401 },
          );
        }

        // Fetch the Stripe session via REST (no SDK dependency), expanding line items.
        const stripeRes = await fetch(
          `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(
            sessionId,
          )}?expand[]=line_items`,
          { headers: { Authorization: `Bearer ${secretKey}` } },
        );
        if (!stripeRes.ok) {
          const detail = await stripeRes.text();
          console.error("Stripe session fetch failed:", detail);
          return Response.json(
            { error: "Session de paiement introuvable." },
            { status: 502 },
          );
        }

        const session = (await stripeRes.json()) as {
          client_reference_id?: string | null;
          amount_total?: number | null;
          currency?: string | null;
          payment_status?: string | null;
          line_items?: { data?: Array<{ quantity?: number | null }> };
        };

        // Ownership check.
        if (session.client_reference_id !== userData.user.id) {
          return Response.json({ error: "Accès refusé." }, { status: 403 });
        }

        const quantity =
          (session.line_items?.data ?? []).reduce(
            (n, it) => n + (it.quantity || 0),
            0,
          ) || 1;

        return Response.json({
          amount_total: session.amount_total ?? null,
          currency: session.currency ?? null,
          quantity,
          payment_status: session.payment_status ?? null,
        });
      },
    },
  },
});
