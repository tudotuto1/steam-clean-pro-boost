import { Flame, Leaf, Layers, Package } from "lucide-react";

const features = [
  {
    icon: Flame,
    title: "Vapeur Ultra-Chaude",
    desc: "De 100°C à 132°C pour une sanitisation instantanée. Élimine 99,9% des bactéries, virus et acariens.",
  },
  {
    icon: Leaf,
    title: "100% Écologique",
    desc: "Uniquement de l'eau. Zéro produit chimique, zéro résidu toxique. Sûr pour vos enfants et animaux.",
  },
  {
    icon: Layers,
    title: "Multi-Surfaces",
    desc: "Vitres, meubles, cuisine, pneus de voiture, vêtements, sanitaires. Un seul outil pour toute la maison.",
  },
  {
    icon: Package,
    title: "Kit 9 Accessoires",
    desc: "Brosses, buses, rallonges, raclette vitres. Tout ce dont vous avez besoin est inclus.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Pourquoi VaporPro</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            Le nettoyage repensé pour la maison moderne
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-glow grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
