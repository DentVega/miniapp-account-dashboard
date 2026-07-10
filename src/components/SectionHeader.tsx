import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText, useTheme } from "@org/ui-kit";
import type { Money } from "../domain";
import { formatMoney } from "../domain";

interface Props {
  dateISO: string;
  net: Money;
  locale?: string;
}

function SectionHeaderBase({ dateISO, net, locale }: Props): React.JSX.Element {
  const theme = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <AppText variant="caption" color="textMuted">
        {dateISO}
      </AppText>
      <AppText variant="caption" color="textMuted">
        {formatMoney(net, locale)}
      </AppText>
    </View>
  );
}

export const SectionHeader = React.memo(SectionHeaderBase);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});
