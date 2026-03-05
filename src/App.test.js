import { render } from '@testing-library/react';
import App from './App';

test('renders app shell', () => {
  const { container } = render(<App />);
  expect(container.firstChild).toBeInTheDocument();
});
