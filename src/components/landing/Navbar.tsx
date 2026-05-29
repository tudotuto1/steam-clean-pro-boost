import { ShoppingBag, Sparkles } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

export function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-soft transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-base tracking-tight">
            Vapor<span className="text-primary">Pro</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Avantages</a>
          <a href="#demo" className="hover:text-foreground transition-colors">Démo</a>
          <a href="#box" className="hover:text-foreground transition-colors">Contenu</a>
          <a href="#avis" className="hover:text-foreground transition-colors">Avis</a>
        </nav>

        <button
          onClick={onCartOpen}
          aria-label="Ouvrir le panier"
          className="relative h-10 w-10 grid place-items-center rounded-full border border-border hover:border-primary hover:bg-accent transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold animate-float-in">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
