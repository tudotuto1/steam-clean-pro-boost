import { Truck, Tag, ShieldCheck, Package } from "lucide-react";

import { useT } from "@/lib/i18n";
import type { TKey } from "@/lib/locales/fr";

const items: { icon: typeof Truck; key: TKey }[] = [
  { icon: Truck, key: "announce.shipped" },
  { icon: Package, key: "announce.delivery" },
  { icon: Tag, key: "announce.price" },
  { icon: ShieldCheck, key: "announce.warranty" },
];

export function AnnouncementBar() {
  const t = useT();
  return (
    <div className="bg-gradient-primary text-primary-foreground overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-2 text-xs sm:text-sm font-medium">
        {[...items, ...items, ...items, ...items].map((Item, i) => (
          <span key={i} className="flex items-center gap-2 px-6">
            <Item.icon className="h-3.5 w-3.5" />
            {t(Item.key)}
          </span>
        ))}
      </div>
    </div>
  );
}
