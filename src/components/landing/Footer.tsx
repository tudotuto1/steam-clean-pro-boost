import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-12 pb-24 lg:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid sm:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-background text-base">
              Vapor<span className="text-primary-glow">Pro</span>
            </span>
          </div>
          <p className="mt-3 text-sm max-w-sm">
            Le nettoyage haute performance, sans compromis et sans produits chimiques.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-background mb-3">Aide</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-background">Suivi de commande</a></li>
              <li><a href="#" className="hover:text-background">Retours 30 jours</a></li>
              <li><a href="#" className="hover:text-background">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-background mb-3">Légal</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-background">CGV</a></li>
              <li><a href="#" className="hover:text-background">Confidentialité</a></li>
              <li><a href="#" className="hover:text-background">Mentions</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-background/10 text-center text-xs text-background/60">
        © 2026 VaporPro · Tous droits réservés
      </div>
    </footer>
  );
}
