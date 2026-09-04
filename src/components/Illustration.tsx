import Image from "next/image";

/**
 * A drawing from the illustration library, placed on the page.
 *
 * The artwork carries its own paper — #F7ECD7 for the narrative pieces,
 * #FBF2DE for the spots — which sits within a couple of values of `--paper`.
 * So in daylight they need no frame at all: the drawing simply lands on the
 * page the way the inline SVG drawings do.
 *
 * In twilight that daylight paper would glare, so `.ori-plate` frames it as a
 * tipped-in plate and takes the brightness down — a colour plate on toned
 * stock, which is a decision rather than an accident.
 */
export function Illustration({
  src,
  alt,
  caption,
  className,
  priority = false,
  /** Rendered width hint for the responsive srcset. */
  sizes = "(max-width: 60rem) 88vw, 22rem",
}: {
  /** Path under /public/illustrations, e.g. "emotional/wondering.jpg". */
  src: string;
  /** What the drawing shows. "" only when the text beside it already says it. */
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className={`ori-figure ${className ?? ""}`}>
      <div className="ori-plate">
        <Image
          src={`/illustrations/${src}`}
          alt={alt}
          width={1000}
          height={1000}
          sizes={sizes}
          priority={priority}
          className="block h-auto w-full"
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/**
 * A spot: a small drawn motif — a sun, a storm cloud, a seedling — used the way
 * a magazine uses a dingbat. Decorative by default, so it is hidden from
 * assistive technology unless it is given a label.
 */
export function Spot({
  name,
  className,
  label,
}: {
  /** File stem under /public/illustrations/spots, e.g. "spotSun". */
  name: string;
  className?: string;
  label?: string;
}) {
  return (
    <Image
      src={`/illustrations/spots/${name}.jpg`}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      width={460}
      height={460}
      sizes="10rem"
      className={`ori-spot block ${className ?? ""}`}
    />
  );
}
