import { Star, ShieldCheck, Lock, RotateCcw, Plus } from "lucide-react";
import { HeroGallery } from "./HeroGallery";

interface HeroProps {
  onAddToCart: () => void;
}

export function Hero({ onAddToCart }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 -z-10 opacity-40"
        style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.9 0.08 195 / 0.5), transparent)" }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <HeroGallery />

        <div className="flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 self-start bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            En stock · Plus que 27 unités
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
            Éliminez <span className="text-primary">99,9% des Bactéries</span> et de la Graisse Sans Aucun Produit Chimique
          </h1>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <span className="text-sm font-semibold">4,8/5</span>
            <span className="text-sm text-muted-foreground">basé sur 1 420+ avis</span>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            Le nettoyeur vapeur portable haute pression qui désinfecte vos surfaces à
            <strong className="text-foreground"> 132°C</strong>. Cuisine, salle de bain, voiture, textiles — un seul outil, des résultats professionnels.
          </p>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-4xl font-extrabold font-display text-primary-deep">49,90 €</span>
            <span className="text-xl text-muted-foreground line-through">99,90 €</span>
            <span className="bg-destructive/10 text-destructive font-bold text-xs px-2 py-1 rounded">-50%</span>
          </div>

          <button
            onClick={onAddToCart}
            className="group relative w-full h-14 rounded-2xl bg-gradient-primary text-primary-foreground font-bold text-base shadow-cta animate-pulse-cta hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            Ajouter au Panier — 49,90 €
          </button>

          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] sm:text-xs">
            {[
              { icon: Lock, text: "Paiement Sécurisé" },
              { icon: RotateCcw, text: "30 Jours Satisfait" },
              { icon: ShieldCheck, text: "Garantie 2 Ans" },
            ].map((b) => (
              <div key={b.text} className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-card border border-border/60">
                <b.icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
