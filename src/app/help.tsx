import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BorderRadius, Colors, Spacing, Typography } from "../theme";

export default function HelpScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Ajuda e Suporte</Text>

      <View style={styles.card}>
        <Text style={styles.question}>Como adicionar um medicamento?</Text>
        <Text style={styles.answer}>
          Vá para a aba "Medicamentos" e toque no botão "+" no canto inferior
          direito. Preencha os dados e salve.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>Como fazer um pedido?</Text>
        <Text style={styles.answer}>
          Navegue pela aba "Farmácia", adicione produtos ao carrinho e finalize
          a compra na tela de Checkout.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>Precisa de mais ajuda?</Text>
        <Text style={styles.answer}>
          Entre em contato conosco pelo email suporte@mediger.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.m,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Spacing.l,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.m,
  },
  question: {
    fontSize: Typography.sizes.m,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: Spacing.s,
  },
  answer: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
