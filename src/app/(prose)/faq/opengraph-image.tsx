import { ImageResponse } from "next/og";
import { CARD_CONTENT_TYPE, CARD_SIZE, shareCard } from "@/lib/og";

export const alt = "Oriyali — The questions people actually ask.";
export const size = CARD_SIZE;
export const contentType = CARD_CONTENT_TYPE;

export default async function OpengraphImage() {
  const { element, options } = await shareCard({
    eyebrow: "Questions",
    title: "The questions people actually ask.",
    line: "What PMDD is, how it differs from PMS, what the PSST and the DRSP are, and how any of this is handled.",
  });
  return new ImageResponse(element, options);
}
