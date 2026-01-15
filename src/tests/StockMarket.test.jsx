/**
 * File: StockMarket.test.jsx
 * Purpose:
 * - Unit tests for StockMarket page
 *
 * Coverage:
 * - Search and filter UI
 * - Stock list rendering
 * - Infinite scroll wrapper
 * - Navigation on stock row click
 *
 * Testing Strategy:
 * - Uses real Redux slice
 * - Mocks InfiniteScroll and navigation
 * - Tests user-visible behavior only
 */

import { screen, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";

import StockMarket from "@/pages/StockMarket";
import { stocksReducer } from "@/features";

// ---------------- MOCKS ----------------

// Infinite scroll mock
vi.mock("react-infinite-scroll-component", () => ({
  default: ({ children }) => (
    <div data-testid="infinite-scroll">{children}</div>
  ),
}));

// StockLogo & Skeleton mock
vi.mock("@/components", () => ({
  StockLogo: () => <div>Logo</div>,
  TableSkeleton: () => <div>TableSkeleton</div>,
}));

// Navigation mock
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ---------------- HELPER ----------------
const renderStockMarket = (preloadedState) => {
  const store = configureStore({
    reducer: {
      stocks: stocksReducer,
    },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <StockMarket />
      </BrowserRouter>
    </Provider>
  );
};

// ---------------- TESTS ----------------
describe("StockMarket Page", () => {
  const mockState = {
    stocks: {
      list: [
        {
          _id: "1",
          symbol: "RELIANCE",
          companyName: "Reliance Industries",
          price: 2500,
          changePercent: 2.5,
          volume: 100000,
          sector: "Energy",
        },
        {
          _id: "2",
          symbol: "TCS",
          companyName: "Tata Consultancy",
          price: 3200,
          changePercent: -0.8,
          volume: 50000,
          sector: "IT",
        },
      ],
      loading: false,
      error: null,
      page: 1,
      totalPages: 5,
      totalRecords: 2,
      sectors: ["IT", "Energy"],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders search bar and sector filter", () => {
    renderStockMarket(mockState);

    expect(
      screen.getByPlaceholderText(/search by symbol or company name/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/all sectors/i)).toBeInTheDocument();
  });

  test("renders stock list inside infinite scroll", () => {
    renderStockMarket(mockState);

    expect(screen.getByTestId("infinite-scroll")).toBeInTheDocument();
    expect(screen.getByText("RELIANCE")).toBeInTheDocument();
    expect(screen.getByText("TCS")).toBeInTheDocument();
  });

  test("updates search input value when typing", () => {
    renderStockMarket(mockState);

    const searchInput = screen.getByPlaceholderText(
      /search by symbol or company name/i
    );

    fireEvent.change(searchInput, { target: { value: "Adani" } });
    expect(searchInput.value).toBe("Adani");
  });

  test("navigates to stock detail page on row click", () => {
    renderStockMarket(mockState);

    fireEvent.click(screen.getByTestId("stock-row-1"));
    expect(mockNavigate).toHaveBeenCalledWith("/stocks/1");
  });
});
