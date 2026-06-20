import usesImg from "@/assets/product-uses.jpeg";

const surfaces = [
  "Fenêtres & vitres",
  "Canapés & meubles",
  "Cuisine & plaques",
  "Toilettes & sanitaires",
  "Jantes & pneus",
  "Rideaux & textiles",
];

export function BeforeAfter() {
  return (
    <section id="demo" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Utilisations</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">Un seul appareil, partout dans la maison</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Vitres, meubles, cuisine, sanitaires, voiture, textiles : la vapeur haute pression remplace plusieurs produits ménagers.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-border shadow-elevated bg-gradient-soft">
          <img src={usesImg} alt="Surfaces compatibles avec le nettoyeur vapeur" loading="lazy" className="w-full h-auto" />
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {surfaces.map((s) => (
            <div key={s} className="px-4 py-2 rounded-full bg-muted text-center text-sm font-medium">
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
