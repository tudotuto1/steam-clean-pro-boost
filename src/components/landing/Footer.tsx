import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

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
            Le nettoyage haute performance, sans produits chimiques. Expédié au Canada et aux USA en 5 à 8 jours ouvrables via nos fournisseurs partenaires. Livraison incluse.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-background mb-3">Aide</h5>
            <ul className="space-y-2">
              <li><Link to="/mes-commandes" className="hover:text-background">Suivi de commande</Link></li>
              <li><Link to="/garantie" className="hover:text-background">Garantie 2 ans</Link></li>
              <li><Link to="/contact" className="hover:text-background">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-background mb-3">Légal</h5>
            <ul className="space-y-2">
              <li><Link to="/cgv" className="hover:text-background">CGV</Link></li>
              <li><Link to="/confidentialite" className="hover:text-background">Confidentialité</Link></li>
              <li><Link to="/mentions" className="hover:text-background">Mentions</Link></li>
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
