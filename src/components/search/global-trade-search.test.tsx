import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { GlobalTradeSearch } from "./global-trade-search";
import { ToastProvider } from "@/components/shared/toast";
import { countries, hsCodes, products } from "@/lib/data";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function renderSearch() {
  return render(
    <ToastProvider>
      <GlobalTradeSearch
        countries={countries}
        products={products}
        hsCodes={hsCodes}
        variant="full"
      />
    </ToastProvider>,
  );
}

describe("GlobalTradeSearch", () => {
  it("renders the search type tabs and a query summary", () => {
    renderSearch();
    expect(screen.getByRole("tab", { name: /Product/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /HS Code/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Company/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Country/ })).toBeInTheDocument();
    expect(screen.getByText(/Summary:/)).toBeInTheDocument();
  });

  it("shows product suggestions when typing", () => {
    renderSearch();
    const input = screen.getByLabelText("Product name");
    fireEvent.change(input, { target: { value: "honey" } });
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getByText("Natural honey")).toBeInTheDocument();
  });

  it("switches to HS code search and updates the input affordance", () => {
    renderSearch();
    fireEvent.click(screen.getByRole("tab", { name: /HS Code/ }));
    expect(screen.getByLabelText("HS code")).toBeInTheDocument();
  });

  it("offers a country selector in country mode", () => {
    renderSearch();
    fireEvent.click(screen.getByRole("tab", { name: /Country/ }));
    expect(screen.getByLabelText("Country or market")).toBeInTheDocument();
  });

  it("warns and does not navigate when searching with no term", () => {
    renderSearch();
    fireEvent.submit(screen.getByRole("form", { name: "Global Trade Search" }));
    expect(push).not.toHaveBeenCalled();
  });
});
