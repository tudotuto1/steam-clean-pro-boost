import { Flame, Leaf, Layers, Package } from "lucide-react";

import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const cards: { icon: typeof Flame; titleKey: TKey; descKey: TKey }[] = [
  { icon: Flame, titleKey: "features.card0.title", descKey: "features.card0.desc" },
  { icon: Leaf, titleKey: "features.card1.title", descKey: "features.card1.desc" },
  { icon: Layers, titleKey: "features.card2.title", descKey: "features.card2.desc" },
  { icon: Package, titleKey: "features.card3.title", descKey: "features.card3.desc" },
];

export function Features() {
  const t = useT();
  return (
    <section id="features" className="py-16 sm:py-24 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">{t("features.kicker")}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            {t("features.title")}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((f, i) => (
            <div
              key={f.titleKey}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-glow grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">{t(f.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
