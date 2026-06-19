import { createFileRoute } from "@tanstack/react-router";
import process from "node:process";

// Server route: POST /api/checkout
// Creates a Stripe Checkout Session and returns { url }.
// The Stripe secret key is read from STRIPE_SECRET_KEY and never leaves the server.

const UNIT_AMOUNT = 8500; // 85,00 $ CAD, en cents
const PRODUCT_NAME = "Nettoyeur Vapeur Haute Pression VaporPro";

function getOrigin(request: Request): string {
  const origin = request.headers.get("origin");
  if (origin) return origin;
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // ignore malformed referer
    }
  }
  return new URL(request.url).origin;
}

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
          console.error("STRIPE_SECRET_KEY is not set");
          return Response.json(
            { error: "Le paiement n'est pas configuré." },
            { status: 500 },
          );
        }

        // Lis la quantité depuis le client.
        let quantity = 0;
        try {
          const body = (await request.json()) as { quantity?: unknown };
          quantity = Math.floor(Number(body?.quantity));
        } catch {
          // body invalide
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
          return Response.json({ error: "Quantité invalide." }, { status: 400 });
        }

        const origin = getOrigin(request);

        // Stripe attend un corps form-url-encoded ; on évite ainsi toute
        // dépendance au SDK.
        const params = new URLSearchParams();
        params.set("mode", "payment");
        params.set("line_items[0][price_data][currency]", "cad");
        params.set(
          "line_items[0][price_data][product_data][name]",
          PRODUCT_NAME,
        );
        params.set(
          "line_items[0][price_data][unit_amount]",
          String(UNIT_AMOUNT),
        );
        params.set("line_items[0][quantity]", String(quantity));
        params.set("shipping_address_collection[allowed_countries][0]", "CA");
        params.set("shipping_address_collection[allowed_countries][1]", "US");
        params.set(
          "success_url",
          `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
        );
        params.set("cancel_url", `${origin}/`);

        const stripeRes = await fetch(
          "https://api.stripe.com/v1/checkout/sessions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${secretKey}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          },
        );

        if (!stripeRes.ok) {
          const detail = await stripeRes.text();
          console.error("Stripe checkout session failed:", detail);
          return Response.json(
            { error: "La session de paiement n'a pas pu être créée." },
            { status: 502 },
          );
        }

        const session = (await stripeRes.json()) as { url?: string };
        if (!session.url) {
          return Response.json(
            { error: "Réponse Stripe invalide." },
            { status: 502 },
          );
        }

        return Response.json({ url: session.url });
      },
    },
  },
});
