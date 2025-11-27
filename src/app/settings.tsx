import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../theme";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Configurações</Text>
      <Text style={styles.subtext}>
        Em breve: Ajustes de conta e preferências.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing.l,
  },
  text: {
    fontSize: Typography.sizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.s,
  },
  subtext: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
