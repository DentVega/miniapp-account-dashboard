import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@org/ui-kit";
import type { Transaction } from "../domain";
import { formatMoney } from "../domain";

interface Props {
  tx: Transaction;
  locale?: string;
}

function TransactionRowBase({ tx, locale }: Props): React.JSX.Element {
  const isDebit = tx.direction === "debit";
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <AppText variant="body" numberOfLines={1}>
          {tx.description}
        </AppText>
        {tx.category !== undefined ? (
          <AppText variant="caption" color="textMuted">
            {tx.category}
          </AppText>
        ) : null}
      </View>
      <AppText variant="body" color={isDebit ? "text" : "primary"}>
        {formatMoney(tx.amount, locale)}
      </AppText>
    </View>
  );
}

/** Memoized: list items must not re-render on unrelated parent updates. */
export const TransactionRow = React.memo(TransactionRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  info: { flex: 1, gap: 2 },
});
