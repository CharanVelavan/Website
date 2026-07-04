// Internal design-preview page — keep it out of search engines.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewHeroesLayout({ children }) {
  return children;
}
