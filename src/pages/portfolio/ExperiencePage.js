import Experience from '../../Experience';
import MobileExperience from '../../MobileExperience';
import PortfolioPageShell from '../../Components/portfolio/PortfolioPageShell';
import { PageHeading, useIsMobile } from '../../Components/portfolio/PortfolioSections';

const ExperiencePage = () => {
  const isMobile = useIsMobile();

  return (
    <PortfolioPageShell>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <PageHeading
          title="Experience"
          subtitle="Professional, internship, and research work across product engineering, startup software, and human-centered computing."
        />
        {isMobile ? <MobileExperience /> : <Experience />}
      </div>
    </PortfolioPageShell>
  );
};

export default ExperiencePage;
