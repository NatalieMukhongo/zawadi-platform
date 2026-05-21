import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({ userRole: null }),
}));

import App from './App';

test('renders login page', () => {
  render(<App />);
  const headingElement = screen.getByText(/Zawadi Platform/i);
  expect(headingElement).toBeInTheDocument();
});
