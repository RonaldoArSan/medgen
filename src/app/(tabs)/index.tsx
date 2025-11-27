import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MedicationCard } from "../../components/MedicationCard";
import MedicationService from "../../services/MedicationService";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../theme";
import { Medication } from "../../types";

import { useCart } from "../../context/CartContext";
import PharmacyService from "../../services/PharmacyService";

export default function HomePage() {
  const router = useRouter();
  const { addMultipleToCart } = useCart();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [lowStockMeds, setLowStockMeds] = useState<
    { medication: Medication; isOnTheWay: boolean }[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [allMeds, lowStock] = await Promise.all([
      MedicationService.getMedications(),
      MedicationService.getLowStockMedications(),
    ]);
    setMedications(allMeds);
    setLowStockMeds(lowStock);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleBuyLowStock = async () => {
    const productsToAdd = [];

    for (const item of visibleLowStock) {
      const product = await PharmacyService.findProductForMedication(
        item.medication.name
      );
      if (product) {
        productsToAdd.push({ product, quantity: 1 });
      }
    }

    if (productsToAdd.length > 0) {
      addMultipleToCart(productsToAdd);
      router.push("/cart");
    } else {
      // Fallback if no products found automatically
      router.push("/(tabs)/pharmacy");
    }
  };

  const activeMedications = medications.filter((m) => m.active).reverse();
  // Only show in alert section if NOT on the way
  const visibleLowStock = lowStockMeds.filter((item) => !item.isOnTheWay);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, João</Text>
        <Text style={styles.subtitle}>
          Aqui está o resumo dos seus medicamentos
        </Text>
      </View>

      {visibleLowStock.length > 0 && (
        <View style={styles.alertCard}>
          <View style={styles.alertContent}>
            <Ionicons name="warning-outline" size={32} color={Colors.white} />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Estoque baixo!</Text>
              <Text style={styles.alertSubtitle}>
                {visibleLowStock.length} medicamento(s) precisa(m) ser
                reabastecido(s)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={handleBuyLowStock}
          >
            <Text style={styles.alertButtonText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/medication/add")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#312e81" }]}>
            <Ionicons name="add-circle-outline" size={28} color="#818cf8" />
          </View>
          <Text style={styles.actionTitle}>Adicionar</Text>
          <Text style={styles.actionSubtitle}>Novo medicamento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/(tabs)/pharmacy")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#064e3b" }]}>
            <Ionicons name="bag-handle-outline" size={28} color="#34d399" />
          </View>
          <Text style={styles.actionTitle}>Farmácia</Text>
          <Text style={styles.actionSubtitle}>Comprar remédios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Meus Medicamentos</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/medications")}>
          <Text style={styles.seeAllText}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.medicationsList}>
        {activeMedications.length > 0 ? (
          activeMedications.slice(0, 5).map((med) => {
            const status = lowStockMeds.find((l) => l.medication.id === med.id);
            return (
              <MedicationCard
                key={med.id}
                medication={med}
                isOnTheWay={status?.isOnTheWay}
                onPress={() => router.push(`/medication/${med.id}`)}
              />
            );
          })
        ) : (
          <Text style={styles.emptyText}>Nenhum medicamento ativo.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.m,
    paddingTop: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.l,
  },
  greeting: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
  },
  alertCard: {
    backgroundColor: "#7f1d1d", // Dark Red
    borderRadius: BorderRadius.l,
    padding: Spacing.m,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.l,
  },
  alertContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  alertTextContainer: {
    marginLeft: Spacing.m,
    flex: 1,
  },
  alertTitle: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
  },
  alertSubtitle: {
    color: "#fca5a5", // Light Red
    fontSize: Typography.sizes.s,
    marginTop: 2,
  },
  alertButton: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
  },
  alertButtonText: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.m,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.l,
    padding: Spacing.l,
    alignItems: "center",
    ...Shadows.small,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.m,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  actionTitle: {
    color: Colors.textPrimary,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
    marginBottom: 4,
  },
  actionSubtitle: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.xs,
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  seeAllText: {
    color: "#6366f1", // Indigo
    fontSize: Typography.sizes.s,
    fontWeight: Typography.weights.medium,
  },
  medicationsList: {
    gap: Spacing.s,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.textLight,
    marginTop: Spacing.l,
  },
});
