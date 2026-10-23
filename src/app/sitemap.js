import { achievements } from "@/lib/achievements";
import { SITE_URL as BASE_URL } from "@/lib/site-config";

// the home page is the 3D lab, with every case study in it; the old /projects pages redirect there (next.config.mjs)
export default function sitemap() {
  const achievementPages = achievements.map((a) => ({
    url: `${BASE_URL}/achievements/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/achievements`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/resume/skills`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/resume/internships`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/resume/certifications`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/resume/publications`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/resume/educations`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...achievementPages,
  ];
}
