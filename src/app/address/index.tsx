import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import UserService from "../../services/UserService";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";

export default function AddressSelectionScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const user = await UserService.getUser();
    setCurrentAddress(user.address || null);
    setAddresses(user.savedAddresses || []);
  };

  const handleSelectAddress = async (address: string) => {
    await UserService.updateAddress(address);
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/address/add")}
      >
        <MaterialIcons name="add" size={24} color={Colors.primary} />
        <Text style={styles.addButtonText}>Adicionar Novo Endereço</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Endereços Salvos</Text>

      <FlatList
        data={addresses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.addressCard,
              item === currentAddress && styles.selectedCard,
            ]}
            onPress={() => handleSelectAddress(item)}
          >
            <View style={styles.addressInfo}>
              <MaterialIcons
                name="location-on"
                size={24}
                color={
                  item === currentAddress
                    ? Colors.primary
                    : Colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.addressText,
                  item === currentAddress && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </View>
            {item === currentAddress && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color={Colors.primary}
              />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum endereço salvo.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.m,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    marginBottom: Spacing.l,
  },
  addButtonText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.m,
    marginLeft: Spacing.s,
  },
  sectionTitle: {
    fontSize: Typography.sizes.l,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "10",
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.m,
  },
  addressText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.m,
    marginLeft: Spacing.m,
    flex: 1,
  },
  selectedText: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
