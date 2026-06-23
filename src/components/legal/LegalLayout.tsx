import { Fragment, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const SUPPORT_EMAIL = "vaporprosupport@gmail.com";

export function LegalLayout({
  titleKey,
  children,
}: {
  titleKey: TKey;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-base tracking-tight">
              Vapor<span className="text-primary">Pro</span>
            </span>
          </Link>
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.backToShop")}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold">{t(titleKey)}</h1>
        <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
        <p className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground">
          {t("legal.lastUpdated")}
        </p>
      </main>
    </div>
  );
}

/** Renders a translated string, replacing `{email}` tokens with a mailto link. */
export function RichText({ textKey }: { textKey: TKey }) {
  const t = useT();
  const parts = t(textKey).split("{email}");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-primary hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
          )}
        </Fragment>
      ))}
    </>
  );
}

/** A numbered/labelled legal section: heading + paragraph body. */
export function LegalSection({
  titleKey,
  bodyKey,
}: {
  titleKey: TKey;
  bodyKey: TKey;
}) {
  const t = useT();
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">{t(titleKey)}</h2>
      <p className="mt-2">
        <RichText textKey={bodyKey} />
      </p>
    </section>
  );
}

/** A standalone paragraph (intro / contact lines). */
export function LegalParagraph({ textKey }: { textKey: TKey }) {
  return (
    <p>
      <RichText textKey={textKey} />
    </p>
  );
}
