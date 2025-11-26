import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MedicationService from "../../services/MedicationService";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";
import { FrequencyType } from "../../types";

export default function AddMedicationScreen() {
  const router = useRouter();
  const { initialData } = useLocalSearchParams();

  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [form, setForm] = useState("");
  const [stock, setStock] = useState("");
  const [frequency, setFrequency] = useState<FrequencyType>("daily");

  useEffect(() => {
    if (initialData && typeof initialData === "string") {
      try {
        const data = JSON.parse(initialData);
        if (data.id) setId(data.id);
        if (data.name) setName(data.name);
        if (data.dosage) setDosage(data.dosage);
        if (data.form) setForm(data.form);
        if (data.stock) setStock(data.stock.toString());
        if (data.frequency) setFrequency(data.frequency);
      } catch (e) {
        console.error("Failed to parse initial data", e);
      }
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!name || !dosage || !stock) {
      Alert.alert("Erro", "Preencha os campos obrigatórios");
      return;
    }

    try {
      const medicationData = {
        name,
        dosage,
        form: form || "Comprimido",
        frequency,
        times: ["08:00"], // Default time for now
        stock: parseInt(stock),
        lowStockThreshold: 5,
        startDate: new Date().toISOString(),
        active: true,
      };

      if (id) {
        await MedicationService.updateMedication({
          ...medicationData,
          id,
        });
      } else {
        await MedicationService.addMedication(medicationData);
      }
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o medicamento");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push("/scanner" as any)}
      >
        <MaterialIcons
          name="qr-code-scanner"
          size={24}
          color={Colors.primary}
        />
        <Text style={styles.scanButtonText}>Escanear Código de Barras</Text>
      </TouchableOpacity>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Medicamento *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Losartana"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.s }]}>
          <Text style={styles.label}>Dosagem *</Text>
          <TextInput
            style={styles.input}
            value={dosage}
            onChangeText={setDosage}
            placeholder="Ex: 50mg"
          />
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: Spacing.s }]}>
          <Text style={styles.label}>Estoque *</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            placeholder="Qtd"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Forma Farmacêutica</Text>
        <TextInput
          style={styles.input}
          value={form}
          onChangeText={setForm}
          placeholder="Ex: Comprimido, Xarope"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Frequência</Text>
        <View style={styles.frequencyContainer}>
          {(["daily", "weekly", "as_needed"] as FrequencyType[]).map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyButton,
                frequency === freq && styles.frequencyButtonActive,
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === freq && styles.frequencyTextActive,
                ]}
              >
                {freq === "daily"
                  ? "Diário"
                  : freq === "weekly"
                  ? "Semanal"
                  : "Se necessário"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {id ? "Atualizar Medicamento" : "Salvar Medicamento"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.m,
  },
  formGroup: {
    marginBottom: Spacing.l,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: Typography.sizes.s,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.weights.medium,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    fontSize: Typography.sizes.m,
    color: Colors.textPrimary,
  },
  frequencyContainer: {
    flexDirection: "row",
    gap: Spacing.s,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.m,
    alignItems: "center",
    backgroundColor: Colors.surface,
  },
  frequencyButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "20",
  },
  frequencyText: {
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  frequencyTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: "center",
    marginTop: Spacing.l,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: Spacing.l,
    gap: Spacing.s,
  },
  scanButtonText: {
    color: Colors.primary,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
  },
});
