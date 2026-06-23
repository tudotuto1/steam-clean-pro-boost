import { createFileRoute } from "@tanstack/react-router";

import {
  LegalLayout,
  LegalSection,
  LegalParagraph,
} from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/garantie")({
  head: () => ({
    meta: [{ title: "Garantie — VaporPro" }],
  }),
  component: GarantiePage,
});

function GarantiePage() {
  return (
    <LegalLayout titleKey="legal.warranty.title">
      <LegalParagraph textKey="legal.warranty.intro" />
      <LegalSection titleKey="legal.warranty.covered.title" bodyKey="legal.warranty.covered.body" />
      <LegalSection titleKey="legal.warranty.notCovered.title" bodyKey="legal.warranty.notCovered.body" />
      <LegalSection titleKey="legal.warranty.claim.title" bodyKey="legal.warranty.claim.body" />
    </LegalLayout>
  );
}
