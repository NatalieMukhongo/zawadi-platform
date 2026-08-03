import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({ userRole: null }),
}));

test('renders login page', () => {
  render(<App />);
  const headingElement = screen.getByText(/Zawadi Platform/i);
  expect(headingElement).toBeInTheDocument();
});
