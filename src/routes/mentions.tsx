import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, LegalParagraph } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/mentions")({
  head: () => ({
    meta: [{ title: "Mentions légales — VaporPro" }],
  }),
  component: MentionsPage,
});

function MentionsPage() {
  return (
    <LegalLayout titleKey="legal.mentions.title">
      <LegalParagraph textKey="legal.mentions.p1" />
      <LegalParagraph textKey="legal.mentions.p2" />
    </LegalLayout>
  );
}
