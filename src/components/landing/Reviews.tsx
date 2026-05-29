import { Star, BadgeCheck, Camera } from "lucide-react";

const reviews = [
  {
    name: "Sophie M.",
    initial: "S",
    location: "Lyon",
    rating: 5,
    title: "Bluffant sur les joints de salle de bain",
    text: "Mes joints étaient noirs depuis des années. 10 minutes et ils sont blancs comme neuf. Je n'en reviens pas.",
    photos: 2,
    days: 3,
  },
  {
    name: "Karim B.",
    initial: "K",
    location: "Paris",
    rating: 5,
    title: "Adieu les produits chimiques",
    text: "On a deux enfants en bas âge, je voulais arrêter la javel. Là on désinfecte tout à la vapeur, c'est top.",
    photos: 1,
    days: 7,
  },
  {
    name: "Émilie R.",
    initial: "É",
    location: "Bordeaux",
    rating: 4,
    title: "La hotte de cuisine sauvée",
    text: "La graisse cuite partait toute seule sur ma hotte en inox. Livraison rapide en plus.",
    photos: 3,
    days: 12,
  },
  {
    name: "Antoine D.",
    initial: "A",
    location: "Marseille",
    rating: 5,
    title: "Parfait pour la voiture",
    text: "J'ai nettoyé mes sièges en tissu et les jantes. Résultat pro sans aller au lavage auto.",
    photos: 2,
    days: 15,
  },
  {
    name: "Nadia C.",
    initial: "N",
    location: "Toulouse",
    rating: 5,
    title: "Rapide à chauffer",
    text: "Moins de 3 minutes pour être prêt. Très maniable, même pour les surfaces verticales.",
    photos: 0,
    days: 21,
  },
  {
    name: "Julien P.",
    initial: "J",
    location: "Nantes",
    rating: 5,
    title: "Le SAV est au top",
    text: "Petite question avant achat, réponse en 1h. Le produit est à la hauteur, je recommande.",
    photos: 1,
    days: 28,
  },
];

export function Reviews() {
  return (
    <section id="avis" className="py-16 sm:py-24 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Avis Vérifiés</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            1 420+ clients ont déjà transformé leur quotidien
          </h2>
          <div className="mt-4 inline-flex items-center gap-3 bg-card border border-border rounded-full px-5 py-2 shadow-soft">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <span className="font-bold">4,8</span>
            <span className="text-sm text-muted-foreground">/ 5 — 1 420 avis</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <article key={r.name} className="p-5 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all hover:-translate-y-0.5">
              <header className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-bold">
                  {r.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm truncate">{r.name}</span>
                    <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <span className="text-xs text-muted-foreground">{r.location} · il y a {r.days}j</span>
                </div>
              </header>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-warning text-warning" : "text-border"}`} />
                ))}
              </div>
              <h4 className="font-semibold text-sm mb-1.5">{r.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
              {r.photos > 0 && (
                <div className="flex gap-2 mt-3">
                  {[...Array(r.photos)].map((_, i) => (
                    <div key={i} className="h-14 w-14 rounded-lg bg-muted border border-border grid place-items-center text-muted-foreground">
                      <Camera className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
