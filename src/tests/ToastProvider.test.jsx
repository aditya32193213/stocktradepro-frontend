import { render } from '@testing-library/react';
import ToastProvider from '@/components/common/ToastProvider';
import { Toaster } from 'react-hot-toast';

// We just want to ensure it renders the library component
describe('ToastProvider', () => {
  test('renders Toaster component', () => {
    // Since Toaster renders a div with specific styles/ids usually at the root
    // We verify it doesn't crash the test runner.
    const { container } = render(<ToastProvider />);
    expect(container).toBeTruthy();
  });
});