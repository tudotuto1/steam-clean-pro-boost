import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, Section, MailLink } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [{ title: "Politique de confidentialité — VaporPro" }],
  }),
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <p>
        VaporPro protège vos renseignements personnels conformément à la Loi 25
        du Québec.
      </p>

      <Section title="1. Renseignements recueillis">
        <p>
          Nom, adresse courriel, adresse de livraison ; historique d'achat et
          numéro de suivi ; note, commentaire et photos des avis que vous
          publiez ; paiement traité directement par Stripe (nous ne stockons
          jamais vos numéros de carte).
        </p>
      </Section>

      <Section title="2. Finalités">
        <p>
          Traiter et livrer vos commandes, assurer le service après-vente,
          afficher les avis vérifiés, respecter nos obligations légales.
        </p>
      </Section>

      <Section title="3. Communication à des tiers">
        <p>
          Minimum nécessaire à : Stripe (paiement), Supabase (hébergement
          compte/commandes), Vercel (hébergement du site), fournisseurs
          d'expédition (livraison). Nous ne vendons jamais vos renseignements.
        </p>
      </Section>

      <Section title="4. Traitement hors Québec">
        <p>
          Certains prestataires traitent des données à l'extérieur du Québec et
          du Canada (notamment aux États-Unis) ; en utilisant le site, vous y
          consentez.
        </p>
      </Section>

      <Section title="5. Conservation">
        <p>
          Aussi longtemps que nécessaire et selon nos obligations légales, puis
          suppression.
        </p>
      </Section>

      <Section title="6. Vos droits (Loi 25)">
        <p>
          Accès, rectification, suppression, retrait du consentement,
          portabilité. Écrivez à <MailLink />.
        </p>
      </Section>

      <Section title="7. Témoins">
        <p>Témoins essentiels au fonctionnement (connexion, panier).</p>
      </Section>

      <Section title="8. Responsable de la protection des renseignements personnels">
        <p>
          <MailLink />.
        </p>
      </Section>
    </LegalLayout>
  );
}
