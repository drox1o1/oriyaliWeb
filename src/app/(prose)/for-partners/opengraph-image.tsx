import { ImageResponse } from "next/og";
import { CARD_CONTENT_TYPE, CARD_SIZE, shareCard } from "@/lib/og";

export const alt = "Oriyali — For the person standing next to it.";
export const size = CARD_SIZE;
export const contentType = CARD_CONTENT_TYPE;

export default async function OpengraphImage() {
  const { element, options } = await shareCard({
    eyebrow: "For partners",
    title: "For the person standing next to it.",
    line: "What the luteal window is, what PMDD does to the person you love, and the small number of things that genuinely help.",
  });
  return new ImageResponse(element, options);
}
