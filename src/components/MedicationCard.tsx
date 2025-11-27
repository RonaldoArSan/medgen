import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BorderRadius, Colors, Shadows, Spacing, Typography } from "../theme";
import { Medication } from "../types";

interface MedicationCardProps {
  medication: Medication;
  onPress?: () => void;
  isOnTheWay?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onPress,
  isOnTheWay = false,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {medication.imageUri ? (
            <Image
              source={{ uri: medication.imageUri }}
              style={styles.medicationImage}
            />
          ) : (
            <Ionicons name="medkit" size={24} color={Colors.primary} />
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{medication.name}</Text>
          <Text style={styles.details}>
            {medication.dosage} • {medication.form}
          </Text>
        </View>
        {isOnTheWay ? (
          <View style={styles.statusBadge}>
            <Ionicons name="cube" size={20} color={Colors.secondary} />
          </View>
        ) : (
          medication.stock <= medication.lowStockThreshold && (
            <View style={styles.warningBadge}>
              <Ionicons name="warning" size={18} color={Colors.accent} />
            </View>
          )
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.timeContainer}>
          <Ionicons
            name="time-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.timeText}>{medication.times.join(", ")}</Text>
        </View>
        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.stockText,
              medication.stock <= medication.lowStockThreshold && {
                color: Colors.accent,
                fontWeight: "bold",
              },
            ]}
          >
            Estoque: {medication.stock}
          </Text>
          {medication.stock <= medication.lowStockThreshold && !isOnTheWay && (
            <View style={styles.cartIcon}>
              <Ionicons name="cart" size={16} color={Colors.accent} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    ...Shadows.small,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.s,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  details: {
    fontSize: Typography.sizes.s,
    color: Colors.textSecondary,
  },
  statusBadge: {
    padding: Spacing.xs,
  },
  warningBadge: {
    padding: Spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.s,
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  stockText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartIcon: {
    marginLeft: Spacing.xs,
  },
  medicationImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.round,
  },
});
