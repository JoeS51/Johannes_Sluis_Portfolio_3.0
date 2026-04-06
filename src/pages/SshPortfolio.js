import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../Components/Navigation';
import SshTerminalEmbed from '../Components/SshTerminalEmbed';
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
        <section className="ssh-hero" aria-labelledby="ssh-page-title">
          <div className="ssh-panel ssh-panel--intro">
            <p className="ssh-eyebrow">SSH access</p>
            <h1 id="ssh-page-title">SSH Portfolio</h1>
            <p className="ssh-description">
              Explore the portfolio directly from your own terminal, or launch the hosted browser terminal below.
            </p>

            <div className="ssh-command-card" role="group" aria-label="SSH command">
              <code>ssh joesluis.dev</code>
            </div>

            <div className="ssh-actions">
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
            </div>
          </div>

          <SshTerminalEmbed />
        </section>
      </main>
    </div>
  );
};

export default SshPortfolio;
