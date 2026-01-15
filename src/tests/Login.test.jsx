
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '@/pages/Login';
import authReducer from '@/features/auth/authSlice';

const renderWithProviders = (ui, { preloadedState = {} } = {}) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        loading: false,
        error: null,
        ...preloadedState.auth
      }
    }
  });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to dashboard/i })).toBeInTheDocument();
  });

  test('displays loading spinner when state.auth.loading is true', () => {
    renderWithProviders(<Login />, {
      preloadedState: {
        auth: { loading: true }
      }
    });

    // ✅ FIX: Target the specific button text "Signing in..." that appears during loading
    // to avoid conflict with the Theme Toggle button.
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();
  });

  test('contains link to the registration page', () => {
    renderWithProviders(<Login />);
    
    const link = screen.getByRole('link', { name: /create account/i });
    expect(link).toHaveAttribute('href', '/register');
  });
});