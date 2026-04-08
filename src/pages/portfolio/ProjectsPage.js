import Projects from '../../Components/Projects';
import PortfolioPageShell from '../../Components/portfolio/PortfolioPageShell';
import { PageHeading } from '../../Components/portfolio/PortfolioSections';

const ProjectsPage = () => {
  return (
    <PortfolioPageShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8" style={{ paddingTop: '8px' }}>
        <PageHeading title="Projects" />
        <Projects />
      </div>
    </PortfolioPageShell>
  );
};

export default ProjectsPage;
