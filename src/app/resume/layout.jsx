// src/app/resume/layout.jsx — server layout so the /resume section gets its
// own metadata; all interactive UI lives in ResumeLayoutClient.
import ResumeLayoutClient from "./ResumeLayoutClient";

export const metadata = {
  title: "Resume",
  description:
    "Resume of Charan Velavan — internships at ZOHO and SSN College of Engineering, technical skills, certifications, publications, and education.",
  alternates: { canonical: "/resume" },
};

export default function ResumeLayout({ children }) {
  return <ResumeLayoutClient>{children}</ResumeLayoutClient>;
}
