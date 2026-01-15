import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '@/components/layout/Footer';

describe('Footer Component', () => {
  test('renders brand name and description', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    // ✅ FIX: Target the heading specifically to avoid duplicates
    expect(screen.getByRole('heading', { name: /stocktradepro/i })).toBeInTheDocument();
    expect(screen.getByText(/empowering the next generation/i)).toBeInTheDocument();
  });

  test('opens Terms modal when clicked', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const termsButton = screen.getByText(/terms of service/i);
    fireEvent.click(termsButton);
    expect(screen.getByRole('heading', { name: /terms of service/i })).toBeInTheDocument();
  });
});