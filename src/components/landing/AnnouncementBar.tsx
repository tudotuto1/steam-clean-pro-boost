import { Truck, Tag, ShieldCheck } from "lucide-react";

const items = [
  { icon: Truck, text: "Livraison Gratuite en France" },
  { icon: Tag, text: "-50% Aujourd'hui Seulement" },
  { icon: ShieldCheck, text: "Garantie Satisfait ou Remboursé 30 Jours" },
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
