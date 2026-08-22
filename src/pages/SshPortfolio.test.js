import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DarkModeProvider } from '../Components/DarkModeContext';
import SshPortfolio from './SshPortfolio';

const renderPage = () =>
  render(
    <DarkModeProvider>
      <MemoryRouter>
        <SshPortfolio />
      </MemoryRouter>
    </DarkModeProvider>
  );

describe('SshPortfolio', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders fallback messaging when the terminal URL is not configured', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /ssh portfolio/i })).toBeInTheDocument();
    expect(screen.getByText(/live terminal not configured/i)).toBeInTheDocument();
    expect(screen.getByText('ssh joesluis.dev')).toBeInTheDocument();
  });

  it('renders the embedded terminal when configured and clears the loading state on load', () => {
    vi.stubEnv('VITE_SSH_TERMINAL_URL', 'https://terminal.joesluis.dev');

    renderPage();

    const iframe = screen.getByTitle(/ssh portfolio terminal/i);
    expect(iframe).toHaveAttribute('src', 'https://terminal.joesluis.dev');
    expect(iframe).toHaveAttribute('sandbox', 'allow-forms allow-scripts');
    expect(screen.getByText(/connecting to terminal service/i)).toBeInTheDocument();

    fireEvent.load(iframe);

    expect(screen.queryByText(/connecting to terminal service/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open full terminal/i })).toHaveAttribute(
      'href',
      'https://terminal.joesluis.dev'
    );
  });
});
