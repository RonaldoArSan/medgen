import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MOCK_USER } from "../../services/mockData";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";

export default function ProfileScreen() {
  const router = useRouter();
  const user = MOCK_USER;

  const menuItems = [
    { icon: "history", label: "Histórico de Pedidos", route: "/orders" },
    {
      icon: "notifications",
      label: "Configurar Notificações",
      route: "/notifications",
    },
    { icon: "settings", label: "Configurações", route: "/settings" },
    { icon: "help", label: "Ajuda e Suporte", route: "/help" },
    { icon: "logout", label: "Sair", route: "/logout", color: Colors.danger },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minha Conta</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() =>
              item.route !== "/logout" && router.push(item.route as any)
            }
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: (item.color || Colors.primary) + "20" },
              ]}
            >
              <MaterialIcons
                name={item.icon as any}
                size={24}
                color={item.color || Colors.primary}
              />
            </View>
            <Text
              style={[styles.menuLabel, item.color && { color: item.color }]}
            >
              {item.label}
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Endereço</Text>
            <Text style={styles.infoValue}>{user.address}</Text>
          </View>
        </View>
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
    alignItems: "center",
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.m,
  },
  sectionTitle: {
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    marginBottom: Spacing.m,
    marginLeft: Spacing.s,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.s,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
  },
  infoRow: {
    paddingVertical: Spacing.s,
  },
  infoLabel: {
    fontSize: Typography.sizes.s,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Typography.sizes.m,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.s,
  },
});
