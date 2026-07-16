import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import process from "node:process";

// Server route: POST /api/checkout
// Creates a Stripe Checkout Session and returns { url }.
// The Stripe secret key is read from STRIPE_SECRET_KEY and never leaves the server.

const UNIT_AMOUNT = 7499; // 74,99 $ CAD, en cents
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

        // Vérifie l'identité côté serveur : on ne fait jamais confiance au
        // client. Le vrai user_id/email vient du token validé par Supabase.
        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.toLowerCase().startsWith("bearer ")
          ? authHeader.slice(7).trim()
          : "";
        if (!token) {
          return Response.json(
            { error: "Connexion requise." },
            { status: 401 },
          );
        }

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
        if (!supabaseUrl || !supabaseAnonKey) {
          console.error("VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing");
          return Response.json(
            { error: "L'authentification n'est pas configurée." },
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
            { error: "Session invalide. Reconnectez-vous." },
            { status: 401 },
          );
        }
        const userId = userData.user.id;
        const userEmail = userData.user.email;

        // Lis la quantité + les signaux de correspondance Meta depuis le client.
        let quantity = 0;
        let fbp = "";
        let fbc = "";
        try {
          const body = (await request.json()) as {
            quantity?: unknown;
            fbp?: unknown;
            fbc?: unknown;
          };
          quantity = Math.floor(Number(body?.quantity));
          if (typeof body?.fbp === "string") fbp = body.fbp;
          if (typeof body?.fbc === "string") fbc = body.fbc;
        } catch {
          // body invalide
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
          return Response.json({ error: "Quantité invalide." }, { status: 400 });
        }

        // Signaux serveur pour l'API Conversions Meta.
        const clientUa = request.headers.get("user-agent") ?? "";
        const clientIp = (request.headers.get("x-forwarded-for") ?? "")
          .split(",")[0]
          .trim();

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

        // Lie la session de paiement à l'utilisateur authentifié (valeurs
        // issues du token vérifié, jamais du client).
        params.set("client_reference_id", userId);
        params.set("metadata[user_id]", userId);
        if (userEmail) {
          params.set("customer_email", userEmail);
        }

        // Signaux de correspondance Meta stockés dans la metadata Stripe (le
        // webhook les relira pour l'API Conversions). Tronqués à 500 car.
        const cap = (v: string) => v.slice(0, 500);
        if (fbp) params.set("metadata[fbp]", cap(fbp));
        if (fbc) params.set("metadata[fbc]", cap(fbc));
        if (clientUa) params.set("metadata[client_ua]", cap(clientUa));
        if (clientIp) params.set("metadata[client_ip]", cap(clientIp));

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
