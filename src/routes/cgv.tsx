import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, Section, MailLink } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [{ title: "Conditions générales de vente — VaporPro" }],
  }),
  component: CgvPage,
});

function CgvPage() {
  return (
    <LegalLayout title="Conditions générales de vente">
      <Section title="1. Identité">
        <p>
          Le site VaporPro vend un nettoyeur vapeur haute pression et ses
          accessoires. Questions : <MailLink />.
        </p>
      </Section>

      <Section title="2. Produits et prix">
        <p>
          Les prix sont en dollars canadiens (CAD), livraison incluse. Le prix
          de 85 $ CAD comprend l'appareil, le coffret de 9 accessoires et la
          livraison au Canada et aux États-Unis. Le prix applicable est celui
          affiché au moment de la commande.
        </p>
      </Section>

      <Section title="3. Commande">
        <p>
          La commande est confirmée après réception du paiement ; un courriel de
          confirmation est envoyé. Vous devez fournir des renseignements exacts
          (nom, adresse, courriel).
        </p>
      </Section>

      <Section title="4. Paiement">
        <p>
          Les paiements sont traités de façon sécurisée par Stripe. Nous n'avons
          jamais accès à vos numéros de carte.
        </p>
      </Section>

      <Section title="5. Livraison">
        <p>
          Les produits sont expédiés par nos fournisseurs partenaires. Délai
          estimé : 5 à 8 jours ouvrables (après 24 à 48 h de préparation), au
          Canada et aux États-Unis. Un numéro de suivi est transmis dès
          l'expédition. Délais donnés à titre indicatif.
        </p>
      </Section>

      <Section title="6. Retours et remboursements">
        <p>
          Vous disposez de 14 jours après réception pour demander un retour. Le
          produit doit être inutilisé, dans son emballage d'origine. Écrivez à{" "}
          <MailLink /> pour les instructions. Les frais de retour sont à votre
          charge, sauf produit défectueux ou erreur de notre part (dans ce cas
          nous les prenons en charge). Remboursement sur le mode de paiement
          d'origine après réception et inspection, généralement sous 5 à 10
          jours ouvrables.
        </p>
      </Section>

      <Section title="7. Garantie">
        <p>
          Garantie constructeur de 2 ans contre les défauts de fabrication (voir
          page Garantie).
        </p>
      </Section>

      <Section title="8. Responsabilité">
        <p>
          Notre responsabilité se limite au montant de la commande. Nous ne
          sommes pas responsables d'un usage non conforme.
        </p>
      </Section>

      <Section title="9. Droit applicable">
        <p>
          Lois de la province de Québec et du Canada ; tribunaux compétents du
          Québec.
        </p>
      </Section>
    </LegalLayout>
  );
}
