import { ShieldCheck, Truck, Headphones, Lock, Leaf, Package, Clock, Tag } from "lucide-react";

import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const promises: { icon: typeof Truck; titleKey: TKey; textKey: TKey }[] = [
  { icon: Truck, titleKey: "trust.promise0.title", textKey: "trust.promise0.text" },
  { icon: Tag, titleKey: "trust.promise1.title", textKey: "trust.promise1.text" },
  { icon: ShieldCheck, titleKey: "trust.promise2.title", textKey: "trust.promise2.text" },
  { icon: Lock, titleKey: "trust.promise3.title", textKey: "trust.promise3.text" },
  { icon: Headphones, titleKey: "trust.promise4.title", textKey: "trust.promise4.text" },
  { icon: Leaf, titleKey: "trust.promise5.title", textKey: "trust.promise5.text" },
];

const faqs: { qKey: TKey; aKey: TKey }[] = [
  { qKey: "faq.q0", aKey: "faq.a0" },
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
];

export function Reviews() {
  const t = useT();
  return (
    <section id="confiance" className="py-16 sm:py-24 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">{t("trust.kicker")}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            {t("trust.title")}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            {t("trust.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {promises.map((p) => (
            <article key={p.titleKey} className="p-6 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all hover:-translate-y-0.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-primary grid place-items-center mb-4">
                <p.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{t(p.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(p.textKey)}</p>
            </article>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">{t("faq.kicker")}</span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-balance">
              {t("faq.title")}
            </h3>
            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm">
                <strong>{t("faq.note1.label")}</strong> {t("faq.note1.text")}
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <Package className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm">
                <strong>{t("faq.note2.label")}</strong> {t("faq.note2.text")}
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            {faqs.map((f) => (
              <details key={f.qKey} className="group p-5 rounded-2xl bg-card border border-border open:shadow-soft transition-shadow">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{t(f.qKey)}</span>
                  <span className="h-6 w-6 rounded-full bg-muted grid place-items-center text-primary text-lg leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t(f.aKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
