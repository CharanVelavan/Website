// Single source of truth for the deployed site URL.
// Set NEXT_PUBLIC_SITE_URL in your hosting env (e.g. Vercel) to override,
// or edit the fallback below if the production domain changes.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://charanvelavan-portfolio.vercel.app";

export const SITE_NAME = "Charan Velavan";

export const SITE_DESCRIPTION =
  "Portfolio of Charan Velavan — AI/ML systems engineer, 5G networks researcher, and UAV systems developer based in Chennai.";
