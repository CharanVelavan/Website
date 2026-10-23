// Single source of truth for the deployed site URL.
// Set NEXT_PUBLIC_SITE_URL in your hosting env (e.g. Vercel) to override,
// or edit the fallback below if the production domain changes.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://www.charanvelavan.com";

export const SITE_NAME = "Charan Velavan";

// Shorten a meta description at a word boundary so it never ends mid-word.
export function clipDescription(text, max = 160) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.–—-]+$/, "")}…`;
}

export const SITE_DESCRIPTION =
  "Portfolio of Charan Velavan — AI/ML systems engineer, 5G networks researcher, and UAV systems developer based in Chennai.";
