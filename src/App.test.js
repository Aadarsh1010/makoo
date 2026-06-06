import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders makoo bakery app', () => {
  render(<App />);
  const headings = screen.getAllByText(/makoo bakery/i);
  expect(headings.length).toBeGreaterThanOrEqual(1);
});
