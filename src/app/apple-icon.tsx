import { ImageResponse } from "next/og";
import { monogramDataUri } from "@/lib/brand";

/**
 * The home-screen icon.
 *
 * iOS rounds and masks it itself, so this one is a full-bleed square with the
 * mark given generous margin — anything closer to the edge gets clipped by the
 * squircle on some devices.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FBF4E7",
        }}
      >
        <img src={monogramDataUri({ color: "#A8492F" })} width={96} height={105} alt="" />
      </div>
    ),
    size,
  );
}
