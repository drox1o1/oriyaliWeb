import type { Metadata } from "next";
import Link from "next/link";
import { CrisisBlock } from "@/components/CrisisBlock";
import { CrisisStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "If you're struggling right now — crisis lines",
  description:
    "Free, confidential crisis lines for India, the United States, the UK and Ireland, and everywhere else — on one plain page. You do not have to be in an emergency to call.",
  alternates: { canonical: "/crisis" },
  openGraph: {
    type: "article",
    url: "/crisis",
    title: "You can talk to someone tonight",
    description:
      "Free, confidential numbers for India, the United States, the UK and Ireland, and everywhere else — on one plain page.",
  },
  twitter: {
    title: "You can talk to someone tonight",
    description:
      "Free, confidential numbers for India, the United States, the UK and Ireland, and everywhere else — on one plain page.",
  },
  /* Indexed deliberately: this is the page that most needs to be findable
     from a search someone makes at three in the morning. */
  robots: { index: true, follow: true },
};

export default function CrisisPage() {
  return (
    <>
      <CrisisStructuredData />
      <CrisisBlock level="h1" />
      <div className="mx-auto w-full max-w-[52rem] px-5 py-12 md:px-8">
        <Link href="/" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
          Back to Oriyali
        </Link>
      </div>
    </>
  );
}
