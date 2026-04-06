import PortfolioPageShell from '../../Components/portfolio/PortfolioPageShell';
import { HomeHero } from '../../Components/portfolio/PortfolioSections';

const HomePage = () => {
  return (
    <PortfolioPageShell offsetContent={false}>
      <HomeHero />
    </PortfolioPageShell>
  );
};

export default HomePage;
