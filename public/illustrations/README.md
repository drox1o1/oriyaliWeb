# Illustrations

Coloured-pencil drawings on a warm cream ground, one recurring figure. Sourced
from `../../illutsrations/illustrations/` and re-encoded here for the web.

## Why JPEG, and these sizes

The artwork has an opaque cream ground and no transparency anywhere, and the
pencil grain is exactly the kind of noise PNG cannot compress. Re-encoding to
JPEG took the set from **73 MB to 3.1 MB** with no visible loss. `next/image`
still serves WebP/AVIF variants on top of these.

```sh
# narrative pieces — rendered up to ~30rem
sips -Z 1000 -s format jpeg -s formatOptions 84 src.png --out emotional/name.jpg
# spots — rendered up to ~10rem
sips -Z 460  -s format jpeg -s formatOptions 84 src.png --out spots/spotName.jpg
```

## How they sit on the page

Their ground is #F7ECD7 (narrative) / #FBF2DE (spots) — within a couple of
values of `--paper`, so in daylight they need no frame at all and simply land
on the page. In twilight that daylight paper would glare, so `.ori-plate` frames
and dims them: a colour plate tipped onto toned stock.

Spots are cropped to a **circle**. Blend modes don't help there — the artwork's
ground is *lighter* than the paper, so `multiply` darkens it into exactly the
square it was meant to hide. A round drawn medallion reads as a deliberate mark.

## Placed so far

| Drawing | Where |
|---|---|
| `emotional/wondering` | Hero background field (22% opacity, low in frame) |
| `emotional/freedom` | The closing "this part passes" moment |
| `emotional/quietPride` | Section 06 — the app |
| `emotional/connection` | `/for-partners` |
| `emotional/pause` | `/manifesto` |
| `spots/spotMoonStars` | Cycle — menstrual |
| `spots/spotSeedling` | Cycle — follicular |
| `spots/spotSun` | Cycle — ovulation, and the footer band |
| `spots/spotSprig` | Cycle — early luteal |
| `spots/spotRainCloud` | Cycle — late luteal |

Still unplaced: `courage`, `nourishment`, `refuge`, and 22 spots.

## Alt text is not optional

Every narrative plate needs a real `alt` describing what the drawing shows.
Spots are decorative and take `alt=""` via `<Spot>` unless given a `label`.
