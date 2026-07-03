import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Loader2,
  Star,
  Truck,
  Package,
  ShieldAlert,
  Check,
  X,
  Trash2,
} from "lucide-react";

import { useAuth } from "@/lib/auth";
import { useI18n, formatDate, formatAmount } from "@/lib/i18n";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — VaporPro" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

// ---------- Types ----------

interface AdminReview {
  id: string;
  rating: number | null;
  title: string | null;
  body: string | null;
  image_urls: string[];
  author_label: string | null;
  status: string | null;
  created_at: string;
}

interface AdminOrder {
  id: string;
  created_at: string;
  email: string | null;
  quantity: number | null;
  amount_total: number | null;
  currency: string | null;
  status: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  tracking_url: string | null;
  shipping_name: string | null;
  shipping_address: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    province?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

const REVIEW_STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const REVIEW_STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
};

const ORDER_STATUSES = [
  { value: "paid", label: "Payée" },
  { value: "fulfilled", label: "En préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "refunded", label: "Remboursée" },
  { value: "cancelled", label: "Annulée" },
];

// ---------- Page shell ----------

function AdminPage() {
  const { session, loading } = useAuth();
  const [state, setState] = useState<"checking" | "denied" | "admin">("checking");

  useEffect(() => {
    if (loading) return;
    if (!session) {
      setState("denied");
      return;
    }
    let active = true;
    fetch("/api/admin/me", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => {
        if (!active) return;
        setState(res.ok ? "admin" : "denied");
      })
      .catch(() => {
        if (active) setState("denied");
      });
    return () => {
      active = false;
    };
  }, [session, loading]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-base tracking-tight">
              Vapor<span className="text-primary">Pro</span>
            </span>
            <span className="text-xs font-semibold text-muted-foreground border border-border rounded-full px-2 py-0.5">
              Admin
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Retour à la boutique
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">
        {loading || state === "checking" ? (
          <div className="flex justify-center py-24 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : state === "denied" ? (
          <AccessDenied />
        ) : (
          <AdminPanel token={session!.access_token} />
        )}
      </main>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="text-center py-20">
      <div className="mx-auto mb-5 h-14 w-14 grid place-items-center rounded-full bg-destructive/10">
        <ShieldAlert className="h-6 w-6 text-destructive" />
      </div>
      <h1 className="text-xl font-bold">Accès refusé</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cette page est réservée au propriétaire du site.
      </p>
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}

function AdminPanel({ token }: { token: string }) {
  return (
    <Tabs defaultValue="reviews">
      <TabsList className="grid w-full max-w-sm grid-cols-2">
        <TabsTrigger value="reviews">Avis</TabsTrigger>
        <TabsTrigger value="orders">Commandes</TabsTrigger>
      </TabsList>
      <TabsContent value="reviews" className="mt-6">
        <ReviewsTab token={token} />
      </TabsContent>
      <TabsContent value="orders" className="mt-6">
        <OrdersTab token={token} />
      </TabsContent>
    </Tabs>
  );
}

// ---------- Reviews tab ----------

function ReviewsTab({ token }: { token: string }) {
  const { lang } = useI18n();
  const [reviews, setReviews] = useState<AdminReview[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Erreur de chargement.");
      setReviews((data.reviews ?? []) as AdminReview[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
      setReviews([]);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (id: string, action: "approve" | "reject" | "delete") => {
    if (
      action === "delete" &&
      !window.confirm("Supprimer définitivement cet avis (et ses photos) ?")
    ) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/reviews/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "L'action a échoué.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'action a échoué.");
    } finally {
      setBusyId(null);
    }
  };

  if (reviews === null) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {reviews.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          Aucun avis.
        </p>
      ) : (
        reviews.map((review) => (
          <article
            key={review.id}
            className="p-5 rounded-2xl bg-card border border-border space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${
                        n <= (review.rating ?? 0)
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {review.author_label ?? "—"} · {formatDate(review.created_at, lang)}
                </span>
              </div>
              <Badge
                variant="outline"
                className={
                  REVIEW_STATUS_STYLE[review.status ?? ""] ??
                  "bg-muted text-muted-foreground border-border"
                }
              >
                {REVIEW_STATUS_LABEL[review.status ?? ""] ?? review.status ?? "—"}
              </Badge>
            </div>

            {review.title && (
              <h3 className="font-semibold text-sm">{review.title}</h3>
            )}
            {review.body && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.body}
              </p>
            )}

            {review.image_urls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.image_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-20 w-20 rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => void act(review.id, "approve")}
                disabled={busyId === review.id || review.status === "approved"}
              >
                <Check className="h-4 w-4" />
                Approuver
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => void act(review.id, "reject")}
                disabled={busyId === review.id || review.status === "rejected"}
              >
                <X className="h-4 w-4" />
                Rejeter
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => void act(review.id, "delete")}
                disabled={busyId === review.id}
              >
                {busyId === review.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Supprimer
              </Button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

// ---------- Orders tab ----------

function OrdersTab({ token }: { token: string }) {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Erreur de chargement.");
      setOrders((data.orders ?? []) as AdminOrder[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement.");
      setOrders([]);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  if (orders === null) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {orders.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">
          Aucune commande.
        </p>
      ) : (
        orders.map((order) => (
          <OrderRow key={order.id} order={order} token={token} onSaved={load} />
        ))
      )}
    </div>
  );
}

function OrderRow({
  order,
  token,
  onSaved,
}: {
  order: AdminOrder;
  token: string;
  onSaved: () => Promise<void> | void;
}) {
  const { lang } = useI18n();
  const [status, setStatus] = useState(order.status ?? "paid");
  const [carrier, setCarrier] = useState(order.tracking_carrier ?? "");
  const [trackingNo, setTrackingNo] = useState(order.tracking_number ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const addr = order.shipping_address;

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/orders/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: order.id,
          status,
          tracking_carrier: carrier,
          tracking_number: trackingNo,
          tracking_url: trackingUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "L'enregistrement a échoué.");
      setSaved(true);
      await onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "L'enregistrement a échoué.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="p-5 rounded-2xl bg-card border border-border space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-sm">{order.email ?? "—"}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {formatDate(order.created_at, lang)} · Qté {order.quantity ?? 1}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-primary-deep">
            {formatAmount(order.amount_total, order.currency, lang)}
          </div>
        </div>
      </div>

      {(order.shipping_name || addr) && (
        <div className="text-xs text-muted-foreground rounded-xl bg-muted/40 border border-border p-3">
          <div className="flex items-center gap-1.5 text-foreground font-medium mb-1">
            <Package className="h-3.5 w-3.5" />
            Adresse de livraison
          </div>
          {order.shipping_name && <div>{order.shipping_name}</div>}
          {addr?.line1 && <div>{addr.line1}</div>}
          {addr?.line2 && <div>{addr.line2}</div>}
          <div>
            {[addr?.city, addr?.province ?? addr?.state, addr?.postal_code]
              .filter(Boolean)
              .join(", ")}
          </div>
          {addr?.country && <div>{addr.country}</div>}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor={`status-${order.id}`}>Statut</Label>
          <select
            id={`status-${order.id}`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`carrier-${order.id}`}>Transporteur</Label>
          <Input
            id={`carrier-${order.id}`}
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            placeholder="Postes Canada, UPS…"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`trackno-${order.id}`}>N° de suivi</Label>
          <Input
            id={`trackno-${order.id}`}
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            placeholder="1Z999AA1…"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`trackurl-${order.id}`}>Lien de suivi</Label>
          <Input
            id={`trackurl-${order.id}`}
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="https://…"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={() => void save()} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Truck className="h-4 w-4" />
          )}
          Enregistrer
        </Button>
        {saved && <span className="text-xs text-success font-medium">Enregistré ✓</span>}
        {error && (
          <span className="text-xs text-destructive" role="alert">
            {error}
          </span>
        )}
      </div>
    </article>
  );
}
