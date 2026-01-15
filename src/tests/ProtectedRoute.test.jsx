import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '@/components/common/ProtectedRoute'; 
import authReducer from '@/features/auth/authSlice';

// Helper to render with Auth State
const renderWithAuth = (isAuthenticated) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { isAuthenticated }
    }
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route 
            path="/protected" 
            element={
              <ProtectedRoute>
                <h1>Secret Dashboard</h1>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('ProtectedRoute Component', () => {
  test('redirects to login if user is NOT authenticated', () => {
    renderWithAuth(false);
    
    // Should NOT see the secret content
    expect(screen.queryByText(/secret dashboard/i)).not.toBeInTheDocument();
    
    // Should see the Login Page (because of redirect)
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders children if user IS authenticated', () => {
    renderWithAuth(true);
    
    // Should see the secret content
    expect(screen.getByText(/secret dashboard/i)).toBeInTheDocument();
    
    // Should NOT see login page
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument();
  });
});