import type { Metadata } from "next";
import { InkTitle } from "../ink-specs";

const description = "Side projects and open source contributions by Joe Sluis.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects", description, url: "/projects" },
};

type Project = { name: string; description: string; href?: string };

const projects: Project[] = [
  {
    name: "Electrocuting myself when I bite my nails",
    description: "A fun project to break a nail-biting habit the hard way.",
  },
  {
    name: "LeetCode in x86-64 assembly",
    description: "Solving LeetCode problems in x86-64 assembly.",
    href: "https://github.com/JoeS51/leetcode-x86-64",
  },
];

// Merged pull requests, newest first.
type Contribution = { repo: string; number: number; title: string };

const contributions: Contribution[] = [
  { repo: "tursodatabase/turso", number: 8586, title: "postgres: support WITHIN GROUP aggregates" },
  { repo: "tursodatabase/turso", number: 8546, title: "postgres: support quit and exit commands in tursopg cli" },
  { repo: "tursodatabase/turso", number: 8320, title: "postgres: implement pg_get_expr function" },
  { repo: "tursodatabase/turso", number: 8466, title: "postgres: fix current date and time expressions being treated as columns" },
  { repo: "GreptimeTeam/greptimedb", number: 7994, title: "fix: allow ipv4_num_to_string to accept valid integers" },
];

const logos: Record<string, string> = {
  "tursodatabase/turso": "/images/logos/turso.png",
  "GreptimeTeam/greptimedb": "/images/logos/greptimedb.png",
};

function number(index: number, total: number) {
  return String(total - index).padStart(2, "0");
}

export default function Page() {
  return (
    <div className="ink-sheet">
      <InkTitle ja="プロジェクト" title="Projects" />
      <ol className="ink-posts">
        {projects.map((project, index) => (
          <li key={project.name}>
            <span className="ink-post-number">{number(index, projects.length)}</span>
            <div>
              {project.href
                ? <a className="ink-post-title" href={project.href} target="_blank" rel="noopener noreferrer">{project.name}</a>
                : <h2 className="ink-project-name">{project.name}</h2>}
              <p className="ink-post-description">{project.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <h2 className="ink-section-title">Open source<span lang="ja" aria-hidden="true">オープンソース</span></h2>
      <ol className="ink-posts">
        {contributions.map((pr) => (
          <li key={`${pr.repo}#${pr.number}`}>
            {/* Decorative: the repo name is spelled out in the meta line. */}
            <img className="ink-pr-logo" src={logos[pr.repo]} alt="" width={24} height={24} />
            <div>
              <a className="ink-post-title" href={`https://github.com/${pr.repo}/pull/${pr.number}`} target="_blank" rel="noopener noreferrer">{pr.title}</a>
              <p className="ink-post-meta">
                {pr.repo} #{pr.number}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
