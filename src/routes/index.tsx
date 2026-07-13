import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { track, CONTENT_ID, CURRENCY, PRICE } from "@/lib/pixel";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BeforeAfter } from "@/components/landing/BeforeAfter";
import { Features } from "@/components/landing/Features";
import { InTheBox } from "@/components/landing/InTheBox";
import { Reviews } from "@/components/landing/Reviews";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { MobileStickyCTA } from "@/components/landing/MobileStickyCTA";
import { CartDrawer } from "@/components/landing/CartDrawer";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VaporPro — Nettoyeur Vapeur Haute Pression | Canada & USA" },
      { name: "description", content: "Vapeur sèche à 132°C, coffret 9 accessoires, sans produits chimiques. $85 tout inclus, livraison Canada & USA en 5 à 8 jours via nos fournisseurs partenaires." },
      { property: "og:title", content: "VaporPro — Nettoyeur Vapeur Haute Pression" },
      { property: "og:description", content: "Dégraisse et assainit à 132°C, zéro chimie. $85 livraison incluse au Canada & USA en 5-8 jours." },
    ],
  }),
  component: Index,
});

function Index() {
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);

  // Meta Pixel ViewContent — once on landing.
  useEffect(() => {
    track("ViewContent", {
      content_ids: [CONTENT_ID],
      content_type: "product",
      content_name: "VaporPro",
      value: PRICE,
      currency: CURRENCY,
    });
  }, []);

  const addToCart = () => {
    const next = Math.max(1, quantity + 1);
    setQuantity(next);
    setCartOpen(true);
    track("AddToCart", {
      content_ids: [CONTENT_ID],
      content_type: "product",
      value: PRICE * next,
      currency: CURRENCY,
      contents: [{ id: CONTENT_ID, quantity: next }],
    });
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
        <ReviewsSection />
        <Reviews />
      </main>
      <Footer />
      <MobileStickyCTA onBuy={addToCart} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} quantity={quantity} setQuantity={setQuantity} />
    </div>
  );
}
