/**
 * Crisis resources.
 *
 * Every number here was checked against the operator's own site while building
 * this, and each carries the source it came from. Do not add a line to this
 * file from memory — check it, or leave it out.
 *
 * Last verified: 4 September 2026.
 */

export interface CrisisResource {
  region: string;
  name: string;
  /** What you dial or text. Shown large. */
  contact: string;
  /** tel: or sms: href, when there is one. */
  href?: string;
  hours: string;
  note?: string;
  source: string;
}

export const CRISIS_RESOURCES: readonly CrisisResource[] = [
  {
    region: "India",
    name: "Tele-MANAS",
    contact: "14416",
    href: "tel:14416",
    hours: "24 hours, every day",
    note: "Free. Government of India. English and 20 other languages. Also reachable on 1-800-891-4416.",
    source: "telemanas.mohfw.gov.in",
  },
  {
    region: "India",
    name: "iCALL — TISS",
    contact: "9152987821",
    href: "tel:+919152987821",
    hours: "Monday to Saturday, 10am – 8pm",
    note: "Free counselling by phone and email, from the Tata Institute of Social Sciences.",
    source: "icallhelpline.org",
  },
  {
    region: "United States",
    name: "988 Suicide & Crisis Lifeline",
    contact: "988",
    href: "tel:988",
    hours: "24 hours, every day",
    note: "Call or text 988. Free and confidential.",
    source: "988lifeline.org",
  },
  {
    region: "UK & Ireland",
    name: "Samaritans",
    contact: "116 123",
    href: "tel:116123",
    hours: "24 hours, every day",
    note: "Free from any phone, and it does not appear on the bill.",
    source: "samaritans.org",
  },
  {
    region: "Anywhere else",
    name: "Find A Helpline",
    contact: "findahelpline.com",
    href: "https://findahelpline.com",
    hours: "Directory",
    note: "Free, verified helplines in over 130 countries.",
    source: "findahelpline.com",
  },
] as const;

/** PMDD-specific support. Deliberately listed apart: this is not a crisis line. */
export const IAPMD_SUPPORT = {
  name: "IAPMD",
  full: "International Association for Premenstrual Disorders",
  href: "https://iapmd.org/self-harm-suicidality",
  note: "Peer support and PMDD-specific guidance on self-harm and suicidality. IAPMD is not a crisis service.",
};
