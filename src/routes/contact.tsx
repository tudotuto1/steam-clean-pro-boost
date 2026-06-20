import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, MailLink } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact — VaporPro" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalLayout title="Contact">
      <p>
        Une question avant ou après l'achat ? Réponse par courriel sous 24 heures
        ouvrables.
      </p>
      <p>
        Courriel : <MailLink />
      </p>
      <p>
        Pour le suivi, un retour ou la garantie, indiquez votre numéro de
        commande.
      </p>
    </LegalLayout>
  );
}
