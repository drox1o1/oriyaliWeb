import { ImageResponse } from "next/og";
import { CARD_CONTENT_TYPE, CARD_SIZE, shareCard } from "@/lib/og";

export const alt = "Oriyali — Why I’m building Oriyali";
export const size = CARD_SIZE;
export const contentType = CARD_CONTENT_TYPE;

export default async function OpengraphImage() {
  const { element, options } = await shareCard({
    eyebrow: "Why Oriyali",
    title: "Why I’m building Oriyali",
    line: "A designer’s note about PMDD, medical gaslighting, and why the app most PMDD patients rely on deserves a better successor.",
  });
  return new ImageResponse(element, options);
}
