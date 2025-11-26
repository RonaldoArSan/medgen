import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";
import { BorderRadius, Colors, Spacing, Typography } from "../theme";

export default function CartScreen() {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert(
        "Carrinho Vazio",
        "Adicione itens ao carrinho antes de finalizar."
      );
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="shopping-cart"
          size={64}
          color={Colors.textLight}
        />
        <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push("/(tabs)/pharmacy")}
        >
          <Text style={styles.continueButtonText}>Continuar Comprando</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.productName}</Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() =>
                  updateQuantity(item.productId, item.quantity - 1)
                }
                style={styles.controlButton}
              >
                <MaterialIcons name="remove" size={20} color={Colors.primary} />
              </TouchableOpacity>

              <Text style={styles.quantity}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() =>
                  updateQuantity(item.productId, item.quantity + 1)
                }
                style={styles.controlButton}
              >
                <MaterialIcons name="add" size={20} color={Colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => removeFromCart(item.productId)}
                style={[
                  styles.controlButton,
                  {
                    marginLeft: Spacing.m,
                    backgroundColor: Colors.danger + "20",
                  },
                ]}
              >
                <MaterialIcons name="delete" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueShoppingButton}
          onPress={() => router.push("/(tabs)/pharmacy")}
        >
          <Text style={styles.continueShoppingButtonText}>
            Continuar Comprando
          </Text>
        </TouchableOpacity>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.sizes.l,
    color: Colors.textSecondary,
    marginTop: Spacing.m,
    marginBottom: Spacing.xl,
  },
  continueButton: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.l,
  },
  continueButtonText: {
    color: Colors.white,
    fontWeight: Typography.weights.bold,
  },
  list: {
    padding: Spacing.m,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.m,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: Typography.sizes.m,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryLight + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    marginHorizontal: Spacing.m,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  footer: {
    padding: Spacing.l,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.l,
  },
  totalLabel: {
    fontSize: Typography.sizes.l,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
  },
  continueShoppingButton: {
    paddingVertical: Spacing.m,
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  continueShoppingButtonText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.m,
  },
});
