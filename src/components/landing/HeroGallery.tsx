import { useState } from "react";
import heroImg from "@/assets/steam-cleaner-hero.jpg";
import kitchenImg from "@/assets/steam-kitchen.jpg";
import accessoriesImg from "@/assets/steam-accessories.jpg";

const images = [
  { src: heroImg, alt: "Nettoyeur vapeur haute pression" },
  { src: kitchenImg, alt: "Nettoyage cuisine à la vapeur" },
  { src: accessoriesImg, alt: "Kit d'accessoires inclus" },
];

export function HeroGallery() {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square rounded-3xl bg-gradient-soft overflow-hidden shadow-elevated border border-border/60">
        <div className="absolute top-4 left-4 z-10 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
          -50% AUJOURD'HUI
        </div>
        <img
          key={active}
          src={images[active].src}
          alt={images[active].alt}
          width={1024}
          height={1024}
          className="w-full h-full object-cover animate-float-in"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Voir image ${i + 1}`}
            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
              active === i ? "border-primary shadow-soft scale-[0.98]" : "border-border opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
