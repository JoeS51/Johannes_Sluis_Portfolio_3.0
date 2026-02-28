import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import '../Styles/ssh-portfolio.css';

const SshPortfolio = () => {
  const [copyLabel, setCopyLabel] = useState('Copy SSH Command');

  useEffect(() => {
    document.title = 'SSH Portfolio | Johannes Sluis';
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('ssh joesluis.dev');
      setCopyLabel('Copied');
      window.setTimeout(() => setCopyLabel('Copy SSH Command'), 1600);
    } catch (error) {
      setCopyLabel('Copy failed');
      window.setTimeout(() => setCopyLabel('Copy SSH Command'), 1600);
    }
  };

  return (
    <div className="ssh-page">
      <Navigation />

      <main className="ssh-main">
        <section className="ssh-panel" aria-labelledby="ssh-page-title">
          <h1 id="ssh-page-title">SSH Portfolio</h1>
          <p className="ssh-description">
            You can explore my portfolio directly in your terminal.
          </p>

          <div className="ssh-command-card" role="group" aria-label="SSH command">
            <code>ssh joesluis.dev</code>
          </div>

          <button
            type="button"
            className="ssh-copy-button"
            onClick={handleCopy}
            title="Copy: ssh joesluis.dev"
          >
            <span>{copyLabel}</span>
          </button>

          <p className="ssh-secondary-link">
            <Link to="/blog/ssh-portfolio-guide">
              Read how I built it
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default SshPortfolio;
