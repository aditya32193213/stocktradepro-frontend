import { render, screen, fireEvent } from '@testing-library/react';
import StockLogo from '@/components/common/StockLogo'; // Adjust path if your logo is in a different folder

describe('StockLogo Component', () => {
  test('renders the image when a valid src is provided', () => {
    const testSrc = 'https://example.com/logo.png';
    render(<StockLogo symbol="AAPL" src={testSrc} alt="Apple Inc" />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', testSrc);
    expect(img).toHaveAttribute('alt', 'Apple Inc');
  });

  test('renders the fallback initials when src is missing', () => {
    // No src provided
    render(<StockLogo symbol="TESLA" />);
    
    // Should verify that 'T' (first letter) is present
    expect(screen.getByText('T')).toBeInTheDocument();
    // Should NOT find an image tag
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('renders the fallback initials when the image fails to load (onError)', () => {
    const brokenSrc = 'broken-link.png';
    render(<StockLogo symbol="NETFLIX" src={brokenSrc} />);
    
    const img = screen.getByRole('img');
    
    // Simulate image load error
    fireEvent.error(img);

    // Now the image should be replaced by text 'N'
    expect(screen.getByText('N')).toBeInTheDocument();
  });
});