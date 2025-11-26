import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import OrderService from "../../services/OrderService";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";
import { Order } from "../../types";

export default function OrdersControlScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await OrderService.getOrders();
    setOrders(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return Colors.secondary;
      case "shipped":
        return Colors.primary;
      case "cancelled":
        return Colors.danger;
      default:
        return Colors.accent;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Entregue";
      case "shipped":
        return "Enviado";
      case "cancelled":
        return "Cancelado";
      case "processing":
        return "Processando";
      default:
        return "Pendente";
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString("pt-BR")}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            </View>

            <View style={styles.items}>
              {item.items.map((orderItem, index) => (
                <Text key={index} style={styles.itemText}>
                  {orderItem.quantity}x {orderItem.productName}
                </Text>
              ))}
            </View>

            <View style={styles.footer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {item.total.toFixed(2)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum pedido realizado ainda.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: Spacing.m,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  date: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.s,
    paddingVertical: 4,
    borderRadius: BorderRadius.s,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  items: {
    marginBottom: Spacing.m,
  },
  itemText: {
    fontSize: Typography.sizes.s,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.s,
  },
  totalLabel: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Typography.sizes.l,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: Typography.sizes.m,
  },
});
