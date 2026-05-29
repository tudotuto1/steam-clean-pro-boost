import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { Features } from "@/components/landing/Features";
import { InTheBox } from "@/components/landing/InTheBox";
import { Reviews } from "@/components/landing/Reviews";
import { MobileStickyCTA } from "@/components/landing/MobileStickyCTA";
import { CartDrawer } from "@/components/landing/CartDrawer";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VaporPro — Nettoyeur Vapeur Haute Pression | -50% Aujourd'hui" },
      { name: "description", content: "Éliminez 99,9% des bactéries et de la graisse sans produits chimiques. Vapeur 132°C, kit 9 accessoires, livraison gratuite et garantie 30 jours." },
      { property: "og:title", content: "VaporPro — Nettoyeur Vapeur Haute Pression" },
      { property: "og:description", content: "Désinfection à 132°C, zéro chimie. -50% aujourd'hui seulement." },
    ],
  }),
  component: Index,
});

function Index() {
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const addToCart = () => {
    setQuantity((q) => Math.max(1, q + 1));
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar cartCount={quantity} onCartOpen={() => setCartOpen(true)} />
      <main>
        <Hero onAddToCart={addToCart} />
        <BeforeAfter />
        <Features />
        <InTheBox />
        <Reviews />
      </main>
      <Footer />
      <MobileStickyCTA onBuy={addToCart} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} quantity={quantity} setQuantity={setQuantity} />
    </div>
  );
}
