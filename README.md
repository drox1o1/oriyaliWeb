# Oriyali — web experience

A standalone, interactive PMDD awareness tool that happens to introduce the Oriyali
iPhone app. The tool is the point. The app is the next step, and it is skippable.

## The non-negotiables, and where they live in the code

| Rule | Where it's enforced |
|---|---|
| Nothing from the self-check or aura demo ever leaves the device | `src/components/SelfCheck.tsx`, `src/lib/psst.ts`, `src/lib/aura.ts` — no `fetch`, no storage, no analytics in any of them |
| No third-party scripts, at all | CSP in `next.config.ts` pins `script-src`, `connect-src`, `font-src` and `img-src` to `'self'` |
| Fonts are self-hosted | `next/font/google` in `src/app/layout.tsx` — downloaded at build time, served from this origin |
| Complete with JavaScript disabled | `SelfCheck` renders the whole instrument plus the printed scoring rule until it hydrates |
| Complete with Reduce Motion on | `@media (prefers-reduced-motion: reduce)` in `globals.css` settles every drawn stroke |
| Crisis resources always reachable | `SiteFooter` on every page, `/crisis` as its own route, and surfaced inline by the self-check's safety branch |
| No red-alert states | There is no red token. `--crisis-*` is plain near-black, and it is the only deliberate break from the palette |
| The name is Oriyali | `npm run check:luna` |

## Setup

```bash
npm install
npm run dev
```

### Before deploying

The waitlist is the only endpoint that transmits anything, and it fails honestly
rather than faking a sign-up. Set both, pointing at a provider with a signed DPA:

```
WAITLIST_ENDPOINT=https://…   # your store or ESP's API
WAITLIST_TOKEN=…              # its bearer token
```

With these unset, `POST /api/waitlist` returns 503 and the form shows its in-voice
error. That is intentional — a sign-up form must never report success it didn't achieve.

## The editorial grid

`page.tsx` and the written pages sit on one four-column grid, named so the
markup reads as a layout rather than a stack:

```
bleed   full width, edge to edge
rail    the narrow margin — section numerals, sidenotes, the running contents,
        and the left edge a pull-quote breaks out into
body     the reading measure, ~68 characters
aside    figures, drawings, the waitlist, source notes
```

`.col-rail` / `.col-body` / `.col-aside` / `.col-main` / `.col-wide` /
`.col-bleed` place things on it. Below 60rem every named line collapses onto a
single track, so a phone gets one honest column instead of a second layout.
`.ori-grid--article` drops the aside track for written pages, so the contents
and the article centre instead of hugging the left edge.

The magazine devices are all in `globals.css`: `.ori-numeral`, `.ori-folio`,
`.ori-dropcap`, `.ori-pullquote`, `.ori-sidenote`, `.ori-runin`,
`.ori-columns-2`, `.ori-deck`.

### On justified text

`.ori-justify` sets `text-align: justify` **with `hyphens: auto`**, and turns
itself off below 40rem. Justification without hyphenation is what produces the
rivers of white space people mean when they say justified text is hard to read
— and this audience reads with brain fog in the week that matters. So it is
only ever applied with hyphenation, on a measure wide enough to break well, and
never on a phone column. The self-check's own questions are never justified:
that is the functional surface, read by the most tired version of the reader.

`.ori-columns-2` is used for bounded blocks only — never a whole page. On a
scrolling page, multi-column body text makes you read down, scroll back up, and
read down again.

## Motion

Two libraries, each doing the one thing it is best at, and neither in the
first-load bundle — both are behind a dynamic `import()` inside an effect, which
is why first-load JS is 123 kB with them and was 122 kB without.

| | Used for |
|---|---|
| **GSAP** + ScrollTrigger | the cycle explainer — one sticky scene where the sun crosses the sky, the sky bands interpolate and the ground warms and darkens as you scroll |
| **motion.dev** | below-the-fold settles (`components/motion/Reveal.tsx`) |
| **CSS** | the aura's draw-in and breath, the hand's frame-to-frame boil, page-turn cross-dissolves |

Three rules hold across all of it:

- **Nothing hides content that a script has to bring back.** `Reveal` arms an
  element only when it is *below the fold*, so nothing that has already painted
  is ever taken away — and it carries a 4-second failsafe, so a chunk that never
  arrives or an observer that never fires cannot leave anything invisible.
- **Reduce Motion is a different build of the page, not a slower one.** The
  cycle explainer renders five stacked drawn states with their own copy rather
  than a scrubbed scene; verified by running headless Chrome with
  `--force-prefers-reduced-motion` and counting what rendered.
- **The scroll path never sets React state per frame.** ScrollTrigger's
  `onUpdate` writes the SVG transform and fills directly; React state changes
  only when the active phase changes.

## Design tokens

`src/app/globals.css` is the single token layer. It is the web translation of the
"Oriyali — Tokens & Component Library" bundle, as compiled in the iOS app's
`OriyaliTheme.swift`. **Never hardcode a hex outside that file.**

Light and twilight are both first-class. Twilight is the restful register — a lamp
turned low over a notebook — and is defined three times on purpose: once for
`prefers-color-scheme: dark`, once for an explicit `[data-theme="dark"]`, and the
light values on bare `:root` so an explicit light choice always wins.

### Contrast, checked

| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--paper` | 9.9:1 | AAA |
| `--ink-soft` on `--paper` | 5.0:1 | AA |
| `--bloom-ink` on `--paper` | 4.9:1 | AA — this is why the coral voice has its own darker token |
| `--bloom` on `--paper` | 2.0:1 | **fills and strokes only, never text** |
| `--ink-faint` on `--paper` | 2.5:1 | **hairlines and decoration only, never text** |
| `--numeral` on `--paper` / `--paper-deep` | 3.6:1 / 3.3:1 | the section numerals — decorative, but still text on screen, so they clear the 3:1 large-text floor rather than sitting at a pretty 0.22 opacity |
| `--crisis-ink` on `--crisis-bg` | 15.9:1 | AAA |

## Clinical content

Everything clinical is sourced on the page where it appears.

- **The self-check** is the PSST — Steiner M, Macdougall M, Brown E, *The premenstrual
  symptoms screening tool (PSST) for clinicians*, Arch Womens Ment Health 2003;6(3):203–209
  ([doi](https://doi.org/10.1007/s00737-003-0018-4)). All 14 symptom items, all 5
  interference items, and the exact published three-part rule, in `src/lib/psst.ts`.
  Nothing is invented, re-weighted, or turned into a score out of ten.
- **The safety question is not part of the PSST** and says so on screen. It exists
  because the crisis branch has to be reachable, and it is skippable.
- **Diagnosis delay (~12 years)**: IAPMD Global Survey of Premenstrual Disorders —
  attributed on the page as survey data rather than a clinical trial.
- **34% lifetime suicide attempt**: Eisenlohr-Moul et al., BMC Psychiatry 2022 (n=599,
  prospectively confirmed PMDD). Stated plainly, once, in body copy — never in large type.
- **Crisis numbers** in `src/lib/crisis.ts` were each checked against the operator's own
  site on 4 September 2026, and each carries its source. Re-verify before every deploy;
  don't add a line from memory.

## Routes

```
/                 the experience — recognition, self-check, aura, cycle, getting believed, the app
/crisis           the deliberate break: high contrast, plain, no motion
/privacy          the promise, then the policy — with instructions for checking our work
/manifesto        first person. A draft in the founder's voice — make it true before shipping
/faq              PMDD basics, what's a diagnosis, DRSP, iOS-only, pricing, privacy
/for-partners     the luteal window, and what actually helps
/terms
/api/waitlist     the only endpoint that transmits anything
```

## Notable build decisions

- **The aura is SVG, not Rive.** A `.riv` is a binary a designer authors in the Rive
  editor; it can't be written from code. The aura is instead deterministic seeded
  geometry (`src/lib/aura.ts`) rendered as inline SVG, with the draw-in and the breath
  in pure CSS. It is a complete, finished drawing with JS off and under Reduce Motion —
  which was the fallback requirement anyway. If a hand-authored `.riv` arrives later,
  it can replace `<Aura>` and keep this as the fallback.
- **No Framer Motion.** Every motion in the spec — the draw-in, the breath, the boil,
  the page-turn cross-dissolve, the sun crossing the sky — is CSS. That ships zero
  animation JavaScript, and `prefers-reduced-motion` is honoured by the cascade rather
  than by a hook that has to run first.
- **The self-check stores nothing, not even in `sessionStorage`.** Resume-within-session
  was permitted, but "we don't store your answers anywhere, including here" is a stronger
  promise and a much easier one to verify.

## Measured, not asserted

Lighthouse 12 against `next build && next start`, Chrome headless:

| | Mobile (4G, 4× CPU) | Desktop |
|---|---|---|
| Performance | **95** | **100** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |
| CLS | **0** | **0** |
| LCP | 2.8 s | 0.6 s |
| Total Blocking Time | 10 ms | 0 ms |

LCP is 2.8 s against the brief's 2.0 s aspiration. The cause is three self-hosted
type families; the only real lever left is dropping one of them. Everything else
is already at the floor: 122 kB first-load JS, 2 preloaded font files, zero
third-party requests, zero images.

Other things checked rather than assumed:

- **Nothing is transmitted.** `fetch`, `XMLHttpRequest`, `sendBeacon` and
  `WebSocket` were monkey-patched, then a full 21-question self-check and the
  aura sliders were driven end to end. Zero calls, zero new network resources.
  `sessionStorage` empty, `localStorage` holds only `oriyali-theme`, no cookies
  in production, no third-party origins.
- **The scoring rule.** 12 boundary cases, including every near-miss of the
  three-part rule — `npm run test:psst`.
- **Contrast.** Every visible text node on every route, in light, dark and
  system, with alpha correctly composited: 0 failures.
- **Structure.** One `h1` per route, no heading jumps, no unnamed controls, no
  unlabelled SVG, no duplicate ids.
- **Reduced motion.** All 67 drawn strokes settle to complete; nothing is left
  half-drawn or invisible.
- **Without JavaScript.** The server HTML contains all 14 symptom items, all 5
  interference items, 79 radio inputs, the printed scoring rule, and all five
  cycle phases.
- **320 px wide.** No horizontal overflow outside the two intended
  `.ori-scroll-x` containers (the DRSP table and the phase scrubber).

## Checks

```bash
npm run check          # typecheck + lint + the Luna check + the PSST cases
npm run build
```

## Still to do

- **`WAITLIST_ENDPOINT` / `WAITLIST_TOKEN` are unset**, so sign-up returns 503 by
  design. Set them before launch.
- **The manifesto is a draft in your voice.** It argues from the research, and
  invents no biography — but it is written as you, so read it and make it true.
- **The lifted-face figure isn't drawn.** It is the brand's other signature and
  the hardest asset in the set; a badly drawn figure would cost more than its
  absence. `Meadow` in `Illustrations.tsx` holds that slot. Commission the
  figure, then swap it in.
- **Re-verify the crisis numbers** before every deploy. They were checked
  against each operator's own site on 4 September 2026.
