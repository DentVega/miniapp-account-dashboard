import React from "react";
import { render, screen } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@org/ui-kit";
import type { Capability, CapabilityGrant } from "@org/miniapp-contract";
import Entry from "../Entry";

// FlashList relies on native layout to render its window; in the test env we mock
// it to render the header + all rows synchronously so we can assert composition.
interface MockFlashListProps {
  data?: readonly unknown[];
  renderItem: (info: { item: unknown; index: number }) => React.ReactNode;
  ListHeaderComponent?: React.ReactNode;
  keyExtractor?: (item: unknown, index: number) => string;
}

jest.mock("@shopify/flash-list", () => {
  const ReactMock = require("react");
  const { View } = require("react-native");
  const FlashList = ({
    data,
    renderItem,
    ListHeaderComponent,
    keyExtractor,
  }: MockFlashListProps) =>
    ReactMock.createElement(View, null, [
      ListHeaderComponent
        ? ReactMock.createElement(ReactMock.Fragment, { key: "h" }, ListHeaderComponent)
        : null,
      ...(data ?? []).map((item, index) =>
        ReactMock.createElement(
          View,
          { key: keyExtractor ? keyExtractor(item, index) : index },
          renderItem({ item, index }),
        ),
      ),
    ]);
  return { FlashList };
});

function grant(granted: Capability[], revoked = false): CapabilityGrant {
  return { granted, isRevoked: () => revoked };
}

function renderWithProviders(ui: React.ReactElement): void {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <ThemeProvider scheme="light">{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
}

describe("Entry — capability gate", () => {
  it("blocks when accounts:read is not granted", () => {
    renderWithProviders(<Entry capabilities={grant([])} />);
    expect(
      screen.getByRole("header", { name: "Acceso no autorizado" }),
    ).toBeOnTheScreen();
  });

  it("blocks when the grant is revoked", () => {
    renderWithProviders(<Entry capabilities={grant(["accounts:read"], true)} />);
    expect(screen.getByText(/necesita el permiso/i)).toBeOnTheScreen();
  });
});

describe("Entry — dashboard", () => {
  it("loads the balance and a transaction when authorized", async () => {
    renderWithProviders(<Entry capabilities={grant(["accounts:read"])} />);
    expect(
      await screen.findByText("€4,283.55", {}, { timeout: 3000 }),
    ).toBeOnTheScreen();
    expect(screen.getByText(/Cuenta Nómina/)).toBeOnTheScreen();
    expect(screen.getByText("Café Central")).toBeOnTheScreen();
  });
});
