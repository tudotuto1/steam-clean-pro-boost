import usesImg from "@/assets/product-uses.jpeg";

import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const surfaceKeys: TKey[] = [
  "demo.surface0",
  "demo.surface1",
  "demo.surface2",
  "demo.surface3",
  "demo.surface4",
  "demo.surface5",
];

export function BeforeAfter() {
  const t = useT();
  return (
    <section id="demo" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">{t("demo.kicker")}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">{t("demo.title")}</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {t("demo.subtitle")}
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border shadow-elevated bg-gradient-soft">
          <img src={usesImg} alt={t("demo.imgAlt")} loading="lazy" className="w-full h-auto" />
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {surfaceKeys.map((k) => (
            <div key={k} className="px-4 py-2 rounded-full bg-muted text-center text-sm font-medium">
              {t(k)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
