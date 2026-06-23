import { useState } from "react";
import mainImg from "@/assets/product-main.jpeg";
import usesImg from "@/assets/product-uses.jpeg";
import featuresImg from "@/assets/product-features.jpeg";
import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const imageData: { src: string; altKey: TKey }[] = [
  { src: mainImg, altKey: "gallery.alt.main" },
  { src: usesImg, altKey: "gallery.alt.uses" },
  { src: featuresImg, altKey: "gallery.alt.features" },
];

export function HeroGallery() {
  const t = useT();
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square rounded-3xl bg-gradient-soft overflow-hidden shadow-elevated border border-border/60">
        <img
          key={active}
          src={imageData[active].src}
          alt={t(imageData[active].altKey)}
          className="w-full h-full object-contain p-4 animate-float-in"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {imageData.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`${t("gallery.viewImage")} ${i + 1}`}
            className={`aspect-square rounded-xl overflow-hidden border-2 bg-gradient-soft transition-all ${
              active === i ? "border-primary shadow-soft scale-[0.98]" : "border-border opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img.src} alt={t(img.altKey)} loading="lazy" className="w-full h-full object-contain p-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
