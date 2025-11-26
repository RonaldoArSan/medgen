import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../context/CartContext";
import OrderService from "../services/OrderService";
import { BorderRadius, Colors, Spacing, Typography } from "../theme";

export default function CheckoutScreen() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert("Erro", "Por favor, informe o endereço de entrega.");
      return;
    }

    try {
      await OrderService.createOrder("user-1", items, address);
      clearCart();
      Alert.alert("Sucesso", "Seu pedido foi realizado com sucesso!", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível processar seu pedido.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
        <TextInput
          style={styles.input}
          placeholder="Rua, Número, Bairro, Cidade - UF"
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo do Pedido</Text>
        {items.map((item) => (
          <View key={item.productId} style={styles.summaryItem}>
            <Text style={styles.summaryText}>
              {item.quantity}x {item.productName}
            </Text>
            <Text style={styles.summaryPrice}>
              R$ {(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagamento</Text>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "credit_card" && styles.paymentOptionSelected,
          ]}
          onPress={() => setPaymentMethod("credit_card")}
        >
          <Text
            style={[
              styles.paymentText,
              paymentMethod === "credit_card" && styles.paymentTextSelected,
            ]}
          >
            Cartão de Crédito
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "pix" && styles.paymentOptionSelected,
          ]}
          onPress={() => setPaymentMethod("pix")}
        >
          <Text
            style={[
              styles.paymentText,
              paymentMethod === "pix" && styles.paymentTextSelected,
            ]}
          >
            PIX
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
        <Text style={styles.buttonText}>Confirmar Pedido</Text>
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
  section: {
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    fontSize: Typography.sizes.m,
    minHeight: 80,
    textAlignVertical: "top",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.s,
  },
  summaryText: {
    color: Colors.textSecondary,
    flex: 1,
  },
  summaryPrice: {
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.m,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: Typography.sizes.l,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  paymentOption: {
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.s,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + "20",
  },
  paymentText: {
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  paymentTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  button: {
    backgroundColor: Colors.secondary,
    padding: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: "center",
    marginVertical: Spacing.l,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
  },
});
