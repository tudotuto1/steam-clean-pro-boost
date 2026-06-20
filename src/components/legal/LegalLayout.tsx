import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const SUPPORT_EMAIL = "vaporprosupport@gmail.com";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
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
            Retour à la boutique
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        <div className="mt-6 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
        <p className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground">
          Dernière mise à jour : 20 juin 2026
        </p>
      </main>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-2">{children}</div>
    </section>
  );
}

export function MailLink() {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
      {SUPPORT_EMAIL}
    </a>
  );
}
