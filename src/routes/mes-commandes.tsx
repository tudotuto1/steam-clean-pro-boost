import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Package, Truck, ExternalLink, ShoppingBag } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { useI18n, useT, formatDate, formatAmount } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import mainImg from "@/assets/product-main.jpeg";

export const Route = createFileRoute("/mes-commandes")({
  head: () => ({
    meta: [
      { title: "Mes commandes — VaporPro" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MesCommandesPage,
});

interface ShippingAddress {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  province?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

interface Order {
  id: string;
  created_at: string;
  quantity: number | null;
  amount_total: number | null;
  currency: string | null;
  status: string | null;
  tracking_number: string | null;
  tracking_carrier: string | null;
  tracking_url: string | null;
  shipping_name: string | null;
  shipping_address: ShippingAddress | null;
}

const STATUS_MAP: Record<string, { labelKey: TKey; className: string }> = {
  paid: { labelKey: "status.paid", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  fulfilled: { labelKey: "status.fulfilled", className: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  shipped: { labelKey: "status.shipped", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  delivered: { labelKey: "status.delivered", className: "bg-success/10 text-success border-success/20" },
  refunded: { labelKey: "status.refunded", className: "bg-muted text-muted-foreground border-border" },
  cancelled: { labelKey: "status.cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function StatusBadge({ status }: { status: string | null }) {
  const t = useT();
  const entry = status ? STATUS_MAP[status] : undefined;
  if (!entry) {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
        {status ?? "—"}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className={entry.className}>
      {t(entry.labelKey)}
    </Badge>
  );
}

function MesCommandesPage() {
  const { session, loading, openAuthDialog } = useAuth();
  const t = useT();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[] | null>(null);

  // Route protégée : sans session, retour à l'accueil + ouverture de la modale.
  useEffect(() => {
    if (!loading && !session) {
      openAuthDialog();
      navigate({ to: "/" });
    }
  }, [loading, session, openAuthDialog, navigate]);

  // Récupération des commandes (la RLS filtre déjà par utilisateur).
  useEffect(() => {
    if (!session) return;
    let active = true;
    setOrders(null);
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Failed to load orders:", error.message);
          setOrders([]);
          return;
        }
        setOrders((data ?? []) as Order[]);
      });
    return () => {
      active = false;
    };
  }, [session]);

  const isLoading = loading || (!!session && orders === null);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-display font-bold text-base tracking-tight">
              Vapor<span className="text-primary">Pro</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.backToShop")}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold">{t("orders.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("orders.subtitle")}
        </p>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !session ? null : orders && orders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {orders?.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  const t = useT();
  return (
    <div className="text-center py-20">
      <div className="mx-auto mb-5 h-14 w-14 grid place-items-center rounded-full bg-muted">
        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground">{t("orders.empty")}</p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/">{t("orders.seeProduct")}</Link>
        </Button>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const t = useT();
  const { lang } = useI18n();
  const addr = order.shipping_address;
  const hasAddress =
    !!addr &&
    !!(addr.line1 || addr.city || addr.province || addr.postal_code || addr.country);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-gradient-soft border border-border overflow-hidden flex-shrink-0">
            <img
              src={mainImg}
              alt=""
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <CardTitle className="text-base leading-tight">
              {t("orders.productName")}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(order.created_at, lang)}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("orders.quantity")} <span className="font-medium text-foreground">{order.quantity ?? 1}</span>
          </span>
          <span className="font-bold text-primary-deep">
            {formatAmount(order.amount_total, order.currency, lang)}
          </span>
        </div>

        {order.tracking_number && (
          <div className="rounded-xl border border-border bg-muted/40 p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary flex-shrink-0" />
              <span>
                {t("orders.carrier")}{" "}
                <span className="font-medium">{order.tracking_carrier ?? "—"}</span>{" "}
                · {t("orders.trackingNo")} <span className="font-medium">{order.tracking_number}</span>
              </span>
            </div>
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {t("orders.track")}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}

        {hasAddress && (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground font-medium mb-1">
              <Package className="h-3.5 w-3.5" />
              {t("orders.shippingAddress")}
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
      </CardContent>
    </Card>
  );
}
