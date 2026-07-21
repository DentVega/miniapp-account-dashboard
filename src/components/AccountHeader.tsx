import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText, Box, Card } from "@dentvega/ui-kit";
import type { Account } from "../domain";
import { formatMoney } from "../domain";

interface Props {
  account: Account;
  locale?: string;
}

function AccountHeaderBase({ account, locale }: Props): React.JSX.Element {
  return (
    <Box padding="lg">
      <Card>
        <AppText variant="caption" color="textMuted">
          {account.alias} · {account.maskedNumber}
        </AppText>
        <View style={styles.spacer} />
        <AppText variant="display" accessibilityRole="header">
          {formatMoney(account.balance, locale)}
        </AppText>
      </Card>
    </Box>
  );
}

export const AccountHeader = React.memo(AccountHeaderBase);

const styles = StyleSheet.create({
  spacer: { height: 4 },
});
