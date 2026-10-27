import type { Metadata } from "next";
import { InkHeader, InkSpecs, type Spec } from "./ink-specs";
import { links, siteDescription, siteName, siteUrl } from "./site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const specs: Spec[] = [
  { label: "Team", ja: "所属", value: "Azure HorizonDB" },
  { label: "Focus", ja: "専門", value: "Databases & systems" },
  { label: "Email", ja: "連絡", value: <a href={`mailto:${links.email}`}>{links.email}</a> },
  { label: "GitHub", value: <a href={links.github} target="_blank" rel="noopener noreferrer">JoeS51</a> },
  { label: "LinkedIn", value: <a href={links.linkedin} target="_blank" rel="noopener noreferrer">joesluis</a> },
  { label: "Meet", ja: "面談", value: <a href={links.cal} target="_blank" rel="noopener noreferrer">Book a 15 min call</a> },
];

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteName,
  url: siteUrl,
  jobTitle: "Software Engineer",
  description: siteDescription,
  sameAs: [links.github, links.linkedin],
};

export default function Home() {
  return (
    <div className="ink-sheet">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <InkHeader ja="ソフトウェアエンジニア" big={<>JOE<br />SLUIS</>} reading="ジョー・スルイス" />
      <InkSpecs specs={specs} />
    </div>
  );
}
