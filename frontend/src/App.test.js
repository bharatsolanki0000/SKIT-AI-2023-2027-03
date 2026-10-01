import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Camber landing page sections', () => {
  render(<App />);
  
  // Hero section heading
  expect(screen.getByText(/Good Ideas/i)).toBeInTheDocument();
  
  // Section 2: What is Camber
  expect(screen.getByText(/What is Camber\?/i)).toBeInTheDocument();
  
  // Section 3: Why Camber
  expect(screen.getByText(/Why Camber\?/i)).toBeInTheDocument();

  // Navigation
  expect(screen.getByText(/Sign up \/ Sign in/i)).toBeInTheDocument();
});

