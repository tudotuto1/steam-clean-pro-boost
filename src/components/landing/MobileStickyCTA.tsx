import { useEffect, useState } from "react";
import mainImg from "@/assets/product-main.jpeg";
import { useT } from "@/lib/i18n";

interface Props {
  onBuy: () => void;
}

export function MobileStickyCTA({ onBuy }: Props) {
  const t = useT();
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
          <img src={mainImg} alt="" className="w-full h-full object-contain p-0.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted-foreground line-clamp-1">{t("mobileCta.product")}</div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-base text-primary-deep">$85</span>
            <span className="text-[10px] text-success font-semibold">{t("mobileCta.shippingIncluded")}</span>
          </div>
        </div>
        <button
          onClick={onBuy}
          className="h-12 px-5 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-sm shadow-cta whitespace-nowrap active:scale-95 transition-transform"
        >
          {t("mobileCta.buy")}
        </button>
      </div>
    </div>
  );
}
