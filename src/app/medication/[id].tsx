import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MedicationService from "../../services/MedicationService";
import PharmacyService from "../../services/PharmacyService";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../theme";
import { Medication } from "../../types";

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [medication, setMedication] = useState<Medication | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      loadMedication(id);
    }
  }, [id]);

  const loadMedication = async (medId: string) => {
    const data = await MedicationService.getMedicationById(medId);
    if (data) {
      setMedication(data);
    }
  };

  const handleBuy = async () => {
    if (!medication) return;

    const product = await PharmacyService.findProductForMedication(
      medication.name
    );
    if (product) {
      router.push(`/pharmacy/${product.id}`);
    } else {
      Alert.alert(
        "Produto não encontrado",
        "Não encontramos um produto exato. Redirecionando para a farmácia."
      );
      router.push("/(tabs)/pharmacy");
    }
  };

  const handleEdit = () => {
    if (!medication) return;
    router.push({
      pathname: "/medication/add",
      params: { initialData: JSON.stringify(medication) },
    });
  };

  const handleDelete = async () => {
    Alert.alert(
      "Excluir Medicamento",
      "Tem certeza que deseja excluir este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            if (medication) {
              await MedicationService.deleteMedication(medication.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (!medication) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="medkit" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.name}>{medication.name}</Text>
        <Text style={styles.dosage}>
          {medication.dosage} • {medication.form}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="time-outline"
            size={20}
            color={Colors.textSecondary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Frequência</Text>
            <Text style={styles.infoValue}>
              {medication.frequency === "daily"
                ? "Diariamente"
                : medication.frequency === "weekly"
                ? "Semanalmente"
                : "Se necessário"}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="cube-outline"
            size={20}
            color={Colors.textSecondary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Estoque Atual</Text>
            <Text
              style={[
                styles.infoValue,
                medication.stock <= medication.lowStockThreshold && {
                  color: Colors.accent,
                },
              ]}
            >
              {medication.stock} unidades
            </Text>
          </View>
        </View>

        {medication.instructions && (
          <View style={styles.infoRow}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.textSecondary}
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Instruções</Text>
              <Text style={styles.infoValue}>{medication.instructions}</Text>
            </View>
          </View>
        )}

        {medication.stock <= medication.lowStockThreshold && (
          <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
            <Ionicons name="cart" size={24} color={Colors.white} />
            <Text style={styles.buyButtonText}>Comprar na Farmácia</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
          <Text style={styles.editButtonText}>Editar Medicamento</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={Colors.danger} />
          <Text style={styles.deleteButtonText}>Excluir Medicamento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dosage: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    marginTop: Spacing.m,
  },
  sectionTitle: {
    fontSize: Typography.sizes.l,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: Spacing.l,
  },
  infoContent: {
    marginLeft: Spacing.m,
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.sizes.s,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Typography.sizes.m,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  actionsContainer: {
    padding: Spacing.m,
    gap: Spacing.m,
  },
  editButton: {
    flexDirection: "row",
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.m,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s,
  },
  editButtonText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  deleteButton: {
    flexDirection: "row",
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: BorderRadius.m,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s,
  },
  deleteButtonText: {
    color: Colors.danger,
    fontWeight: Typography.weights.bold,
  },
  buyButton: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.m,
    ...Shadows.small,
  },
  buyButtonText: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
    marginLeft: Spacing.s,
    fontSize: Typography.sizes.m,
  },
});
