import { Truck, Tag, ShieldCheck, Package } from "lucide-react";

const items = [
  { icon: Truck, text: "Expédié au Canada & USA" },
  { icon: Package, text: "Livraison 5 à 8 jours via nos partenaires" },
  { icon: Tag, text: "Prix tout inclus : $85 livraison comprise" },
  { icon: ShieldCheck, text: "Garantie 2 ans constructeur" },
];

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-primary text-primary-foreground overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2 text-xs sm:text-sm font-medium">
        {[...items, ...items, ...items, ...items].map((Item, i) => (
          <span key={i} className="flex items-center gap-2 px-6">
            <Item.icon className="h-3.5 w-3.5" />
            {Item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
