import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, LegalParagraph } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact — VaporPro" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalLayout titleKey="legal.contact.title">
      <LegalParagraph textKey="legal.contact.p1" />
      <LegalParagraph textKey="legal.contact.p2" />
      <LegalParagraph textKey="legal.contact.p3" />
    </LegalLayout>
  );
}
