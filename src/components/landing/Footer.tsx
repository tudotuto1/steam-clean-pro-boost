import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();
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
            {t("footer.tagline")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-semibold text-background mb-3">{t("footer.help")}</h5>
            <ul className="space-y-2">
              <li><Link to="/mes-commandes" className="hover:text-background">{t("footer.tracking")}</Link></li>
              <li><Link to="/garantie" className="hover:text-background">{t("footer.warranty")}</Link></li>
              <li><Link to="/contact" className="hover:text-background">{t("footer.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-background mb-3">{t("footer.legal")}</h5>
            <ul className="space-y-2">
              <li><Link to="/cgv" className="hover:text-background">{t("footer.cgv")}</Link></li>
              <li><Link to="/confidentialite" className="hover:text-background">{t("footer.privacy")}</Link></li>
              <li><Link to="/mentions" className="hover:text-background">{t("footer.mentions")}</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-background/10 text-center text-xs text-background/60">
        {t("footer.rights")}
      </div>
    </footer>
  );
}
