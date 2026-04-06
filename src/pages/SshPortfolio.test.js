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
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.REACT_APP_SSH_TERMINAL_URL;
    delete process.env.REACT_APP_SSH_TERMINAL_EMBED_MODE;
    delete process.env.REACT_APP_SSH_TERMINAL_HEALTHCHECK_URL;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('renders fallback messaging when the terminal URL is not configured', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /ssh portfolio/i })).toBeInTheDocument();
    expect(screen.getByText(/live terminal not configured/i)).toBeInTheDocument();
    expect(screen.getByText('ssh joesluis.dev')).toBeInTheDocument();
  });

  it('renders the embedded terminal when configured and clears the loading state on load', () => {
    process.env.REACT_APP_SSH_TERMINAL_URL = 'https://terminal.joesluis.dev';

    renderPage();

    const iframe = screen.getByTitle(/ssh portfolio terminal/i);
    expect(iframe).toHaveAttribute('src', 'https://terminal.joesluis.dev');
    expect(screen.getByText(/connecting to terminal service/i)).toBeInTheDocument();

    fireEvent.load(iframe);

    expect(screen.queryByText(/connecting to terminal service/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open full terminal/i })).toHaveAttribute(
      'href',
      'https://terminal.joesluis.dev'
    );
  });
});
