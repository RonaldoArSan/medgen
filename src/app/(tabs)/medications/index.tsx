import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { MedicationCard } from "../../../components/MedicationCard";
import MedicationService from "../../../services/MedicationService";
import { BorderRadius, Colors, Shadows, Spacing } from "../../../theme";
import { Medication } from "../../../types";

export default function MedicationsListScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const router = useRouter();

  const loadData = async () => {
    const data = await MedicationService.getMedications();
    setMedications(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MedicationCard
            medication={item}
            onPress={() => router.push(`/medication/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/medication/add")}
      >
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.m,
  },
  fab: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.medium,
  },
});
