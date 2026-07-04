export const metadata = {
  // Keep default + template so /achievements/[slug] titles still get the suffix
  title: { default: "Achievements", template: "%s | Charan Velavan" },
  description:
    "Awards and recognition earned by Charan Velavan — Smart India Hackathon finalist, Inventors Challenge winner, NBUC first place, and more.",
  alternates: { canonical: "/achievements" },
};

export default function AchievementsLayout({ children }) {
  return children;
}
