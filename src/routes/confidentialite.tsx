import { createFileRoute } from "@tanstack/react-router";

import {
  LegalLayout,
  LegalSection,
  LegalParagraph,
} from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [{ title: "Politique de confidentialité — VaporPro" }],
  }),
  component: ConfidentialitePage,
});

function ConfidentialitePage() {
  return (
    <LegalLayout titleKey="legal.privacy.title">
      <LegalParagraph textKey="legal.privacy.intro" />
      <LegalSection titleKey="legal.privacy.s1.title" bodyKey="legal.privacy.s1.body" />
      <LegalSection titleKey="legal.privacy.s2.title" bodyKey="legal.privacy.s2.body" />
      <LegalSection titleKey="legal.privacy.s3.title" bodyKey="legal.privacy.s3.body" />
      <LegalSection titleKey="legal.privacy.s4.title" bodyKey="legal.privacy.s4.body" />
      <LegalSection titleKey="legal.privacy.s5.title" bodyKey="legal.privacy.s5.body" />
      <LegalSection titleKey="legal.privacy.s6.title" bodyKey="legal.privacy.s6.body" />
      <LegalSection titleKey="legal.privacy.s7.title" bodyKey="legal.privacy.s7.body" />
      <LegalSection titleKey="legal.privacy.s8.title" bodyKey="legal.privacy.s8.body" />
    </LegalLayout>
  );
}
