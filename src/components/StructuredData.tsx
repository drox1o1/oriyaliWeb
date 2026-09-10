import { CONTACT_EMAIL, LOGO, SITE, SITE_NAME, url } from "@/lib/site";

/**
 * What a search engine is told about this site.
 *
 * Deliberately modest. Everything here describes what a page *is* — a
 * publisher, a site, an article, a set of questions — and nothing claims to
 * be medical advice, because the moment this markup asserts a treatment or an
 * outcome, a search engine is entitled to surface it as one. The only medical
 * vocabulary used is `MedicalWebPage` and the condition the page is about,
 * which is the honest description: a page, about PMDD, for patients.
 *
 * The publisher and the site are declared once with stable `@id`s, and every
 * other page refers back to them by reference rather than repeating itself.
 */

const ORG_ID = `${SITE}/#organisation`;
const SITE_ID = `${SITE}/#website`;

function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Server-rendered from a literal; there is no user input anywhere near it.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const organisation = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE,
  email: CONTACT_EMAIL,
  description:
    "A PMDD companion for iPhone, and a private place to work out whether the fortnight you lose each month has a name. Built by one person, local-first, and never for sale.",
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE}/#logo`,
    url: LOGO,
    contentUrl: LOGO,
    width: 512,
    height: 512,
    caption: SITE_NAME,
  },
  image: { "@id": `${SITE}/#logo` },
};

const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE,
  name: SITE_NAME,
  description:
    "A private PMDD self-check, a plain explanation of the luteal window, and how to be taken seriously by a doctor.",
  inLanguage: "en-GB",
  publisher: { "@id": ORG_ID },
};

/** The publisher and the site. Rendered once, in the root layout. */
export function SiteStructuredData() {
  return <Ld data={{ "@context": "https://schema.org", "@graph": [organisation, website] }} />;
}

/**
 * A breadcrumb, so a result shows `oriyali.com › Questions` rather than a
 * bare URL. Two levels is the whole hierarchy of this site.
 */
function breadcrumb(path: string, name: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url(path)}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE },
      { "@type": "ListItem", position: 2, name, item: url(path) },
    ],
  };
}

/** The homepage: a page about a condition, for the people who have it. */
export function HomeStructuredData() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "MedicalWebPage",
            "@id": `${SITE}/#page`,
            url: SITE,
            name: "PMDD self-check — see your next hard week before it arrives",
            description:
              "A private PMDD self-check based on the published PSST, an interactive explanation of the luteal window, and guidance on getting taken seriously by a doctor. Nothing entered is transmitted.",
            inLanguage: "en-GB",
            isPartOf: { "@id": SITE_ID },
            publisher: { "@id": ORG_ID },
            isAccessibleForFree: true,
            audience: { "@type": "Patient" },
            about: {
              "@type": "MedicalCondition",
              name: "Premenstrual dysphoric disorder",
              alternateName: "PMDD",
            },
            /* The two published instruments the page is built on. Naming them
               is the whole credibility argument, so it belongs in the markup
               as well as on the page. */
            citation: [
              {
                "@type": "ScholarlyArticle",
                name: "The premenstrual symptoms screening tool (PSST) for clinicians",
                author: "Steiner M, Macdougall M, Brown E",
                datePublished: "2003",
                isPartOf: {
                  "@type": "Periodical",
                  name: "Archives of Women's Mental Health",
                },
              },
            ],
            /* Stated once, and stated everywhere. */
            disambiguatingDescription:
              "Educational only. Not a medical device, not medical advice, and not a diagnosis.",
          },
        ],
      }}
    />
  );
}

/**
 * A written page. `Article` rather than `MedicalWebPage`: the manifesto is a
 * person's note and the privacy policy is a promise, and neither is about a
 * condition.
 */
export function ArticleStructuredData({
  path,
  headline,
  description,
  published,
  modified,
}: {
  path: string;
  headline: string;
  description: string;
  published: string;
  modified?: string;
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "@id": `${url(path)}#article`,
            url: url(path),
            headline,
            description,
            inLanguage: "en-GB",
            datePublished: published,
            dateModified: modified ?? published,
            author: { "@id": ORG_ID },
            publisher: { "@id": ORG_ID },
            isPartOf: { "@id": SITE_ID },
            isAccessibleForFree: true,
          },
          breadcrumb(path, headline),
        ],
      }}
    />
  );
}

/**
 * The crisis page.
 *
 * A plain `WebPage`, and nothing more. It is tempting to mark the helplines up
 * as an `ItemList` of `ContactPoint`s so a search engine might surface a
 * number directly — but a number surfaced out of context, without the line
 * about hours or about not having to be in an emergency to call, is worse
 * than a link to the page that carries both.
 */
export function CrisisStructuredData() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${url("/crisis")}#page`,
            url: url("/crisis"),
            name: "If you're struggling right now — crisis lines",
            description:
              "Free, confidential crisis lines for India, the United States, the UK and Ireland, and everywhere else. You do not have to be in an emergency to call.",
            inLanguage: "en-GB",
            isPartOf: { "@id": SITE_ID },
            publisher: { "@id": ORG_ID },
            isAccessibleForFree: true,
          },
          breadcrumb("/crisis", "If you're struggling right now"),
        ],
      }}
    />
  );
}

/**
 * The FAQ, as questions and answers.
 *
 * Answers are the plain-text version of what the page says, not a summary
 * written for a crawler — if the markup and the page ever disagree, the
 * markup is a lie and Google is entitled to treat the whole page as one.
 */
export function FaqStructuredData({
  entries,
}: {
  entries: { q: string; a: string }[];
}) {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "FAQPage",
            "@id": `${url("/faq")}#faq`,
            url: url("/faq"),
            inLanguage: "en-GB",
            isPartOf: { "@id": SITE_ID },
            publisher: { "@id": ORG_ID },
            mainEntity: entries.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          },
          breadcrumb("/faq", "Questions"),
        ],
      }}
    />
  );
}
