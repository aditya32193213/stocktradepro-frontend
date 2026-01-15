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

import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from './testRender';
import { Footer } from '@/components';

describe('Footer Component', () => {
  const renderFooter = () =>
    renderWithProviders(<Footer />);

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
    fireEvent.click(
      screen.getByText(/terms of service/i)
    );

    expect(
      screen.getByTestId('info-modal')
    ).toBeInTheDocument();

    // Close modal
    fireEvent.click(
      screen.getByRole('button', { name: /close/i })
    );

    expect(
      screen.queryByTestId('info-modal')
    ).not.toBeInTheDocument();
  });
});
