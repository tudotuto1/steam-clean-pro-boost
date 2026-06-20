import { useEffect, useState } from "react";
import { X, Plus, Minus, Truck, Lock, Trash2, Package, Loader2 } from "lucide-react";
import mainImg from "@/assets/product-main.jpeg";

interface Props {
  open: boolean;
  onClose: () => void;
  quantity: number;
  setQuantity: (n: number) => void;
}

const UNIT_PRICE = 85;

export function CartDrawer({ open, onClose, quantity, setQuantity }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const subtotal = quantity * UNIT_PRICE;

  const handleCheckout = async () => {
    if (quantity < 1 || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Le paiement n'a pas pu démarrer.");
      }
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Le paiement n'a pas pu démarrer. Réessayez.",
      );
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-background shadow-elevated transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between px-5 h-16 border-b border-border">
          <h3 className="font-bold text-lg">Votre Panier ({quantity})</h3>
          <button onClick={onClose} aria-label="Fermer" className="h-9 w-9 grid place-items-center rounded-full hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="px-5 py-4 bg-accent/40 border-b border-border">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-success font-bold">Livraison incluse dans le prix</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            Livré au Canada & USA en 5 à 8 jours ouvrables (fournisseurs partenaires)
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {quantity > 0 ? (
            <div className="flex gap-4 p-3 rounded-2xl border border-border">
              <div className="h-20 w-20 rounded-xl bg-gradient-soft overflow-hidden flex-shrink-0">
                <img src={mainImg} alt="" className="w-full h-full object-contain p-1" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight">Nettoyeur Vapeur Haute Pression VaporPro</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-primary-deep">${UNIT_PRICE}</span>
                  <span className="text-[10px] text-success font-semibold">Tout inclus</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-full">
                    <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="h-7 w-7 grid place-items-center hover:bg-muted rounded-full">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-sm font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="h-7 w-7 grid place-items-center hover:bg-muted rounded-full">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => setQuantity(0)} aria-label="Supprimer" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>Votre panier est vide</p>
            </div>
          )}
        </div>

        <footer className="border-t border-border p-5 space-y-3 bg-card">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sous-total</span>
            <span className="font-semibold">${subtotal}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Livraison</span>
            <span className="text-success font-semibold">Incluse</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary-deep">${subtotal}</span>
          </div>
          {error && (
            <p className="text-[11px] text-center text-destructive" role="alert">
              {error}
            </p>
          )}
          <button
            onClick={handleCheckout}
            disabled={quantity === 0 || loading}
            className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-cta disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {loading ? "Redirection..." : "Passer Commande"}
          </button>
          <p className="text-[11px] text-center text-muted-foreground">Paiement sécurisé · Carte · PayPal · Apple Pay · Google Pay</p>
        </footer>
      </aside>
    </>
  );
}
