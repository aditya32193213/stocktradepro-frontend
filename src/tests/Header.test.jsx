import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '@/components/layout/Header';
import authReducer from '@/features/auth/authSlice';
import { vi } from 'vitest';

vi.mock('@/components/common/ThemeToggle', () => ({
  default: () => <div>ThemeToggle</div>
}));

const renderWithAuth = (isAuthenticated) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { isAuthenticated, user: { name: 'Test User' } }
    }
  });
  return render(
    <Provider store={store}>
      <BrowserRouter><Header /></BrowserRouter>
    </Provider>
  );
};

describe('Header Component', () => {
  test('renders Login/Register buttons when not authenticated', () => {
    renderWithAuth(false);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    // ✅ FIX: Changed 'register' to 'Sign Up'
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('renders User Dropdown when authenticated', () => {
    renderWithAuth(true);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });
});