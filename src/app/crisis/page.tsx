import type { Metadata } from "next";
import Link from "next/link";
import { CrisisBlock } from "@/components/CrisisBlock";

export const metadata: Metadata = {
  title: "If you're struggling right now",
  description:
    "Free, confidential crisis lines for India, the United States, the UK and Ireland, and everywhere else — on one plain page.",
  robots: { index: true, follow: true },
};

export default function CrisisPage() {
  return (
    <>
      <CrisisBlock level="h1" />
      <div className="mx-auto w-full max-w-[52rem] px-5 py-12 md:px-8">
        <Link href="/" className="text-ink underline decoration-[var(--hairline)] underline-offset-4">
          Back to Oriyali
        </Link>
      </div>
    </>
  );
}
