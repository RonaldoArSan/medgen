import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MedicationCard } from "../../components/MedicationCard";
import MedicationService from "../../services/MedicationService";
import { Colors, Spacing, Typography } from "../../theme";
import { Medication } from "../../types";

export default function HomePage() {
  const router = useRouter();
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

  const activeMedications = medications.filter((m) => m.active);
  // Only show in alert section if NOT on the way
  const visibleLowStock = lowStockMeds.filter((item) => !item.isOnTheWay);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, João</Text>
        <Text style={styles.subtitle}>
          Aqui está o resumo dos seus medicamentos
        </Text>
      </View>

      {visibleLowStock.length > 0 && (
        <View style={styles.section}>
          <View style={styles.alertHeader}>
            <MaterialIcons name="warning" size={24} color={Colors.accent} />
            <Text style={styles.alertTitle}>Estoque Baixo</Text>
          </View>
          {visibleLowStock.map(({ medication }) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onPress={() => router.push(`/medication/${medication.id}`)}
            />
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seus Medicamentos</Text>
        {activeMedications.length > 0 ? (
          activeMedications.map((med) => {
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
  header: {
    padding: Spacing.l,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: Spacing.m,
  },
  greeting: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.m,
    color: Colors.primaryLight,
  },
  section: {
    padding: Spacing.m,
  },
  sectionTitle: {
    fontSize: Typography.sizes.l,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  alertTitle: {
    fontSize: Typography.sizes.l,
    fontWeight: Typography.weights.bold,
    color: Colors.accent,
    marginLeft: Spacing.s,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.textLight,
    marginTop: Spacing.l,
  },
});
