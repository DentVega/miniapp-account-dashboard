import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { FlashList, type ListRenderItem } from "@shopify/flash-list";
import { AppText, Box, useTheme } from "@dentvega/ui-kit";
import type { ListItem } from "./domain";
import { groupByDay, toListItems } from "./domain";
import { useAccountData } from "./data/useAccountData";
import { AccountHeader } from "./components/AccountHeader";
import { SectionHeader } from "./components/SectionHeader";
import { TransactionRow } from "./components/TransactionRow";

const keyExtractor = (item: ListItem): string =>
  item.type === "header" ? `h:${item.dateISO}` : `r:${item.tx.id}`;

const getItemType = (item: ListItem): string => item.type;

export function Dashboard(): React.JSX.Element {
  const theme = useTheme();
  const { data, isPending, isError } = useAccountData();

  const items = useMemo<ListItem[]>(() => {
    if (data === undefined) return [];
    return toListItems(groupByDay(data.transactions, data.account.balance.currency));
  }, [data]);

  // Stable renderItem — list items shouldn't re-create their renderer each pass.
  const renderItem = useCallback<ListRenderItem<ListItem>>(({ item }) => {
    if (item.type === "header") {
      return <SectionHeader dateISO={item.dateISO} net={item.net} />;
    }
    return <TransactionRow tx={item.tx} />;
  }, []);

  const header = useMemo(
    () => (data !== undefined ? <AccountHeader account={data.account} /> : null),
    [data],
  );

  if (isPending) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || data === undefined) {
    return (
      <Box padding="xl" style={styles.center}>
        <AppText variant="title" color="danger">
          No pudimos cargar tu cuenta
        </AppText>
        <AppText variant="body" color="textMuted">
          Intenta de nuevo en unos momentos.
        </AppText>
      </Box>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={56}
        ListHeaderComponent={header}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
});
