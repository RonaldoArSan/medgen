import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { BorderRadius, Colors, Spacing, Typography } from "../theme";

export default function NotificationsScreen() {
  const [isEnabled, setIsEnabled] = React.useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <View>
          <Text style={styles.label}>Notificações de Medicamentos</Text>
          <Text style={styles.sublabel}>
            Receba lembretes para tomar seus remédios
          </Text>
        </View>
        <Switch
          trackColor={{ false: Colors.border, true: Colors.primary }}
          thumbColor={Colors.white}
          onValueChange={() => setIsEnabled((previousState) => !previousState)}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.m,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
  },
  label: {
    fontSize: Typography.sizes.m,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  sublabel: {
    fontSize: Typography.sizes.s,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
