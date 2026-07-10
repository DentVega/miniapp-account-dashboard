import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Account, Transaction } from "../domain";
import { mockAccount, mockTransactions } from "../domain";

export interface AccountData {
  readonly account: Account;
  readonly transactions: readonly Transaction[];
}

/** Simulated server fetch — returns the mock fixtures after a short delay. */
function fetchAccountData(): Promise<AccountData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ account: mockAccount, transactions: mockTransactions });
    }, 150);
  });
}

/**
 * React Query hook. The QueryClient is a shared singleton provided by the host,
 * so the cache is unified across host and miniapps (no duplicate fetch).
 */
export function useAccountData(): UseQueryResult<AccountData> {
  return useQuery({
    queryKey: ["account-dashboard", "acc-1"],
    queryFn: fetchAccountData,
    staleTime: 60_000,
  });
}
