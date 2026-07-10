/**
 * Build-time entry (shared package @org/account-dashboard, ADR-005).
 * The same components are exposed as a federated remote via rspack.config.mjs
 * ("./Entry"). One source, two consumption modes.
 */
export { default as Entry } from "./Entry";
export { Dashboard } from "./Dashboard";
export { useAccountData } from "./data/useAccountData";
export type { AccountData } from "./data/useAccountData";
export * from "./domain";
