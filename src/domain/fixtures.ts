import type { Account, Transaction } from "./types";

/** Mock data — NO real PII. Amounts in integer minor units (cents), currency EUR. */

export const mockAccount: Account = {
  id: "acc-1",
  alias: "Cuenta Nómina",
  type: "checking",
  balance: { amountMinor: 428_355, currency: "EUR" }, // €4,283.55
  maskedNumber: "•••• 4321",
};

const tx = (
  id: string,
  minor: number,
  description: string,
  date: string,
  category?: string,
): Transaction => ({
  id,
  accountId: mockAccount.id,
  amount: { amountMinor: minor, currency: "EUR" },
  description,
  date,
  direction: minor < 0 ? "debit" : "credit",
  category,
});

export const mockTransactions: Transaction[] = [
  tx("t1", 250_000, "Nómina Julio", "2026-07-09T08:00:00Z", "income"),
  tx("t2", -1_299, "Café Central", "2026-07-09T09:15:00Z", "food"),
  tx("t3", -4_590, "Supermercado", "2026-07-09T19:40:00Z", "groceries"),
  tx("t4", -899, "Metro", "2026-07-08T07:50:00Z", "transport"),
  tx("t5", -6_200, "Farmacia", "2026-07-08T18:05:00Z", "health"),
  tx("t6", -1_050, "Panadería", "2026-07-08T08:30:00Z", "food"),
  tx("t7", 12_000, "Reembolso amigo", "2026-07-07T21:10:00Z", "transfer"),
  tx("t8", -3_499, "Streaming", "2026-07-07T06:00:00Z", "subscriptions"),
  tx("t9", -8_750, "Restaurante", "2026-07-07T14:20:00Z", "food"),
  tx("t10", -2_000, "Parking", "2026-07-06T11:00:00Z", "transport"),
  tx("t11", -15_499, "Zapatos", "2026-07-06T16:45:00Z", "shopping"),
  tx("t12", -720, "Kiosko", "2026-07-06T20:00:00Z", "misc"),
];
