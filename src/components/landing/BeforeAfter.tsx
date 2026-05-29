import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import kitchen from "@/assets/before-after-kitchen.jpg";
import bathroom from "@/assets/before-after-bathroom.jpg";
import sofa from "@/assets/before-after-sofa.jpg";

const surfaces = [
  { id: "kitchen", label: "Graisse Cuisine", img: kitchen },
  { id: "bathroom", label: "Joints Salle de Bain", img: bathroom },
  { id: "sofa", label: "Taches Canapé", img: sofa },
];

function Slider({ img, alt }: { img: string; alt: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border shadow-elevated select-none cursor-ew-resize bg-muted touch-none"
      onMouseMove={(e) => e.buttons === 1 && move(e.clientX)}
      onMouseDown={(e) => move(e.clientX)}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
    >
      <img src={img} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={img} alt="" className="absolute inset-0 h-full object-cover" style={{ width: `${10000 / pos}%`, maxWidth: "none" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/10 to-transparent" />
      </div>

      <span className="absolute top-3 left-3 bg-foreground/80 text-background text-[10px] font-bold px-2 py-1 rounded">AVANT</span>
      <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded">APRÈS</span>

      <div className="absolute inset-y-0 w-0.5 bg-primary-foreground shadow-cta pointer-events-none" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-gradient-primary grid place-items-center shadow-elevated">
          <GripVertical className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [active, setActive] = useState(surfaces[0]);
  return (
    <section id="demo" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">La Preuve en Image</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">Glissez et voyez la différence</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Aucun trucage, aucun produit chimique. Juste la puissance de la vapeur à haute pression sur de vraies surfaces.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {surfaces.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                active.id === s.id
                  ? "bg-foreground text-background shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <Slider key={active.id} img={active.img} alt={active.label} />
      </div>
    </section>
  );
}
