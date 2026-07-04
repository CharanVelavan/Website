import { getAchievementBySlug, achievements } from "@/lib/achievements";

export function generateStaticParams() {
  return achievements.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const achievement = getAchievementBySlug(slug);
  if (!achievement) return {};

  const description =
    achievement.shortDescription?.length > 160
      ? `${achievement.shortDescription.slice(0, 157)}...`
      : achievement.shortDescription;
  const image = achievement.images?.[0] || "/profile.jpg";

  return {
    title: achievement.title,
    description,
    alternates: { canonical: `/achievements/${achievement.slug}` },
    openGraph: {
      type: "article",
      title: `${achievement.title} | Charan Velavan`,
      description,
      images: [{ url: image, alt: achievement.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${achievement.title} | Charan Velavan`,
      description,
      images: [image],
    },
  };
}

export default function AchievementSlugLayout({ children }) {
  return children;
}
