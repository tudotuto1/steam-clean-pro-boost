import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import process from "node:process";

// Server route: POST /api/stripe-webhook
// Records each successful Stripe payment into the `orders` table, linked to
// the authenticated user. Mirrors the server-route style of checkout.ts.
//
// Secrets are read from the server environment and never reach the client:
//   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_SERVICE_ROLE_KEY.

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secretKey || !webhookSecret) {
          console.error("Stripe webhook secrets are not configured");
          return new Response("Webhook not configured", { status: 500 });
        }

        // a) Corps BRUT obligatoire pour la vérification de signature : ne
        //    jamais parser le JSON avant.
        const rawBody = await request.text();
        // b) Signature envoyée par Stripe.
        const signature = request.headers.get("stripe-signature");
        if (!signature) {
          return new Response("Missing signature", { status: 400 });
        }

        const stripe = new Stripe(secretKey);

        // c) Vérification de la signature ; tout échec → 400, on n'écrit rien.
        let event: Stripe.Event;
        try {
          event = await stripe.webhooks.constructEventAsync(
            rawBody,
            signature,
            webhookSecret,
          );
        } catch (err) {
          console.error(
            "Stripe signature verification failed:",
            err instanceof Error ? err.message : err,
          );
          return new Response("Invalid signature", { status: 400 });
        }

        // d) On ne traite que la complétion de paiement.
        if (event.type !== "checkout.session.completed") {
          return new Response("ignored", { status: 200 });
        }

        const s = event.data.object as Stripe.Checkout.Session;
        // `shipping_details` is present on the runtime payload but absent from
        // the Checkout.Session type in this SDK version — read it safely.
        const shipping = (
          s as unknown as {
            shipping_details?: {
              name?: string | null;
              address?: Stripe.Address | null;
            } | null;
          }
        ).shipping_details;

        if (s.payment_status !== "paid") {
          return new Response("not paid", { status: 200 });
        }

        const userId = s.client_reference_id || s.metadata?.user_id;
        if (!userId) {
          // user_id est NOT NULL : sans utilisateur, on n'écrit pas.
          return new Response("no user", { status: 200 });
        }

        // Quantité totale via les line items.
        let quantity = 1;
        try {
          const li = await stripe.checkout.sessions.listLineItems(s.id, {
            limit: 100,
          });
          quantity =
            li.data.reduce((n, it) => n + (it.quantity || 1), 0) || 1;
        } catch (err) {
          console.error(
            "Failed to list line items:",
            err instanceof Error ? err.message : err,
          );
        }

        const record = {
          user_id: userId,
          stripe_session_id: s.id,
          stripe_payment_intent:
            typeof s.payment_intent === "string" ? s.payment_intent : null,
          email: s.customer_details?.email ?? s.customer_email ?? null,
          amount_total: s.amount_total, // cents
          currency: s.currency,
          quantity,
          status: "paid",
          shipping_name: shipping?.name ?? s.customer_details?.name ?? null,
          shipping_address:
            shipping?.address ?? s.customer_details?.address ?? null,
        };

        // Écriture avec la clé service_role (contourne la RLS).
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceRoleKey) {
          console.error("Supabase service credentials are not configured");
          return new Response("Supabase not configured", { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { error } = await supabase
          .from("orders")
          .upsert(record, {
            onConflict: "stripe_session_id",
            ignoreDuplicates: true,
          });

        if (error) {
          // 500 → Stripe réessaiera la livraison.
          console.error("Failed to upsert order:", error.message);
          return new Response("db error", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
