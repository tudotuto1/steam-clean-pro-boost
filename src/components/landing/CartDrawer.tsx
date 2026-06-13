import { useEffect } from "react";
import { X, Plus, Minus, Truck, Lock, Trash2, Package } from "lucide-react";
import heroImg from "@/assets/steam-cleaner-hero.jpg";

interface Props {
  open: boolean;
  onClose: () => void;
  quantity: number;
  setQuantity: (n: number) => void;
}

const UNIT_PRICE = 69.99;
const FREE_SHIPPING_THRESHOLD = 80;

export function CartDrawer({ open, onClose, quantity, setQuantity }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const subtotal = quantity * UNIT_PRICE;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

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
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <Truck className="h-4 w-4 text-primary" />
            {remaining > 0 ? (
              <span>Plus que <strong>${remaining.toFixed(2)}</strong> pour la livraison offerte</span>
            ) : (
              <span className="text-success font-bold">Livraison gratuite débloquée</span>
            )}
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            Livré au Canada & USA en 3 à 7 jours ouvrables (fournisseurs partenaires)
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {quantity > 0 ? (
            <div className="flex gap-4 p-3 rounded-2xl border border-border">
              <div className="h-20 w-20 rounded-xl bg-gradient-soft overflow-hidden flex-shrink-0">
                <img src={heroImg} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm leading-tight">Nettoyeur Vapeur Haute Pression VaporPro</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-primary-deep">${UNIT_PRICE.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground line-through">$139.99</span>
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
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Taxes</span>
            <span>calculées au paiement</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="text-primary-deep">${subtotal.toFixed(2)}</span>
          </div>
          <button
            disabled={quantity === 0}
            className="w-full h-12 rounded-xl bg-gradient-primary text-primary-foreground font-bold shadow-cta disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4" />
            Passer Commande
          </button>
          <p className="text-[11px] text-center text-muted-foreground">Paiement sécurisé · Carte · PayPal · Apple Pay · Google Pay</p>
        </footer>
      </aside>
    </>
  );
}
