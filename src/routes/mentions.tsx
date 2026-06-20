import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, MailLink } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/mentions")({
  head: () => ({
    meta: [{ title: "Mentions légales — VaporPro" }],
  }),
  component: MentionsPage,
});

function MentionsPage() {
  return (
    <LegalLayout title="Mentions légales">
      <p>
        Site : VaporPro. Contact : <MailLink />.
      </p>
      <p>
        Hébergement : Vercel Inc. Le contenu du site (textes, images) est la
        propriété de VaporPro et ne peut être reproduit sans autorisation.
      </p>
    </LegalLayout>
  );
}
