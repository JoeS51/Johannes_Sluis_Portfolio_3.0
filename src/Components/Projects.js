import { motion } from 'framer-motion';
import manuscript from '../Pictures/manuscript.png';
import jenni from '../Pictures/jenni.JPG';
import spotlite from '../Pictures/spotlite.JPG';
import simple from '../Pictures/simpledb.jpg';
import stimma2 from '../Pictures/stimma2.png';
import algoviz from '../Pictures/algoviz.JPG';
import { useIsMobile } from './portfolio/PortfolioSections';

const projects = [
  {
    title: 'SimpleDB',
    category: 'Database',
    description:
      'A compact relational database project centered on query execution, storage internals, and the mechanics behind core database systems.',
    secondaryHref: 'https://github.com/JoeS51',
    secondaryLabel: 'GitHub',
    image: simple,
    imageAlt: 'SimpleDB project graphic',
    imageVariant: 'contain',
  },
  {
    title: 'AlgoViz',
    category: 'Side Project',
    description:
      'A visualization-focused algorithms project designed to make technical concepts more readable, explorable, and easier to teach.',
    href: 'https://github.com/hcp-uw/algo-visualizer',
    secondaryHref: 'https://github.com/hcp-uw/algo-visualizer',
    secondaryLabel: 'GitHub',
    image: algoviz,
    imageAlt: 'AlgoViz interface preview',
  },
  {
    title: 'Manuscript Checker AI',
    category: 'AI Tool',
    description:
      'An AI-assisted manuscript review product focused on surfacing plagiarism risk and editorial issues before submission.',
    href: 'https://www.manuscriptcheck.ai/',
    image: manuscript,
    imageAlt: 'Manuscript Checker AI product preview',
  },
  {
    title: 'Jenni AI Preview Tools',
    category: 'Internship',
    description:
      'Internal preview tooling built around faster content iteration, evaluation, and product feedback loops for the Jenni AI writing workflow.',
    href: 'https://jenni.ai/',
    image: jenni,
    imageAlt: 'Jenni AI interface preview',
  },
  {
    title: 'Stimma',
    category: 'Startup',
    description:
      'A concept for creating and sharing AI-generated media with a stronger emphasis on creative workflows and lightweight publishing.',
    href: 'https://stimma.us',
    image: stimma2,
    imageAlt: 'Stimma product preview',
    imageVariant: 'contain',
  },
  {
    title: 'SpotLite',
    category: 'Hackathon',
    description:
      'A real-time collaboration concept built during a hackathon, with emphasis on quick interaction, messaging, and shared presence.',
    href: 'https://github.com/JoeS51/Dubhacks24',
    secondaryHref: 'https://github.com/JoeS51/Dubhacks24',
    secondaryLabel: 'GitHub',
    image: spotlite,
    imageAlt: 'SpotLite project preview',
  },
];

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#2563eb',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 600,
  letterSpacing: '0.01em',
};

const Projects = () => {
  const isMobile = useIsMobile();

  return (
    <section style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {projects.map((project, index) => {
        const links = [
          project.href ? { href: project.href, label: 'View Project' } : null,
          project.secondaryHref && project.secondaryHref !== project.href
            ? { href: project.secondaryHref, label: project.secondaryLabel || 'More' }
            : null,
        ].filter(Boolean);

        return (
          <motion.article
            key={project.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            whileHover={{ y: -2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile || !project.image ? '1fr' : 'minmax(0, 1.3fr) minmax(280px, 0.9fr)',
              gap: isMobile ? '20px' : '32px',
              alignItems: 'center',
              padding: isMobile ? '28px 0' : '36px 0',
              borderTop: index === 0 ? '1px solid var(--divider-color)' : 'none',
              borderBottom: '1px solid var(--divider-color)',
            }}
            className="projects-editorial-row"
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid rgba(37, 99, 235, 0.18)',
                  backgroundColor: 'rgba(96, 165, 250, 0.08)',
                  color: '#2563eb',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '18px',
                }}
              >
                {project.category}
              </div>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.4rem)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.03em',
                  fontWeight: 900,
                  margin: 0,
                  color: '#111111',
                }}
              >
                {project.title}
              </h2>
              <p
                style={{
                  marginTop: '18px',
                  marginBottom: '24px',
                  fontSize: isMobile ? '1rem' : '1.05rem',
                  lineHeight: 1.8,
                  color: 'rgba(15, 23, 42, 0.72)',
                  maxWidth: '620px',
                }}
              >
                {project.description}
              </p>
              {links.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 24px' }}>
                  {links.map((link) => (
                    <a
                      key={`${project.title}-${link.label}`}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={linkStyle}
                    >
                      {link.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            {project.image ? (
              <div
                style={{
                  justifySelf: 'stretch',
                  width: '100%',
                  borderRadius: '18px',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  backgroundColor: '#fcfcfd',
                  overflow: 'hidden',
                  order: isMobile ? 2 : 0,
                }}
              >
                <motion.img
                  src={project.image}
                  alt={project.imageAlt}
                  whileHover={{ opacity: 0.92 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: isMobile ? '220px' : '280px',
                    objectFit: project.imageVariant === 'contain' ? 'contain' : 'cover',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>
            ) : null}
          </motion.article>
        );
      })}
    </section>
  );
};

export default Projects;
