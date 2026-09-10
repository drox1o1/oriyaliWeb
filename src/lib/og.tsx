/* eslint-disable @next/next/no-img-element --
   Satori renders this to a PNG on the server; `next/image` has no meaning
   here, and the source is an inline data URI, not a network request. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { monogramDataUri } from "@/lib/brand";

/**
 * The share card.
 *
 * One template, used by every route, so a link to the manifesto and a link to
 * the crisis page arrive in a chat looking like they came from the same place.
 *
 * It is the page's own furniture at 1200×630: warm paper, the mark and the
 * wordmark in the hand, a rule, and the line that page is actually about. No
 * screenshot, no gradient, no drop shadow — the site uses none of those, and a
 * share card that doesn't look like the site is a broken promise about what is
 * on the other side of the link.
 *
 * The two faces are bundled rather than fetched. This site self-hosts its
 * fonts specifically so that reading it sends nothing to Google, and a build
 * that quietly reached out to fonts.gstatic.com would undo half of that.
 * Both are SIL Open Font Licence 1.1 — Over the Rainbow, and Newsreader.
 */

const PAPER = "#F6ECDB";
const INK = "#423A32";
const INK_SOFT = "#6E6358";
const BLOOM_INK = "#A8492F";
const LEAF_DEEP = "#687C4E";

/* The crisis card drops the warmth, the same way the crisis page does. It
   arrives in someone's messages at the worst possible moment, and it should
   look like a phone number rather than an invitation. */
const CRISIS_BG = "#14181D";
const CRISIS_INK = "#F4F6F8";
const CRISIS_SOFT = "#C3CCD6";
const CRISIS_LINE = "#3A434E";

const FONT_DIR = join(process.cwd(), "src", "app", "_og-fonts");

/* Read once per build, not once per card. */
let fontCache: Promise<[Buffer, Buffer]> | null = null;

function loadFonts() {
  fontCache ??= Promise.all([
    readFile(join(FONT_DIR, "OverTheRainbow-Regular.ttf")),
    readFile(join(FONT_DIR, "Newsreader-Regular.ttf")),
  ]);
  return fontCache;
}

export const CARD_SIZE = { width: 1200, height: 630 };
export const CARD_CONTENT_TYPE = "image/png";

interface CardOptions {
  /** Where in the site this is — set beside the wordmark. */
  eyebrow?: string;
  /** The line the card is about. Written in the hand, so keep it short. */
  title: string;
  /** One sentence under it, in the serif. */
  line?: string;
  tone?: "warm" | "plain";
}

/**
 * Everything an `opengraph-image` route needs: the element and the font
 * options together, so each route stays three lines and cannot drift from the
 * others.
 */
export async function shareCard({ eyebrow, title, line, tone = "warm" }: CardOptions) {
  const [hand, serif] = await loadFonts();
  const plain = tone === "plain";

  const ground = plain ? CRISIS_BG : PAPER;
  const ink = plain ? CRISIS_INK : INK;
  const soft = plain ? CRISIS_SOFT : INK_SOFT;
  const rule = plain ? CRISIS_LINE : INK;
  const mark = plain ? CRISIS_INK : BLOOM_INK;

  /* The plain card sets its line in the serif, not the hand. The crisis page
     itself never uses the hand — handwriting is the site being warm at you,
     and the one page that exists for an emergency is not the place for it.
     The wordmark stays written, because that is the mark, not the tone. */
  const titleFamily = plain ? "Serif" : "Hand";

  /* Pick the largest size the title still fits in.
     
     Counting characters is not enough: "Twelve years." and a 24-character
     title both look short and set to a very different number of lines. So
     estimate the wrap — average advance is about 0.42em in the hand and
     0.46em in the serif — and step down until the block fits the space
     between the rule and the footer. Without this a two-line title at the
     largest size sits directly on the promise line at the bottom. */
  const advance = plain ? 0.46 : 0.42;
  const MEASURE = 1000;
  const MAX_TITLE_HEIGHT = 250;
  const titleSize =
    [plain ? 76 : 110, plain ? 62 : 90, plain ? 54 : 72, 58].find((size) => {
      const perLine = Math.max(1, Math.floor(MEASURE / (advance * size)));
      const lines = Math.ceil(title.length / perLine);
      return lines * size * 1.2 <= MAX_TITLE_HEIGHT;
    }) ?? 58;

  return {
    element: (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: ground,
          padding: "66px 76px 60px",
        }}
      >
        {/* The masthead, exactly as the site wears it. */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={monogramDataUri({ color: mark })} width={44} height={48} alt="" />
          <div
            style={{
              display: "flex",
              marginLeft: 18,
              fontFamily: "Hand",
              fontSize: 52,
              lineHeight: 1,
              color: ink,
            }}
          >
            Oriyali
          </div>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                marginLeft: 26,
                paddingLeft: 26,
                borderLeft: `1px solid ${soft}`,
                fontFamily: "Serif",
                fontSize: 23,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: soft,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", height: 2, background: rule, marginBottom: 38 }} />
          <div
            style={{
              display: "flex",
              fontFamily: titleFamily,
              fontSize: titleSize,
              lineHeight: plain ? 1.22 : 1.18,
              letterSpacing: plain ? -1 : 0,
              color: ink,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {line ? (
            <div
              style={{
                display: "flex",
                marginTop: 26,
                marginBottom: 8,
                fontFamily: "Serif",
                fontSize: 31,
                lineHeight: 1.4,
                color: soft,
                maxWidth: 900,
              }}
            >
              {line}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "Serif",
            fontSize: 25,
            color: soft,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 9,
              height: 9,
              borderRadius: 9,
              marginRight: 14,
              background: plain ? CRISIS_SOFT : LEAF_DEEP,
            }}
          />
          {plain
            ? "Free, confidential, and answered by people who have heard this before"
            : "Nothing you enter ever leaves your device"}
        </div>
      </div>
    ),
    options: {
      ...CARD_SIZE,
      fonts: [
        { name: "Hand", data: hand, weight: 400 as const, style: "normal" as const },
        { name: "Serif", data: serif, weight: 400 as const, style: "normal" as const },
      ],
    },
  };
}
