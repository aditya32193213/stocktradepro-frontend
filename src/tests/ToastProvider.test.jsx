/**
 * File: ToastProvider.test.jsx
 * Purpose:
 * - Unit test for ToastProvider component
 *
 * Coverage:
 * - Ensures the provider renders without crashing
 *
 * Testing Strategy:
 * - Does not test react-hot-toast internals
 * - Verifies integration-level stability only
 */

import { renderWithProviders } from "./testRender";
import { ToastProvider } from '@/components';

describe('ToastProvider Component', () => {
  test('renders toast provider without crashing', () => {
    const { container } = renderWithProviders(<ToastProvider />);

    // If rendering succeeds, container should exist
    expect(container).toBeInTheDocument();
  });
});
