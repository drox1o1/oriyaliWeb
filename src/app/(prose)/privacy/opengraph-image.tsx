import { ImageResponse } from "next/og";
import { CARD_CONTENT_TYPE, CARD_SIZE, shareCard } from "@/lib/og";

export const alt = "Oriyali — Nothing you type here leaves your device.";
export const size = CARD_SIZE;
export const contentType = CARD_CONTENT_TYPE;

export default async function OpengraphImage() {
  const { element, options } = await shareCard({
    eyebrow: "Privacy",
    title: "Nothing you type here leaves your device.",
    line: "No analytics, no advertising pixels, no session recording. Not gated behind a banner — simply not here.",
  });
  return new ImageResponse(element, options);
}
