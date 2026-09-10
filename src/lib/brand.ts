/**
 * The mark, once.
 *
 * The monogram's geometry lives here rather than in the component, because
 * three different things need it and only one of them is React: the inline
 * SVG on the page, the generated favicons and app icons, and the share cards
 * that get rendered to PNG. A logo that is drawn from two copies of the same
 * paths eventually becomes two logos.
 *
 * Four petals and a stem that also read as a butterfly — the iris (the
 * flower, the iris of the eye, an app about seeing your own pattern) and the
 * butterfly (transformation, used sparingly).
 */

export const MONOGRAM_VIEWBOX = "0 0 1219 1330";

export const MONOGRAM_PATHS = [
  "M685.814 557.212C761.56 339.828 1000.58 226.514 1216.82 305.477L1120.16 556.408C1040.61 762.947 811.521 869.102 602.515 796.275L685.814 557.212Z",
  "M603.531 511.256C676.062 303.096 566.113 75.5499 357.953 3.01826L268.231 260.513C195.7 468.673 305.648 696.219 513.809 768.751L603.531 511.256Z",
  "M529.234 1000.25C493.009 1104.21 547.922 1217.86 651.885 1254.08L658.885 1256.52C759.15 1291.46 868.731 1238.36 903.442 1138.02C938.043 1037.99 885.147 928.834 785.2 894.008L589.958 825.978L529.234 1000.25Z",
  "M442.498 973.413C406.272 1077.38 292.627 1132.29 188.664 1096.06L181.664 1093.62C81.3988 1058.69 28.5442 948.989 63.7058 848.802C98.7559 748.934 208.032 696.283 307.979 731.109L503.222 799.14L442.498 973.413Z",
  "M643.811 490.412C645.206 483.9 651.615 479.753 658.127 481.148C664.638 482.544 668.786 488.953 667.391 495.464C639.548 625.395 554.638 838.808 484.635 1014.65C449.057 1104.02 400.093 1181.85 351.043 1237.54C326.526 1265.38 301.764 1287.93 278.386 1303.63C255.266 1319.15 232.282 1328.78 211.595 1328.78C204.936 1328.78 199.537 1323.38 199.537 1316.72C199.537 1310.06 204.935 1304.66 211.595 1304.66C225.313 1304.66 243.487 1298.01 264.944 1283.61C286.144 1269.37 309.379 1248.36 332.946 1221.6C380.064 1168.11 427.615 1092.68 462.229 1005.73C532.611 828.937 616.502 617.852 643.811 490.412Z"
] as const;

/**
 * The mark as a standalone SVG document — for anywhere that cannot take JSX:
 * the icon routes, the share cards, and the `logo` an organisation gives to a
 * search engine.
 *
 * `padding` is a fraction of the shorter side, so the mark can be given the
 * breathing room a rounded app icon needs without the caller doing arithmetic.
 */
export function monogramSvg({
  color = "#423A32",
  background = "none",
  padding = 0,
  radius = 0,
}: {
  color?: string;
  background?: string;
  padding?: number;
  radius?: number;
} = {}) {
  const [, , w, h] = MONOGRAM_VIEWBOX.split(" ").map(Number);
  const pad = Math.min(w, h) * padding;
  const box = `${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`;
  const ground =
    background === "none"
      ? ""
      : `<rect x="${-pad}" y="${-pad}" width="${w + pad * 2}" height="${h + pad * 2}" rx="${radius}" fill="${background}"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">` +
    ground +
    MONOGRAM_PATHS.map((d) => `<path fill="${color}" d="${d}"/>`).join("") +
    "</svg>"
  );
}

/** The same, as a data URI — satori and `<img>` both take one. */
export function monogramDataUri(options?: Parameters<typeof monogramSvg>[0]) {
  return `data:image/svg+xml;base64,${Buffer.from(monogramSvg(options)).toString("base64")}`;
}
