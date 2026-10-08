import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Camber landing page sections including lower sections', () => {
  render(<App />);
  
  // Upper sections
  expect(screen.getByRole('heading', { level: 1, name: /Good Ideas/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /What is Camber\?/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /Why Camber\?/i })).toBeInTheDocument();

  // Navigation
  expect(screen.getByText(/Sign up \/ Sign in/i)).toBeInTheDocument();

  // Lower sections
  expect(screen.getByRole('heading', { level: 2, name: /Features/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /How Camber Works/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /Our Values/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /Who is Camber for\?/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /Frequently Asked Questions/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /Ready to grow your ideas\?/i })).toBeInTheDocument();
  expect(screen.getByText(/Good ideas grow here\./i)).toBeInTheDocument();
});
