import { useEffect, useState } from "react";
import { ShoppingBag, Sparkles, LogOut, User, Package, ChevronDown, Globe, Wrench } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { useAuth } from "@/lib/auth";
import { useI18n, useT } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

function LangToggle() {
  const { lang, setLang } = useI18n();
  const t = useT();
  return (
    <button
      onClick={() => setLang(lang === "fr" ? "en" : "fr")}
      aria-label={t("lang.switch")}
      className="h-10 px-3 flex items-center gap-1.5 rounded-full border border-border hover:border-primary hover:bg-accent transition-all text-xs font-bold uppercase"
    >
      <Globe className="h-3.5 w-3.5" />
      {lang === "fr" ? "EN" : "FR"}
    </button>
  );
}

export function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  const { user, session, loading, openAuthDialog, signOut } = useAuth();
  const t = useT();
  const [isAdmin, setIsAdmin] = useState(false);

  // Discreet owner check: only show the Admin link when the server confirms.
  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    fetch("/api/admin/me", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((res) => {
        if (active) setIsAdmin(res.ok);
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      });
    return () => {
      active = false;
    };
  }, [session]);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center shadow-soft transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-base tracking-tight">
            Vapor<span className="text-primary">Pro</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">{t("nav.advantages")}</a>
          <a href="#demo" className="hover:text-foreground transition-colors">{t("nav.demo")}</a>
          <a href="#box" className="hover:text-foreground transition-colors">{t("nav.contents")}</a>
          <a href="#avis" className="hover:text-foreground transition-colors">{t("nav.reviews")}</a>
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />

          {!loading &&
            (user ? (
              <>
                <Link
                  to="/mes-commandes"
                  className="hidden sm:flex items-center gap-1.5 h-10 px-3 rounded-full border border-border hover:border-primary hover:bg-accent transition-all text-xs font-medium"
                >
                  <Package className="h-3.5 w-3.5" />
                  {t("nav.myOrders")}
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-10 px-3 flex items-center gap-1.5 rounded-full border border-border hover:border-primary hover:bg-accent transition-all text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <User className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="hidden sm:inline max-w-[160px] truncate">{user.email}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/mes-commandes" className="cursor-pointer">
                        <Package className="h-4 w-4" />
                        {t("nav.myOrders")}
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Wrench className="h-4 w-4" />
                          Admin
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => void signOut()} className="cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      {t("nav.signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <button
                onClick={openAuthDialog}
                className="h-10 px-4 grid place-items-center rounded-full border border-border hover:border-primary hover:bg-accent transition-all text-sm font-medium"
              >
                {t("nav.signIn")}
              </button>
            ))}

          <button
            onClick={onCartOpen}
            aria-label={t("nav.openCart")}
            className="relative h-10 w-10 grid place-items-center rounded-full border border-border hover:border-primary hover:bg-accent transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold animate-float-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
