import { useEffect, useState } from "react";
import heroImg from "@/assets/steam-cleaner-hero.jpg";

interface Props {
  onBuy: () => void;
}

export function MobileStickyCTA({ onBuy }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-background/95 backdrop-blur-xl border-t border-border shadow-elevated animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-soft border border-border overflow-hidden flex-shrink-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground line-clamp-1">Nettoyeur Vapeur Pro · Livré 3-7 j</div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-primary-deep">$69.99</span>
            <span className="text-xs text-muted-foreground line-through">$139.99</span>
          </div>
        </div>
        <button
          onClick={onBuy}
          className="h-12 px-5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-cta whitespace-nowrap active:scale-95 transition-transform"
        >
          Acheter
        </button>
      </div>
    </div>
  );
}
