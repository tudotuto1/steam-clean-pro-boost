import { createFileRoute } from "@tanstack/react-router";

import { LegalLayout, LegalSection } from "@/components/legal/LegalLayout";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [{ title: "Conditions générales de vente — VaporPro" }],
  }),
  component: CgvPage,
});

function CgvPage() {
  return (
    <LegalLayout titleKey="legal.cgv.title">
      <LegalSection titleKey="legal.cgv.s1.title" bodyKey="legal.cgv.s1.body" />
      <LegalSection titleKey="legal.cgv.s2.title" bodyKey="legal.cgv.s2.body" />
      <LegalSection titleKey="legal.cgv.s3.title" bodyKey="legal.cgv.s3.body" />
      <LegalSection titleKey="legal.cgv.s4.title" bodyKey="legal.cgv.s4.body" />
      <LegalSection titleKey="legal.cgv.s5.title" bodyKey="legal.cgv.s5.body" />
      <LegalSection titleKey="legal.cgv.s6.title" bodyKey="legal.cgv.s6.body" />
      <LegalSection titleKey="legal.cgv.s7.title" bodyKey="legal.cgv.s7.body" />
      <LegalSection titleKey="legal.cgv.s8.title" bodyKey="legal.cgv.s8.body" />
      <LegalSection titleKey="legal.cgv.s9.title" bodyKey="legal.cgv.s9.body" />
    </LegalLayout>
  );
}
