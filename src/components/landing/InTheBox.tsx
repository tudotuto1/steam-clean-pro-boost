import { Check } from "lucide-react";
import accessoriesImg from "@/assets/steam-accessories.jpg";

const items = [
  "Appareil principal vapeur",
  "Buse de précision longue",
  "Brosse ronde en nylon",
  "Brosse ronde métallique",
  "Raclette vitres & miroirs",
  "Embout coudé 45°",
  "Tuyau de rallonge flexible",
  "Embout textile + chiffon",
  "Entonnoir & gobelet doseur",
];

export function InTheBox() {
  return (
    <section id="box" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-soft border border-border shadow-elevated">
            <img src={accessoriesImg} alt="Tous les accessoires inclus" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:right-6 bg-foreground text-background rounded-2xl px-5 py-3 shadow-elevated">
            <div className="text-xs text-background/70">Coffret complet</div>
            <div className="font-bold text-lg">9 accessoires inclus</div>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold tracking-widest text-primary uppercase">Contenu du Coffret</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-balance">
            9 accessoires premium inclus
          </h2>
          <p className="mt-3 text-muted-foreground">
            Chaque pièce a été pensée pour une surface précise. Vous recevez un coffret complet, prêt à l'emploi dès l'ouverture.
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-2">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 hover:bg-accent transition-colors">
                <span className="h-6 w-6 rounded-full bg-gradient-primary grid place-items-center flex-shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
                </span>
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
