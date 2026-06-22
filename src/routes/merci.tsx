import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Truck, Star } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 h-16 w-16 grid place-items-center rounded-full bg-success/10">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Merci pour votre commande !
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Votre paiement a bien été reçu. Vous recevrez un courriel de
          confirmation avec les détails de votre commande sous peu.
        </p>

        <div className="mt-6 rounded-2xl border border-border p-4 text-left space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-success font-semibold">
              Livraison incluse
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            Livré au Canada & USA en 5 à 8 jours ouvrables
          </div>
        </div>

        {session_id ? (
          <p className="mt-4 text-[11px] text-muted-foreground break-all">
            Référence : {session_id}
          </p>
        ) : null}

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <h2 className="font-semibold text-foreground">
              Partagez votre expérience
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Dès que vous aurez reçu et testé votre VaporPro, laissez un avis pour
            aider les autres clients.
          </p>
          <div className="mt-4">
            <Link
              to="/"
              hash="avis"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 h-11 text-sm font-semibold hover:border-primary hover:bg-accent transition-colors"
            >
              <Star className="h-4 w-4" />
              Laisser un avis
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 h-12 text-sm font-bold text-primary-foreground shadow-cta hover:scale-[1.01] transition-transform"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
