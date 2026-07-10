import type { Money, Transaction } from "../types";
import {
  CurrencyMismatchError,
  addMoney,
  directionOf,
  formatMoney,
  netChange,
} from "../money";
import { groupByDay, maskAccountNumber, toListItems } from "../transactions";

const eur = (m: number): Money => ({ amountMinor: m, currency: "EUR" });
const usd = (m: number): Money => ({ amountMinor: m, currency: "USD" });

describe("formatMoney", () => {
  it("formats positive and negative cents with currency", () => {
    expect(formatMoney(eur(428_355), "en-US")).toBe("€4,283.55");
    expect(formatMoney(usd(-1299), "en-US")).toBe("-$12.99");
  });
  it("formats zero", () => {
    expect(formatMoney(eur(0), "en-US")).toBe("€0.00");
  });
});

describe("directionOf", () => {
  it("negative is debit, zero/positive is credit", () => {
    expect(directionOf(eur(-1))).toBe("debit");
    expect(directionOf(eur(0))).toBe("credit");
    expect(directionOf(eur(5))).toBe("credit");
  });
});

describe("addMoney / netChange", () => {
  it("adds same-currency amounts", () => {
    expect(addMoney(eur(100), eur(-30))).toEqual(eur(70));
  });
  it("sums a list to a net", () => {
    expect(netChange([eur(250_000), eur(-1299), eur(-4590)], "EUR")).toEqual(
      eur(244_111),
    );
  });
  it("rejects mixed currencies with a typed error", () => {
    expect(() => addMoney(eur(100), usd(100))).toThrow(CurrencyMismatchError);
    expect(() => netChange([eur(100), usd(100)], "EUR")).toThrow(
      CurrencyMismatchError,
    );
  });
});

describe("maskAccountNumber", () => {
  it("keeps only the last 4 digits", () => {
    expect(maskAccountNumber("ES91 2100 0418 4502 0005 1332")).toBe("•••• 1332");
    expect(maskAccountNumber("4321")).toBe("•••• 4321");
  });
});

describe("groupByDay / toListItems", () => {
  const t = (id: string, minor: number, date: string): Transaction => ({
    id,
    accountId: "a",
    amount: eur(minor),
    description: id,
    date,
    direction: minor < 0 ? "debit" : "credit",
  });

  const txs = [
    t("a", -100, "2026-07-09T09:00:00Z"),
    t("b", 500, "2026-07-09T20:00:00Z"),
    t("c", -50, "2026-07-08T10:00:00Z"),
  ];

  it("groups by day, newest first, with per-day net", () => {
    const groups = groupByDay(txs, "EUR");
    expect(groups.map((g) => g.dateISO)).toEqual(["2026-07-09", "2026-07-08"]);
    expect(groups[0]?.net).toEqual(eur(400));
    expect(groups[1]?.net).toEqual(eur(-50));
  });

  it("flattens to header+row items for the list", () => {
    const items = toListItems(groupByDay(txs, "EUR"));
    expect(items[0]).toMatchObject({ type: "header", dateISO: "2026-07-09" });
    expect(items.filter((i) => i.type === "row")).toHaveLength(3);
    expect(items.filter((i) => i.type === "header")).toHaveLength(2);
  });

  it("propagates a currency mismatch from net calculation", () => {
    const mixed = [t("a", -100, "2026-07-09T09:00:00Z")].concat({
      id: "x",
      accountId: "a",
      amount: usd(1),
      description: "x",
      date: "2026-07-09T10:00:00Z",
      direction: "credit",
    });
    expect(() => groupByDay(mixed, "EUR")).toThrow(CurrencyMismatchError);
  });
});
