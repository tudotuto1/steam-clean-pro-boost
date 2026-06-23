import { Check } from "lucide-react";
import accessoriesImg from "@/assets/product-main.jpeg";

import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const itemKeys: TKey[] = [
  "box.item0",
  "box.item1",
  "box.item2",
  "box.item3",
  "box.item4",
  "box.item5",
  "box.item6",
  "box.item7",
  "box.item8",
];

export function InTheBox() {
  const t = useT();
  return (
    <section id="box" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-soft border border-border shadow-elevated">
            <img src={accessoriesImg} alt={t("box.imgAlt")} loading="lazy" className="w-full h-full object-contain p-4" />
          </div>
          <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 bg-foreground text-background rounded-2xl px-5 py-3 shadow-elevated">
            <div className="text-xs text-background/70">{t("box.badgeLabel")}</div>
            <div className="font-bold text-lg">{t("box.badgeValue")}</div>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase">{t("box.kicker")}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            {t("box.title")}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t("box.subtitle")}
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-2">
            {itemKeys.map((k) => (
              <li key={k} className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 hover:bg-accent transition-colors">
                <span className="h-6 w-6 rounded-full bg-gradient-primary grid place-items-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium">{t(k)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
