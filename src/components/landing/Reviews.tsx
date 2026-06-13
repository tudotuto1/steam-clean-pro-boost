import { ShieldCheck, Truck, RotateCcw, Headphones, Lock, Leaf, Package, Clock } from "lucide-react";

const promises = [
  {
    icon: Truck,
    title: "Livraison 3 à 7 jours ouvrables",
    text: "Expédié partout au Canada et aux USA via nos fournisseurs partenaires. Un numéro de suivi vous est envoyé dès l'expédition.",
  },
  {
    icon: RotateCcw,
    title: "30 jours pour l'essayer chez vous",
    text: "Pas convaincu ? Retournez l'appareil dans les 30 jours et nous vous remboursons intégralement. Sans justification compliquée.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie 2 ans constructeur",
    text: "En cas de défaut, l'appareil est remplacé. Vous achetez l'esprit tranquille, pas un produit jetable.",
  },
  {
    icon: Lock,
    title: "Paiement 100% sécurisé",
    text: "Chiffrement SSL et passerelle de paiement reconnue. Carte de crédit, Apple Pay, Google Pay et PayPal acceptés.",
  },
  {
    icon: Headphones,
    title: "Support humain, en français",
    text: "Une question avant ou après l'achat ? Notre équipe répond par courriel sous 24 h ouvrables.",
  },
  {
    icon: Leaf,
    title: "Honnête sur ce que ça fait",
    text: "La vapeur à 132°C dégraisse, ravive les joints et assainit. Ce n'est pas magique : on vous explique exactement comment l'utiliser.",
  },
];

const faqs = [
  {
    q: "Quand vais-je recevoir ma commande ?",
    a: "Votre commande est préparée sous 24 à 48 h, puis expédiée par nos fournisseurs partenaires. Comptez 3 à 7 jours ouvrables pour la livraison au Canada et aux USA. Vous recevez un numéro de suivi par courriel dès l'envoi.",
  },
  {
    q: "Combien coûte la livraison ?",
    a: "La livraison standard est offerte pour toute commande supérieure à $80. En dessous, des frais fixes sont calculés au moment du paiement selon votre adresse.",
  },
  {
    q: "Est-ce vraiment efficace sans produits chimiques ?",
    a: "Oui. La vapeur sèche à 132°C dissout la graisse cuite, ramollit le calcaire et neutralise les bactéries et acariens sur la majorité des surfaces. Vous n'avez besoin que d'eau du robinet.",
  },
  {
    q: "Sur quoi puis-je l'utiliser ?",
    a: "Plaques de cuisson, hotte, joints de carrelage, robinetterie, sièges et tapis de voiture, jantes, canapés en tissu, matelas, vitres. Évitez le cuir non traité, le bois brut et les écrans.",
  },
  {
    q: "Et si je ne suis pas satisfait ?",
    a: "Vous avez 30 jours après réception pour nous écrire et obtenir un remboursement complet. Aucun piège.",
  },
];

export function Reviews() {
  return (
    <section id="confiance" className="py-16 sm:py-24 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Nos Engagements</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            Acheter en ligne mérite de la transparence
          </h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Voici exactement ce que vous obtenez en commandant aujourd'hui. Pas de faux compteurs, pas de fausses promesses.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {promises.map((p) => (
            <article key={p.title} className="p-6 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all hover:-translate-y-0.5">
              <div className="h-11 w-11 rounded-xl bg-gradient-primary grid place-items-center mb-4">
                <p.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </article>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">FAQ</span>
            <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-balance">
              Les réponses claires aux questions qu'on nous pose le plus
            </h3>
            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm">
                <strong>Délai de livraison&nbsp;:</strong> 3 à 7 jours ouvrables au Canada et aux USA, via nos fournisseurs partenaires.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <Package className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm">
                <strong>Suivi en temps réel</strong> envoyé par courriel dès que votre colis quitte l'entrepôt.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 rounded-2xl bg-card border border-border open:shadow-soft transition-shadow">
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between gap-4">
                  <span>{f.q}</span>
                  <span className="h-6 w-6 rounded-full bg-muted grid place-items-center text-primary text-lg leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
