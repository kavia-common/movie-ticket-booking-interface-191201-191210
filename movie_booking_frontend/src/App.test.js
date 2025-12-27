import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Now Showing title', () => {
  render(<App />);
  const title = screen.getByText(/Now Showing/i);
  expect(title).toBeInTheDocument();
});
