import { ShieldCheck, Lock, Plus, Truck, Leaf, Zap } from "lucide-react";
import { HeroGallery } from "./HeroGallery";

import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

interface HeroProps {
  onAddToCart: () => void;
}

export function Hero({ onAddToCart }: HeroProps) {
  const t = useT();

  const chips: { icon: typeof Zap; key: TKey }[] = [
    { icon: Zap, key: "hero.chip.steam" },
    { icon: Leaf, key: "hero.chip.noChem" },
    { icon: Truck, key: "hero.chip.delivery" },
  ];

  const trust: { icon: typeof Lock; key: TKey }[] = [
    { icon: Lock, key: "hero.trust.secure" },
    { icon: Truck, key: "hero.trust.delivery" },
    { icon: ShieldCheck, key: "hero.trust.warranty" },
  ];

  return (
    <section id="top" className="relative overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 -z-10 opacity-40"
        style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.9 0.08 195 / 0.5), transparent)" }} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
        <HeroGallery />

        <div className="flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 self-start bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            {t("hero.badge")}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.05] text-balance">
            {t("hero.title.before")}
            <span className="text-primary">{t("hero.title.highlight")}</span>
            {t("hero.title.after")}
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed">
            {t("hero.subtitle.before")}
            <strong className="text-foreground">132°C</strong>
            {t("hero.subtitle.after")}
          </p>

          <div className="grid grid-cols-3 gap-2 text-[11px] sm:text-xs">
            {chips.map((b) => (
              <div key={b.key} className="flex items-center gap-1.5 p-2 rounded-lg bg-card border border-border/60">
                <b.icon className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="font-semibold">{t(b.key)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-4xl font-extrabold font-display text-primary-deep">$85</span>
            <span className="bg-success/10 text-success font-bold text-xs px-2 py-1 rounded">{t("hero.shippingIncluded")}</span>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">{t("hero.allIncluded")}</p>

          <button
            onClick={onAddToCart}
            className="group relative w-full h-14 rounded-2xl bg-gradient-primary text-primary-foreground font-bold text-base shadow-cta animate-pulse-cta hover:scale-[1.01] active:scale-[0.99] transition-transform flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
            {t("hero.addToCart")}
          </button>

          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] sm:text-xs">
            {trust.map((b) => (
              <div key={b.key} className="flex flex-col items-center text-center gap-1 p-2 rounded-lg bg-card border border-border/60">
                <b.icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">{t(b.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
