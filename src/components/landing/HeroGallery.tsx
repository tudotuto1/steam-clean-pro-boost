import { useState } from "react";
import mainImg from "@/assets/product-main.jpeg";
import usesImg from "@/assets/product-uses.jpeg";
import featuresImg from "@/assets/product-features.jpeg";

const images = [
  { src: mainImg, alt: "Nettoyeur vapeur haute pression et ses 9 accessoires" },
  { src: usesImg, alt: "Surfaces compatibles : vitres, meubles, cuisine, sanitaires, pneus, textiles" },
  { src: featuresImg, alt: "Caractéristiques techniques de l'appareil" },
];

export function HeroGallery() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square rounded-3xl bg-gradient-soft overflow-hidden shadow-elevated border border-border/60">
        <img
          key={active}
          src={images[active].src}
          alt={images[active].alt}
          className="w-full h-full object-contain p-4 animate-float-in"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Voir image ${i + 1}`}
            className={`aspect-square rounded-xl overflow-hidden border-2 bg-gradient-soft transition-all ${
              active === i ? "border-primary shadow-soft scale-[0.98]" : "border-border opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-contain p-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
