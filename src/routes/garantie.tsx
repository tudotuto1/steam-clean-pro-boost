import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, Section, MailLink } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/garantie")({
  head: () => ({
    meta: [{ title: "Garantie — VaporPro" }],
  }),
  component: GarantiePage,
});

function GarantiePage() {
  return (
    <LegalLayout title="Garantie">
      <p>
        Garantie constructeur de 2 ans à compter de la réception, contre les
        défauts de fabrication.
      </p>

      <Section title="Couvert">
        <p>Défauts de matériaux ou de fabrication en usage normal.</p>
      </Section>

      <Section title="Non couvert">
        <p>
          Usure normale, mauvaise utilisation, chute, eau non conforme,
          réparation non autorisée.
        </p>
      </Section>

      <Section title="Réclamation">
        <p>
          Écrire à <MailLink /> avec le numéro de commande et une description
          (photos utiles). Après vérification, l'appareil est réparé ou remplacé.
        </p>
      </Section>
    </LegalLayout>
  );
}
