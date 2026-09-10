import { ImageResponse } from "next/og";
import { CARD_CONTENT_TYPE, CARD_SIZE, shareCard } from "@/lib/og";

export const alt =
  "Oriyali — If you're struggling right now. Free, confidential crisis lines for India, the US, the UK and Ireland, and everywhere else.";
export const size = CARD_SIZE;
export const contentType = CARD_CONTENT_TYPE;

/* This is the one card that drops the warmth. It is the link someone sends to
   a person in trouble, and it has to read as a phone number rather than as an
   invitation to a lovely website. */
export default async function OpengraphImage() {
  const { element, options } = await shareCard({
    tone: "plain",
    eyebrow: "Right now",
    title: "You can talk to someone tonight.",
    line: "Numbers for India, the United States, the UK and Ireland, and everywhere else — on one plain page.",
  });
  return new ImageResponse(element, options);
}
