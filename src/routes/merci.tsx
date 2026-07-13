import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck, Star } from "lucide-react";

import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { track, CONTENT_ID } from "@/lib/pixel";

// Fire the Meta Pixel Purchase event using the REAL paid amount, resolved
// server-side from the Stripe session. Only fires once per session_id.
function usePurchasePixel(sessionId: string | undefined) {
  const { session } = useAuth();
  useEffect(() => {
    if (!sessionId || !session) return;
    const key = `purchase_fired_${sessionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // sessionStorage unavailable — proceed without the guard.
    }

    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
        );
        if (!res.ok || !active) return;
        const data = (await res.json()) as {
          amount_total?: number | null;
          currency?: string | null;
          quantity?: number | null;
          payment_status?: string | null;
        };
        if (!active || data.payment_status !== "paid") return;

        // Mark before firing so a refresh (or StrictMode) never double-counts.
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          // ignore
        }
        track(
          "Purchase",
          {
            content_ids: [CONTENT_ID],
            content_type: "product",
            value: (data.amount_total ?? 0) / 100,
            currency: String(data.currency ?? "cad").toUpperCase(),
            num_items: data.quantity ?? 1,
          },
          { eventID: sessionId },
        );
      } catch {
        // On any failure, fire nothing (better no event than a wrong value).
      }
    })();

    return () => {
      active = false;
    };
  }, [sessionId, session]);
}

export const Route = createFileRoute("/merci")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id:
      typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Merci pour votre commande — VaporPro" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MerciPage,
});

function MerciPage() {
  const { session_id } = Route.useSearch();
  const t = useT();
  usePurchasePixel(session_id);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 h-16 w-16 grid place-items-center rounded-full bg-success/10">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("merci.title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("merci.subtitle")}
        </p>

        <div className="mt-6 rounded-2xl border border-border p-4 text-left space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-success font-semibold">
              {t("merci.shippingIncluded")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            {t("merci.shippingNote")}
          </div>
        </div>

        {session_id ? (
          <p className="mt-4 text-[11px] text-muted-foreground break-all">
            {t("merci.reference")} {session_id}
          </p>
        ) : null}

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <h2 className="font-semibold text-foreground">
              {t("merci.reviewTitle")}
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("merci.reviewText")}
          </p>
          <div className="mt-4">
            <Link
              to="/"
              hash="avis"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 h-11 text-sm font-semibold hover:border-primary hover:bg-accent transition-colors"
            >
              <Star className="h-4 w-4" />
              {t("merci.reviewBtn")}
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 h-12 text-sm font-bold text-primary-foreground shadow-cta hover:scale-[1.01] transition-transform"
          >
            {t("merci.backHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
