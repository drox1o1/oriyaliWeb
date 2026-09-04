/**
 * Structured data. Deliberately modest: this describes what the page is, and
 * makes no health claim search engines could surface as advice.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalWebPage",
        "@id": "https://oriyali.com/#page",
        name: "Understanding PMDD — a private self-check and cycle explainer",
        description:
          "A private PMDD self-check based on the published PSST, an interactive explanation of the luteal window, and guidance on getting taken seriously by a doctor. Nothing entered is transmitted.",
        inLanguage: "en",
        about: {
          "@type": "MedicalCondition",
          name: "Premenstrual dysphoric disorder",
          alternateName: "PMDD",

        },
        audience: { "@type": "Patient" },
        isAccessibleForFree: true,
        publisher: { "@id": "https://oriyali.com/#org" },
      },
      {
        "@type": "Organization",
        "@id": "https://oriyali.com/#org",
        name: "Oriyali",
        url: "https://oriyali.com",
        email: "hello@oriyali.com",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
