import { ImageResponse } from "next/og";
import { CARD_CONTENT_TYPE, CARD_SIZE, shareCard } from "@/lib/og";

export const alt = "Oriyali — The short, readable terms.";
export const size = CARD_SIZE;
export const contentType = CARD_CONTENT_TYPE;

export default async function OpengraphImage() {
  const { element, options } = await shareCard({
    eyebrow: "Terms",
    title: "The short, readable terms.",
    line: "Educational only. Not a medical device, not medical advice, and not a diagnosis.",
  });
  return new ImageResponse(element, options);
}
