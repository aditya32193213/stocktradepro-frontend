/**
 * File: Sidebar.test.jsx
 * Purpose:
 * - Unit tests for Sidebar navigation component
 *
 * Coverage:
 * - Navigation link rendering
 * - Sidebar collapse / expand behavior
 *
 * Testing Strategy:
 * - Uses real NavLink behavior
 * - Tests user-visible behavior, not styles
 */

import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./testRender";
import { Sidebar } from "@/components";

describe("Sidebar Component", () => {
  const renderSidebar = () =>
    renderWithProviders(<Sidebar />);

  test("renders primary navigation links", () => {
    renderSidebar();

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/stocks/i)).toBeInTheDocument();
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument();
    expect(screen.getByText(/watchlist/i)).toBeInTheDocument();
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });

  test("collapses sidebar and hides labels", () => {
    renderSidebar();

    fireEvent.click(screen.getByTestId("sidebar-toggle"));

    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/portfolio/i)).not.toBeInTheDocument();
  });

  test("expands sidebar and shows labels again", () => {
    renderSidebar();

    const toggle = screen.getByTestId("sidebar-toggle");

    fireEvent.click(toggle); // collapse
    fireEvent.click(toggle); // expand

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument();
  });
});