import { ImageResponse } from "next/og";
import { monogramDataUri } from "@/lib/brand";

/**
 * The browser-tab icon.
 *
 * The mark on warm paper rather than on nothing: a transparent favicon
 * disappears into a dark browser chrome, and this one has to be findable in a
 * row of twenty tabs. Coral on cream is the pairing the site already uses for
 * the sign-off, so a tab looks like the page it belongs to.
 *
 * Generated from the same paths the page draws, so the mark can never drift
 * between the tab and the masthead.
 */
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 12,
        }}
      >
        <img src={monogramDataUri({ color: "#A8492F" })} width={38} height={41} alt="" />
      </div>
    ),
    size,
  );
}
