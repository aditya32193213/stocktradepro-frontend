import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';

describe('Sidebar Component', () => {
  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/stocks/i)).toBeInTheDocument();
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument();
    expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
  });
});