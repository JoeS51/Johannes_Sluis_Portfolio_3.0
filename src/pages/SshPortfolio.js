import { useEffect, useState } from 'react';
import { ExternalLink, TerminalSquare } from 'lucide-react';
import Navigation from '../Components/Navigation';
import '../Styles/ssh-portfolio.css';

const commandLines = [
  { prompt: 'guest@joesluis.dev', command: 'ssh joesluis.dev' },
  { prompt: 'ssh-portfolio', command: 'help' },
  { prompt: 'ssh-portfolio', command: 'projects' },
  { prompt: 'ssh-portfolio', command: 'about' },
];

const SshPortfolio = () => {
  const [copyLabel, setCopyLabel] = useState('Copy SSH Command');

  useEffect(() => {
    document.title = 'SSH Portfolio | Johannes Sluis';
  }, []);

  useEffect(() => {
    document.body.classList.add('ssh-body');
    document.documentElement.classList.add('ssh-body');

    return () => {
      document.body.classList.remove('ssh-body');
      document.documentElement.classList.remove('ssh-body');
    };
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
        <section className="ssh-hero-panel" aria-labelledby="ssh-page-title">
          <div className="ssh-terminal-shell">
            <div className="ssh-terminal-header">
              <div className="ssh-terminal-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>joesluis.dev :: interactive ssh portfolio</p>
            </div>

            <div className="ssh-terminal-body">
              <div className="ssh-terminal-intro">
                <TerminalSquare size={18} />
                <span>Terminal Portfolio</span>
              </div>

              {commandLines.map((line) => (
                <div key={`${line.prompt}-${line.command}`} className="ssh-line">
                  <span className="ssh-prompt">{line.prompt}$</span>
                  <span className="ssh-command">{line.command}</span>
                </div>
              ))}

              <div className="ssh-output">
                <p>
                  I built a fully interactive SSH-based portfolio you can explore directly from your
                  terminal.
                </p>
                <p>
                  If you like command-line interfaces, this is the fun version of the site.
                </p>
              </div>
            </div>
          </div>

          <div className="ssh-content">
            <p className="ssh-eyebrow">Hidden terminal mode</p>
            <h1 id="ssh-page-title">Try the portfolio over SSH</h1>
            <p className="ssh-description">
              This website has a command-line twin. Connect with the command below to browse my work
              in a terminal-first experience.
            </p>

            <div className="ssh-command-card" role="group" aria-label="SSH command">
              <code>ssh joesluis.dev</code>
            </div>

            <div className="ssh-actions">
              <button
                type="button"
                className="ssh-action ssh-action-primary"
                onClick={handleCopy}
                title="Copy: ssh joesluis.dev"
              >
                <TerminalSquare size={16} />
                <span>{copyLabel}</span>
              </button>
              <a
                className="ssh-action ssh-action-secondary"
                href="/blog/ssh-portfolio-guide"
              >
                <ExternalLink size={16} />
                <span>Read the build story</span>
              </a>
            </div>

            <ul className="ssh-feature-list">
              <li>Interactive command-driven navigation</li>
              <li>Terminal-native way to explore projects and background</li>
              <li>Fast, nerdy, and genuinely fun to demo</li>
            </ul>

            <p className="ssh-note">
              Tip: open your local terminal and run <code>ssh joesluis.dev</code>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SshPortfolio;
