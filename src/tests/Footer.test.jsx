/**
 * File: Footer.test.jsx
 * Purpose:
 * - Unit tests for Footer component
 *
 * Coverage:
 * - Brand rendering
 * - Legal modal open & close behavior
 *
 * Testing Strategy:
 * - Uses semantic queries
 * - Avoids testing modal implementation details
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '@/components/layout/Footer';

describe('Footer Component', () => {
  const renderFooter = () =>
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

  test('renders brand name and description', () => {
    renderFooter();

    expect(
      screen.getByRole('heading', { name: /stocktradepro/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/empowering the next generation/i)
    ).toBeInTheDocument();
  });

  test('opens and closes Terms of Service modal', () => {
    renderFooter();

    // Open modal
    fireEvent.click(screen.getByText(/terms of service/i));

    const modal = screen.getByTestId('info-modal');
    expect(modal).toBeInTheDocument();

    // Close modal (InfoModal exposes close button)
    fireEvent.click(
      screen.getByRole('button', { name: /close/i })
    );

    expect(
      screen.queryByTestId('info-modal')
    ).not.toBeInTheDocument();
  });
});
