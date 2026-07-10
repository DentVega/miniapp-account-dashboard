import type { CurrencyCode, Direction, Money } from "./types";

/** Thrown when combining Money of different currencies (no FX in the MVP). */
export class CurrencyMismatchError extends Error {
  constructor(
    readonly a: CurrencyCode,
    readonly b: CurrencyCode,
  ) {
    super(`Cannot combine ${a} with ${b}: mixed currencies are not supported.`);
    this.name = "CurrencyMismatchError";
  }
}

// Hoisted Intl formatters, cached by currency+locale (js-hoist-intl).
const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(currency: CurrencyCode, locale: string): Intl.NumberFormat {
  const key = `${locale}:${currency}`;
  let f = formatterCache.get(key);
  if (f === undefined) {
    f = new Intl.NumberFormat(locale, { style: "currency", currency });
    formatterCache.set(key, f);
  }
  return f;
}

/** All supported currencies use 2 minor digits. */
const MINOR_DIGITS = 2;

/** Format integer minor units + currency into a localized string. */
export function formatMoney(money: Money, locale = "en-US"): string {
  const major = money.amountMinor / 10 ** MINOR_DIGITS;
  return getFormatter(money.currency, locale).format(major);
}

/** Debit when negative; credit when zero or positive (by convention). */
export function directionOf(money: Money): Direction {
  return money.amountMinor < 0 ? "debit" : "credit";
}

/** Add two Money of the SAME currency. Throws CurrencyMismatchError otherwise. */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new CurrencyMismatchError(a.currency, b.currency);
  }
  return { amountMinor: a.amountMinor + b.amountMinor, currency: a.currency };
}

/**
 * Net sum of transactions' amounts. All must share `currency`; a mismatch
 * rejects with CurrencyMismatchError (no implicit FX).
 */
export function netChange(
  amounts: readonly Money[],
  currency: CurrencyCode,
): Money {
  return amounts.reduce<Money>(
    (acc, m) => addMoney(acc, m),
    { amountMinor: 0, currency },
  );
}
