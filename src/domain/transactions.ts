import type { CurrencyCode, DayGroup, ListItem, Transaction } from "./types";
import { netChange } from "./money";

/** Local calendar-day key (YYYY-MM-DD) for an ISO timestamp. */
function dayKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Group transactions by local day, newest day first, and compute each day's net.
 * All transactions must share `currency` (net rejects a mismatch).
 */
export function groupByDay(
  transactions: readonly Transaction[],
  currency: CurrencyCode,
): DayGroup[] {
  const buckets = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const key = dayKey(tx.date);
    const bucket = buckets.get(key);
    if (bucket === undefined) {
      buckets.set(key, [tx]);
    } else {
      bucket.push(tx);
    }
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0)) // newest day first
    .map(([dateISO, items]) => ({
      dateISO,
      items,
      net: netChange(
        items.map((t) => t.amount),
        currency,
      ),
    }));
}

/** Flatten day groups into a heterogeneous list for FlashList (header + rows). */
export function toListItems(groups: readonly DayGroup[]): ListItem[] {
  const out: ListItem[] = [];
  for (const g of groups) {
    out.push({ type: "header", dateISO: g.dateISO, net: g.net });
    for (const tx of g.items) {
      out.push({ type: "row", tx });
    }
  }
  return out;
}

/** Keep only the last 4 digits; mask the rest. Never expose a full number. */
export function maskAccountNumber(full: string): string {
  const digits = full.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `•••• ${last4}`;
}
