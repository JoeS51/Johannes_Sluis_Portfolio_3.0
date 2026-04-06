import { SlideTabs } from '../SlideTabs';

const PortfolioPageShell = ({ children, offsetContent = true }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
      }}
    >
      <SlideTabs />
      <main style={{ paddingTop: offsetContent ? '88px' : '0', paddingBottom: offsetContent ? '48px' : '0' }}>
        {children}
      </main>
    </div>
  );
};

export default PortfolioPageShell;
