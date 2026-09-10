/**
 * The facts about this site that more than one file needs to agree on: the
 * canonical origin, who publishes it, and where to write. A route file in the
 * app directory may only export the handful of names Next reserves, so these
 * cannot live in layout.tsx even though that is where most of them are used.
 */

export const SITE = "https://oriyali.com";
export const SITE_NAME = "Oriyali";
export const CONTACT_EMAIL = "hello@oriyali.com";

/** The square mark a search engine is given for an organisation. */
export const LOGO = `${SITE}/brand/logo.png`;

/** An absolute URL, for the places a relative one is not allowed. */
export const url = (path = "") => `${SITE}${path}`;
