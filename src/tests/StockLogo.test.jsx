/**
 * File: StockLogo.test.jsx
 * Purpose:
 * - Unit tests for StockLogo component
 *
 * Coverage:
 * - Renders logo image when src is provided
 * - Falls back to symbol initial when src is missing
 * - Falls back gracefully when image fails to load
 *
 * Testing Strategy:
 * - Tests user-visible behavior
 * - Avoids styling or implementation detail assertions
 */

import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from "./testRender";
import { StockLogo } from '@/components';

describe('StockLogo Component', () => {
  test('renders the image when a valid src is provided', () => {
    const testSrc = 'https://example.com/logo.png';

    renderWithProviders(
      <StockLogo
        symbol="AAPL"
        src={testSrc}
        alt="Apple Inc"
      />
    );

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', testSrc);
    expect(img).toHaveAttribute('alt', 'Apple Inc');
  });

  test('renders fallback initial when src is missing', () => {
    renderWithProviders(<StockLogo symbol="TESLA" />);

    // Fallback initial should be rendered
    expect(screen.getByText('T')).toBeInTheDocument();

    // No image should be rendered
    expect(
      screen.queryByRole('img')
    ).not.toBeInTheDocument();
  });

  test('renders fallback initial when image fails to load', () => {
    renderWithProviders(
      <StockLogo
        symbol="NETFLIX"
        src="broken-link.png"
      />
    );

    const img = screen.getByRole('img');

    // Simulate image load failure
    fireEvent.error(img);

    // Fallback initial should now be visible
    expect(screen.getByText('N')).toBeInTheDocument();
  });
});
